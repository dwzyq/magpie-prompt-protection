// Magpie gateway middleware: regex-based prompt protection.
//
// Rules live in this plugin's options so the management page and the gateway
// read exactly the same configuration:
//
// {
//   "rules": [
//     {
//       "id": "rule-...",
//       "name": "mask-api-keys",
//       "description": "Hide API keys",
//       "pattern": "sk-[A-Za-z0-9]{48}",
//       "status": "enabled",
//       "settings": {
//         "action": "mask",
//         "replacement": "[REDACTED_API_KEY]",
//         "scopes": ["system", "user"]
//       }
//     }
//   ],
//   "rejectMessage": "request blocked by prompt protection policy"
// }
//
// Rules run in array order. Every mask rule is applied to the preceding
// result; the first matching reject rule ends the request. An empty scope
// list means every role. Only text fields are inspected: images, tool calls,
// tool arguments and non-text content are left untouched.

const DEFAULT_REJECT_MESSAGE = "request blocked by prompt protection policy";
const REGEX_CACHE_LIMIT = 256;

const regexCache = new Map();

export function onRequest(body, ctx) {
  if (!body || typeof body !== "object") return;

  const options = ctx && ctx.options && typeof ctx.options === "object" ? ctx.options : {};
  const rules = Array.isArray(options.rules) ? options.rules : [];
  if (rules.length === 0) return;

  const protocol = String((ctx && ctx.protocol) || "").toLowerCase();
  const rejectMessage =
    typeof options.rejectMessage === "string" && options.rejectMessage.trim()
      ? options.rejectMessage.trim()
      : DEFAULT_REJECT_MESSAGE;

  let modified = false;

  for (const rule of rules) {
    if (!rule || typeof rule !== "object" || rule.status !== "enabled") continue;
    if (typeof rule.pattern !== "string" || rule.pattern.length === 0) continue;

    const settings = rule.settings && typeof rule.settings === "object" ? rule.settings : {};
    const action = settings.action === "reject" ? "reject" : "mask";
    const scopes = Array.isArray(settings.scopes) ? settings.scopes : [];
    const replacement = typeof settings.replacement === "string" ? settings.replacement : "";
    const regex = compileRule(rule);
    if (!regex) continue;

    let matched = false;

    eachTextField(body, protocol, function (holder, key, role) {
      if (!scopeMatches(scopes, role)) return;

      const value = holder[key];
      regex.lastIndex = 0;
      if (!regex.test(value)) return;

      matched = true;
      if (action === "mask") {
        regex.lastIndex = 0;
        holder[key] = value.replace(regex, function () {
          return replacement;
        });
      }
    });

    if (matched && action === "reject") {
      if (ctx && typeof ctx.reject === "function") ctx.reject(400, rejectMessage);
      return;
    }
    if (matched) modified = true;
  }

  if (modified) return body;
}

function compileRule(rule) {
  const settings = rule.settings && typeof rule.settings === "object" ? rule.settings : {};
  const extraFlags = typeof settings.flags === "string" ? settings.flags : "";
  const key = extraFlags + "\u0000" + rule.pattern;

  if (regexCache.has(key)) return regexCache.get(key);

  const normalized = normalizePattern(rule.pattern, extraFlags);
  try {
    const re = new RegExp(normalized.source, normalized.flags);
    rememberRegex(key, re);
    return re;
  } catch (err) {
    console.log(
      "prompt-protection: invalid regex for rule " +
        (rule.name || rule.id || "(unnamed)") +
        ": " +
        err.message
    );
    rememberRegex(key, null);
    return null;
  }
}

function rememberRegex(key, value) {
  regexCache.set(key, value);
  if (regexCache.size > REGEX_CACHE_LIMIT) {
    regexCache.delete(regexCache.keys().next().value);
  }
}

// Convert the .NET-style leading inline flags AxonHub documents, such as
// (?i) and (?im), into JavaScript RegExp flags. A per-rule "flags" field is
// also supported. The middleware always adds "g" so every occurrence is
// replaced.
function normalizePattern(pattern, extraFlags) {
  let source = String(pattern);
  let flags = sanitizeFlags(extraFlags);

  for (;;) {
    const match = source.match(/^\(\?([ims]+)\)/);
    if (!match) break;
    flags = sanitizeFlags(flags + match[1]);
    source = source.slice(match[0].length);
  }

  if (flags.indexOf("g") < 0) flags += "g";
  return { source: source, flags: flags };
}

function sanitizeFlags(value) {
  let flags = "";
  const text = String(value || "");
  for (const flag of ["g", "i", "m", "s", "u", "y"]) {
    if (text.indexOf(flag) >= 0 && flags.indexOf(flag) < 0) flags += flag;
  }
  return flags;
}

function scopeMatches(scopes, role) {
  if (!Array.isArray(scopes) || scopes.length === 0) return true;
  const normalized = normalizeRole(role);
  return scopes.indexOf(normalized) >= 0;
}

function normalizeRole(role) {
  let value = String(role || "").toLowerCase();
  if (value === "function") return "tool";
  if (value === "model") return "assistant";
  return value;
}

function eachTextField(body, protocol, visit) {
  switch (protocol) {
    case "responses":
      collectResponses(body, visit);
      return;
    case "anthropic":
      collectAnthropic(body, visit);
      return;
    case "gemini":
      collectGemini(body, visit);
      return;
    case "chat":
      collectChat(body, visit);
      return;
    default:
      if (Array.isArray(body.messages)) collectChat(body, visit);
      else if (Array.isArray(body.contents)) collectGemini(body, visit);
  }
}

// OpenAI Chat Completions (also used by OpenAI-compatible providers).
function collectChat(body, visit) {
  const messages = Array.isArray(body.messages) ? body.messages : [];
  for (const message of messages) {
    if (!message || typeof message !== "object") continue;
    addContent(message, "content", normalizeRole(message.role), visit);
  }
}

// OpenAI Responses: top-level instructions, string input, message items and
// tool-output items.
function collectResponses(body, visit) {
  if (typeof body.instructions === "string") visit(body, "instructions", "system");

  const input = body.input;
  if (typeof input === "string") {
    visit(body, "input", "user");
    return;
  }
  if (!Array.isArray(input)) return;

  for (const item of input) {
    if (!item || typeof item !== "object") continue;

    const type = typeof item.type === "string" ? item.type.toLowerCase() : "";
    const role = normalizeRole(item.role) || "user";

    if (type === "message" || type === "input_text" || type === "") {
      if (typeof item.content === "string") {
        visit(item, "content", role);
      } else if (Array.isArray(item.content)) {
        addTextParts(item, "content", role, visit, ["input_text", "output_text", "text"]);
      } else if (typeof item.text === "string") {
        visit(item, "text", role);
      }
      continue;
    }

    if (type === "function_call_output" || type === "custom_tool_call_output") {
      if (typeof item.output === "string") {
        visit(item, "output", "tool");
      } else if (Array.isArray(item.output)) {
        addTextParts(item, "output", "tool", visit, ["input_text", "output_text", "text"]);
      }
    }
  }
}

// Anthropic Messages: top-level system, text blocks and nested tool_result
// blocks.
function collectAnthropic(body, visit) {
  if (typeof body.system === "string") {
    visit(body, "system", "system");
  } else if (Array.isArray(body.system)) {
    addTextParts(body, "system", "system", visit, ["text"]);
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  for (const message of messages) {
    if (!message || typeof message !== "object") continue;
    const role = normalizeRole(message.role) || "user";

    if (typeof message.content === "string") {
      visit(message, "content", role);
      continue;
    }
    if (!Array.isArray(message.content)) continue;

    for (const block of message.content) {
      if (!block || typeof block !== "object") continue;
      const type = typeof block.type === "string" ? block.type.toLowerCase() : "";

      if (type === "text" && typeof block.text === "string") {
        visit(block, "text", role);
      } else if (type === "tool_result") {
        if (typeof block.content === "string") {
          visit(block, "content", "tool");
        } else if (Array.isArray(block.content)) {
          addTextParts(block, "content", "tool", visit, ["text"]);
        }
      }
    }
  }
}

// Gemini generateContent: systemInstruction parts, content parts and
// functionResponse.response strings.
function collectGemini(body, visit) {
  const system = body.systemInstruction;
  if (system && typeof system === "object" && Array.isArray(system.parts)) {
    addGeminiParts(system, "system", visit);
  }

  const contents = Array.isArray(body.contents) ? body.contents : [];
  for (const content of contents) {
    if (!content || typeof content !== "object") continue;
    const role = normalizeRole(content.role) || "user";
    if (Array.isArray(content.parts)) addGeminiParts(content, role, visit);
  }
}

function addGeminiParts(content, role, visit) {
  for (const part of content.parts) {
    if (!part || typeof part !== "object") continue;
    if (typeof part.text === "string") visit(part, "text", role);

    const response = part.functionResponse && part.functionResponse.response;
    if (response !== undefined) addJSONStrings(response, "tool", visit, part.functionResponse, "response");
  }
}

function addContent(container, key, role, visit) {
  const content = container[key];
  if (typeof content === "string") {
    visit(container, key, role);
    return;
  }
  if (!Array.isArray(content)) return;

  for (const part of content) {
    if (!part || typeof part !== "object" || typeof part.text !== "string") continue;
    const type = typeof part.type === "string" ? part.type.toLowerCase() : "";
    if (type !== "" && type !== "text") continue;
    visit(part, "text", role);
  }
}

function addTextParts(container, key, role, visit, allowedTypes) {
  const parts = container[key];
  if (!Array.isArray(parts)) return;

  for (const part of parts) {
    if (!part || typeof part !== "object" || typeof part.text !== "string") continue;
    const type = typeof part.type === "string" ? part.type.toLowerCase() : "";
    if (type !== "" && allowedTypes.indexOf(type) < 0) continue;
    visit(part, "text", role);
  }
}

function addJSONStrings(value, role, visit, holder, key) {
  if (typeof value === "string") {
    visit(holder, key, role);
    return;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      addJSONStrings(value[index], role, visit, value, index);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const childKey of Object.keys(value)) {
      addJSONStrings(value[childKey], role, visit, value, childKey);
    }
  }
}
