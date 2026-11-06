(function () {
  "use strict";

  const DEFAULT_REJECT_MESSAGE = "request blocked by prompt protection policy";
  const VALID_SCOPES = ["system", "developer", "user", "assistant", "tool"];
  const DEFAULT_RULE = {
    name: "",
    description: "",
    pattern: "",
    action: "mask",
    replacement: "[MASKED]",
    flags: "",
    scopes: ["user"],
  };

  const TEXT = {
    zh: {
      "app.eyebrow": "MAGPIE · 网关中间件",
      "app.title": "提示保护",
      "app.subtitle": "在请求发往模型之前，用正则规则对提示内容进行脱敏或拒绝。",
      "app.create": "创建规则",
      "app.loading": "正在加载…",
      "app.saved": "已保存",
      "app.saving": "保存中…",
      "app.unsaved": "未保存",
      "app.saveError": "保存失败",
      "app.footnote": "规则仅在 Magpie 网关内本地执行；页面不读取、不存储任何对话内容。",
      "stats.total": "规则总数",
      "stats.enabled": "已启用",
      "stats.reject": "拒绝规则",
      "stats.disabled": "已禁用",
      "search.placeholder": "按名称筛选…",
      "filter.all": "全部状态",
      "filter.enabled": "已启用",
      "filter.disabled": "已禁用",
      "bulk.enable": "批量启用",
      "bulk.disable": "批量禁用",
      "bulk.delete": "批量删除",
      "selection.count": "已选 {count} 条",
      "table.name": "名称",
      "table.pattern": "正则表达式",
      "table.action": "处理方式",
      "table.scopes": "作用范围",
      "table.status": "状态",
      "table.updated": "更新时间",
      "table.actions": "操作",
      "row.edit": "编辑",
      "row.delete": "删除",
      "action.mask": "脱敏",
      "action.reject": "拒绝",
      "scope.system": "系统",
      "scope.developer": "开发者",
      "scope.user": "用户",
      "scope.assistant": "助手",
      "scope.tool": "工具",
      "scope.all": "全部",
      "empty.title": "还没有提示保护规则",
      "empty.hint": "创建第一条规则，命中的内容会被脱敏或拒绝。",
      "page.size": "每页",
      "page.prev": "上一页",
      "page.next": "下一页",
      "page.total": "共 {count} 条",
      "page.info": "第 {page} / {pages} 页",
      "advanced.title": "高级设置",
      "advanced.rejectMessage": "拒绝时的错误信息",
      "advanced.rejectMessageHelp": "命中拒绝规则时返回给 Agent 的错误文本。",
      "dialog.subtitle": "配置正则、处理方式与作用范围。",
      "dialog.createTitle": "创建提示保护规则",
      "dialog.editTitle": "编辑提示保护规则",
      "dialog.cancel": "取消",
      "dialog.createAction": "创建",
      "dialog.saveAction": "保存",
      "dialog.newDisabledHint": "新建规则默认禁用，创建后请在列表中启用。",
      "field.name": "名称",
      "field.description": "描述",
      "field.pattern": "正则表达式",
      "field.action": "处理方式",
      "field.replacement": "替换文本",
      "field.flags": "正则标志（可选）",
      "field.flagsPlaceholder": "例如 i、m、s",
      "field.scopes": "作用范围",
      "field.scopesHelp": "不选择任何范围时，规则对所有消息角色生效。",
      "test.title": "测试预览",
      "test.hint": "在本地实时匹配，不会发送测试文本。",
      "test.input": "测试文本",
      "test.placeholder": "输入一段文本，实时查看正则匹配效果",
      "test.idle": "输入测试文本后显示预览",
      "test.noMatch": "无匹配",
      "test.rejectMatch": "命中：该请求将被拒绝",
      "test.invalid": "无效的正则表达式：",
      "test.maskResult": "脱敏结果",
      "validation.nameRequired": "请输入规则名称",
      "validation.patternRequired": "请输入正则表达式",
      "validation.patternInvalid": "正则表达式无效：",
      "validation.replacementRequired": "脱敏操作必须填写替换文本",
      "validation.duplicateName": "规则名称已存在",
      "delete.title": "删除提示保护规则",
      "delete.bulkTitle": "删除所选规则",
      "delete.description": "确定删除规则“{name}”吗？此操作不可撤销。",
      "delete.bulkDescription": "确定删除 {count} 条规则吗？此操作不可撤销。",
      "delete.confirm": "删除",
      "status.enable": "启用规则",
      "status.disable": "禁用规则",
      "toast.deleted": "规则已删除",
      "toast.bulkDeleted": "所选规则已删除",
    },
    en: {
      "app.eyebrow": "MAGPIE · GATEWAY MIDDLEWARE",
      "app.title": "Prompt Protection",
      "app.subtitle": "Mask or reject prompt content with regex rules before requests reach a model.",
      "app.create": "Create rule",
      "app.loading": "Loading…",
      "app.saved": "Saved",
      "app.saving": "Saving…",
      "app.unsaved": "Unsaved",
      "app.saveError": "Save failed",
      "app.footnote": "Rules run locally inside the Magpie gateway. This page never reads or stores conversation content.",
      "stats.total": "Total rules",
      "stats.enabled": "Enabled",
      "stats.reject": "Reject rules",
      "stats.disabled": "Disabled",
      "search.placeholder": "Filter by name…",
      "filter.all": "All statuses",
      "filter.enabled": "Enabled",
      "filter.disabled": "Disabled",
      "bulk.enable": "Enable",
      "bulk.disable": "Disable",
      "bulk.delete": "Delete",
      "selection.count": "{count} selected",
      "table.name": "Name",
      "table.pattern": "Pattern",
      "table.action": "Action",
      "table.scopes": "Scopes",
      "table.status": "Status",
      "table.updated": "Updated",
      "table.actions": "Actions",
      "row.edit": "Edit",
      "row.delete": "Delete",
      "action.mask": "Mask",
      "action.reject": "Reject",
      "scope.system": "System",
      "scope.developer": "Developer",
      "scope.user": "User",
      "scope.assistant": "Assistant",
      "scope.tool": "Tool",
      "scope.all": "All",
      "empty.title": "No prompt protection rules yet",
      "empty.hint": "Create your first rule to mask or reject matching content.",
      "page.size": "Per page",
      "page.prev": "Previous",
      "page.next": "Next",
      "page.total": "{count} rules",
      "page.info": "Page {page} of {pages}",
      "advanced.title": "Advanced",
      "advanced.rejectMessage": "Reject message",
      "advanced.rejectMessageHelp": "Error text returned to the agent when a reject rule matches.",
      "dialog.subtitle": "Configure the pattern, action and scopes.",
      "dialog.createTitle": "Create prompt protection rule",
      "dialog.editTitle": "Edit prompt protection rule",
      "dialog.cancel": "Cancel",
      "dialog.createAction": "Create",
      "dialog.saveAction": "Save",
      "dialog.newDisabledHint": "New rules start disabled. Enable them from the list.",
      "field.name": "Name",
      "field.description": "Description",
      "field.pattern": "Pattern",
      "field.action": "Action",
      "field.replacement": "Replacement",
      "field.flags": "Regex flags (optional)",
      "field.flagsPlaceholder": "e.g. i, m, s",
      "field.scopes": "Scopes",
      "field.scopesHelp": "With no scope selected, the rule applies to every message role.",
      "test.title": "Test preview",
      "test.hint": "Matched locally; test text is never sent.",
      "test.input": "Test text",
      "test.placeholder": "Type text to preview the regex result",
      "test.idle": "Enter test text to see a preview",
      "test.noMatch": "No match",
      "test.rejectMatch": "Match: this request would be rejected",
      "test.invalid": "Invalid regular expression: ",
      "test.maskResult": "Masked result",
      "validation.nameRequired": "Name is required",
      "validation.patternRequired": "Pattern is required",
      "validation.patternInvalid": "Invalid pattern: ",
      "validation.replacementRequired": "Replacement is required for mask",
      "validation.duplicateName": "Rule name already exists",
      "delete.title": "Delete prompt protection rule",
      "delete.bulkTitle": "Delete selected rules",
      "delete.description": "Delete “{name}”? This cannot be undone.",
      "delete.bulkDescription": "Delete {count} rules? This cannot be undone.",
      "delete.confirm": "Delete",
      "status.enable": "Enable rule",
      "status.disable": "Disable rule",
      "toast.deleted": "Rule deleted",
      "toast.bulkDeleted": "Selected rules deleted",
    },
  };

  const state = {
    lang: "zh",
    options: {},
    rules: [],
    rejectMessage: DEFAULT_REJECT_MESSAGE,
    search: "",
    statusFilter: "all",
    sortField: "updatedAt",
    sortDesc: true,
    page: 1,
    pageSize: 10,
    selected: {},
    visibleIds: [],
    editingId: null,
    pendingDelete: null,
    saveTimer: null,
    lastSaveAt: 0,
    saveInFlight: false,
    saveQueued: false,
    optionsReady: false,
  };

  let bridge = null;
  let previewTimer = null;

  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function t(key, vars) {
    const table = TEXT[state.lang] || TEXT.zh;
    let value = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : TEXT.zh[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        value = value.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name]));
      });
    }
    return value;
  }

  function normalizeLang(value) {
    return String(value || "").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  function applyI18n() {
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
    });
    document.title = t("app.title") + " · Magpie";
    updateModalTexts();
    paintSaveState();
  }

  function applyTheme(theme) {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme.dark ? "dark" : "light");
  }

  function updateModalTexts() {
    const isEdit = Boolean(state.editingId);
    const title = $("rule-modal-title");
    const submit = $("rule-submit");
    const note = $("form-note");
    if (title) title.textContent = t(isEdit ? "dialog.editTitle" : "dialog.createTitle");
    if (submit) submit.textContent = t(isEdit ? "dialog.saveAction" : "dialog.createAction");
    if (note) note.hidden = isEdit;
  }

  function updateSortMarks() {
    document.querySelectorAll(".th-sort").forEach(function (button) {
      const th = button.closest("th");
      if (button.getAttribute("data-sort") === state.sortField) {
        th.setAttribute("data-sorted", state.sortDesc ? "desc" : "asc");
      } else {
        th.removeAttribute("data-sorted");
      }
    });
  }

  function genId() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }
    } catch (error) {
      // Sandboxed frames can expose randomUUID but reject it as insecure.
    }
    let random = "";
    try {
      if (window.crypto && typeof window.crypto.getRandomValues === "function") {
        const bytes = new Uint8Array(8);
        window.crypto.getRandomValues(bytes);
        random = Array.prototype.map
          .call(bytes, function (byte) {
            return byte.toString(16).padStart(2, "0");
          })
          .join("");
      }
    } catch (error) {
      random = "";
    }
    if (!random) random = Math.random().toString(36).slice(2, 12);
    return "rule-" + Date.now().toString(36) + "-" + random;
  }

  function normalizeRule(raw) {
    if (!raw || typeof raw !== "object") return null;
    const settings = raw.settings && typeof raw.settings === "object" ? raw.settings : {};
    const scopes = Array.isArray(settings.scopes)
      ? settings.scopes.filter(function (scope) {
          return VALID_SCOPES.indexOf(scope) >= 0;
        })
      : [];
    return {
      id: typeof raw.id === "string" && raw.id ? raw.id : genId(),
      name: typeof raw.name === "string" ? raw.name : "",
      description: typeof raw.description === "string" ? raw.description : "",
      pattern: typeof raw.pattern === "string" ? raw.pattern : "",
      status: raw.status === "enabled" ? "enabled" : "disabled",
      settings: {
        action: settings.action === "reject" ? "reject" : "mask",
        replacement: typeof settings.replacement === "string" ? settings.replacement : "",
        scopes: scopes,
        flags: typeof settings.flags === "string" ? settings.flags : "",
      },
      createdAt: typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : new Date().toISOString(),
      updatedAt: typeof raw.updatedAt === "string" && raw.updatedAt ? raw.updatedAt : new Date().toISOString(),
    };
  }

  function normalizeRules(rawRules) {
    if (!Array.isArray(rawRules)) return [];
    return rawRules.map(normalizeRule).filter(Boolean);
  }

  function sanitizeFlags(value) {
    let flags = "";
    const text = String(value || "");
    ["g", "i", "m", "s", "u", "y"].forEach(function (flag) {
      if (text.indexOf(flag) >= 0 && flags.indexOf(flag) < 0) flags += flag;
    });
    return flags;
  }

  function compilePattern(pattern, flags) {
    let source = String(pattern || "");
    let finalFlags = sanitizeFlags(flags);
    for (;;) {
      const match = source.match(/^\(\?([ims]+)\)/);
      if (!match) break;
      finalFlags = sanitizeFlags(finalFlags + match[1]);
      source = source.slice(match[0].length);
    }
    if (finalFlags.indexOf("g") < 0) finalFlags += "g";
    return new RegExp(source, finalFlags);
  }

  function findRule(id) {
    return state.rules.find(function (rule) {
      return rule.id === id;
    });
  }

  function filteredRules() {
    const search = state.search.trim().toLowerCase();
    return state.rules.filter(function (rule) {
      if (state.statusFilter === "enabled" && rule.status !== "enabled") return false;
      if (state.statusFilter === "disabled" && rule.status === "enabled") return false;
      if (search && rule.name.toLowerCase().indexOf(search) < 0) return false;
      return true;
    });
  }

  function sortedRules(rules) {
    return rules.slice().sort(function (a, b) {
      let result;
      if (state.sortField === "name") {
        result = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      } else {
        result = String(a.updatedAt).localeCompare(String(b.updatedAt));
      }
      return state.sortDesc ? -result : result;
    });
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    const pad = function (number) {
      return String(number).padStart(2, "0");
    };
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  function renderAll() {
    pruneSelection();
    renderStats();
    renderTable();
    renderBulk();
    updateSortMarks();
  }

  function renderStats() {
    const total = state.rules.length;
    const enabled = state.rules.filter(function (rule) {
      return rule.status === "enabled";
    }).length;
    const reject = state.rules.filter(function (rule) {
      return rule.settings.action === "reject";
    }).length;
    $("stat-total").textContent = String(total);
    $("stat-enabled").textContent = String(enabled);
    $("stat-reject").textContent = String(reject);
    $("stat-disabled").textContent = String(total - enabled);
  }

  function renderTable() {
    const rules = sortedRules(filteredRules());
    const pages = Math.max(1, Math.ceil(rules.length / state.pageSize));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;

    const start = (state.page - 1) * state.pageSize;
    const pageRules = rules.slice(start, start + state.pageSize);
    state.visibleIds = pageRules.map(function (rule) {
      return rule.id;
    });

    const table = document.querySelector(".rules-table");
    const tbody = $("rules-body");
    tbody.replaceChildren();
    table.hidden = pageRules.length === 0;
    $("empty-state").hidden = pageRules.length !== 0;

    pageRules.forEach(function (rule) {
      tbody.appendChild(renderRow(rule));
    });

    updateSelectAllState();
    renderPagination(rules.length, pages);
  }

  function renderRow(rule) {
    const row = el("tr");

    const selectCell = el("td", "col-select");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(state.selected[rule.id]);
    checkbox.setAttribute("aria-label", rule.name || t("field.name"));
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) state.selected[rule.id] = true;
      else delete state.selected[rule.id];
      renderBulk();
      updateSelectAllState();
    });
    selectCell.appendChild(checkbox);
    row.appendChild(selectCell);

    const nameCell = el("td");
    const nameBox = el("div", "rule-name");
    nameBox.appendChild(el("strong", null, rule.name || "(unnamed)"));
    nameBox.appendChild(el("small", null, rule.description || "—"));
    nameCell.appendChild(nameBox);
    row.appendChild(nameCell);

    const patternCell = el("td");
    const code = el("code", "pattern-code", rule.pattern + (rule.settings.flags ? "  [" + rule.settings.flags + "]" : ""));
    code.title = rule.pattern;
    patternCell.appendChild(code);
    row.appendChild(patternCell);

    const actionCell = el("td");
    actionCell.appendChild(
      el("span", "badge " + (rule.settings.action === "reject" ? "badge-reject" : "badge-mask"), t("action." + rule.settings.action))
    );
    row.appendChild(actionCell);

    const scopesCell = el("td");
    const scopeList = el("div", "scope-list");
    if (!rule.settings.scopes || rule.settings.scopes.length === 0) {
      scopeList.appendChild(el("span", "scope-pill", t("scope.all")));
    } else {
      rule.settings.scopes.forEach(function (scope) {
        scopeList.appendChild(el("span", "scope-pill", t("scope." + scope)));
      });
    }
    scopesCell.appendChild(scopeList);
    row.appendChild(scopesCell);

    const statusCell = el("td");
    const statusBox = el("div", "status-cell");
    const switchButton = el("button", "switch");
    switchButton.type = "button";
    switchButton.setAttribute("role", "switch");
    switchButton.setAttribute("aria-checked", rule.status === "enabled" ? "true" : "false");
    switchButton.title = t(rule.status === "enabled" ? "status.disable" : "status.enable");
    switchButton.addEventListener("click", function () {
      toggleRule(rule.id);
    });
    statusBox.appendChild(switchButton);
    statusBox.appendChild(
      el("span", "status-text " + (rule.status === "enabled" ? "enabled" : ""), t(rule.status === "enabled" ? "filter.enabled" : "filter.disabled"))
    );
    statusCell.appendChild(statusBox);
    row.appendChild(statusCell);

    const updatedCell = el("td", "col-updated");
    const updated = el("span", null, formatDate(rule.updatedAt));
    updated.title = formatDate(rule.updatedAt);
    updatedCell.appendChild(updated);
    row.appendChild(updatedCell);

    const actionsCell = el("td", "col-actions");
    const actions = el("div", "row-actions");
    const editButton = el("button", "row-action", t("row.edit"));
    editButton.type = "button";
    editButton.addEventListener("click", function () {
      openRuleModal(rule.id);
    });
    const deleteButton = el("button", "row-action danger", t("row.delete"));
    deleteButton.type = "button";
    deleteButton.addEventListener("click", function () {
      askDelete([rule.id]);
    });
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    actionsCell.appendChild(actions);
    row.appendChild(actionsCell);

    return row;
  }

  function renderPagination(total, pages) {
    $("page-total").textContent = t("page.total", { count: total });
    $("page-info").textContent = t("page.info", { page: state.page, pages: pages });
    $("page-prev").disabled = state.page <= 1;
    $("page-next").disabled = state.page >= pages;
  }

  function renderBulk() {
    const ids = selectedIds();
    $("bulk-actions").hidden = ids.length === 0;
    $("bulk-count").textContent = t("selection.count", { count: ids.length });
  }

  function selectedIds() {
    return Object.keys(state.selected).filter(function (id) {
      return Boolean(findRule(id));
    });
  }

  function pruneSelection() {
    const known = {};
    state.rules.forEach(function (rule) {
      known[rule.id] = true;
    });
    Object.keys(state.selected).forEach(function (id) {
      if (!known[id]) delete state.selected[id];
    });
  }

  function updateSelectAllState() {
    const checkbox = $("select-all");
    if (!checkbox) return;
    const visible = state.visibleIds || [];
    const selectedVisible = visible.filter(function (id) {
      return Boolean(state.selected[id]);
    });
    checkbox.checked = visible.length > 0 && selectedVisible.length === visible.length;
    checkbox.indeterminate = selectedVisible.length > 0 && selectedVisible.length < visible.length;
  }

  function toggleRule(id) {
    const rule = findRule(id);
    if (!rule) return;
    rule.status = rule.status === "enabled" ? "disabled" : "enabled";
    rule.updatedAt = new Date().toISOString();
    scheduleSave();
    renderAll();
  }

  function setRulesStatus(ids, status) {
    const now = new Date().toISOString();
    ids.forEach(function (id) {
      const rule = findRule(id);
      if (!rule) return;
      rule.status = status;
      rule.updatedAt = now;
    });
    scheduleSave();
    renderAll();
  }

  function deleteRules(ids) {
    const remove = {};
    ids.forEach(function (id) {
      remove[id] = true;
      delete state.selected[id];
    });
    state.rules = state.rules.filter(function (rule) {
      return !remove[rule.id];
    });
    scheduleSave();
    renderAll();
  }

  function openRuleModal(id) {
    state.editingId = id || null;
    const rule = id ? findRule(id) : null;
    const values = rule
      ? {
          name: rule.name,
          description: rule.description,
          pattern: rule.pattern,
          action: rule.settings.action,
          replacement: rule.settings.replacement,
          flags: rule.settings.flags,
          scopes: rule.settings.scopes.slice(),
        }
      : {
          name: DEFAULT_RULE.name,
          description: DEFAULT_RULE.description,
          pattern: DEFAULT_RULE.pattern,
          action: DEFAULT_RULE.action,
          replacement: DEFAULT_RULE.replacement,
          flags: DEFAULT_RULE.flags,
          scopes: DEFAULT_RULE.scopes.slice(),
        };

    $("field-id").value = id || "";
    $("field-name").value = values.name;
    $("field-description").value = values.description;
    $("field-pattern").value = values.pattern;
    $("field-action").value = values.action;
    $("field-replacement").value = values.replacement;
    $("field-flags").value = values.flags;
    $("field-test").value = "";
    document.querySelectorAll(".scope-option input").forEach(function (input) {
      input.checked = values.scopes.indexOf(input.value) >= 0;
    });

    clearFormErrors();
    $("form-error").hidden = true;
    syncActionFields();
    updatePreview();
    updateModalTexts();
    $("rule-modal").hidden = false;
    window.setTimeout(function () {
      $("field-name").focus();
    }, 30);
  }

  function closeRuleModal() {
    $("rule-modal").hidden = true;
    state.editingId = null;
    previewTimer = null;
  }

  function clearFormErrors() {
    ["error-name", "error-pattern", "error-replacement"].forEach(function (id) {
      const node = $(id);
      node.textContent = "";
      node.hidden = true;
    });
  }

  function setFieldError(id, message) {
    const node = $(id);
    node.textContent = message;
    node.hidden = !message;
  }

  function syncActionFields() {
    const action = $("field-action").value;
    $("field-replacement").disabled = action !== "mask";
  }

  function collectForm() {
    const scopes = [];
    document.querySelectorAll(".scope-option input:checked").forEach(function (input) {
      scopes.push(input.value);
    });
    return {
      name: $("field-name").value.trim(),
      description: $("field-description").value.trim(),
      pattern: $("field-pattern").value,
      action: $("field-action").value === "reject" ? "reject" : "mask",
      replacement: $("field-replacement").value,
      flags: sanitizeFlags($("field-flags").value),
      scopes: scopes,
    };
  }

  function validateForm() {
    clearFormErrors();
    $("form-error").hidden = true;
    const data = collectForm();
    let valid = true;

    if (!data.name) {
      setFieldError("error-name", t("validation.nameRequired"));
      valid = false;
    } else {
      const duplicate = state.rules.some(function (rule) {
        return rule.id !== state.editingId && rule.name.toLowerCase() === data.name.toLowerCase();
      });
      if (duplicate) {
        setFieldError("error-name", t("validation.duplicateName"));
        valid = false;
      }
    }

    if (!data.pattern) {
      setFieldError("error-pattern", t("validation.patternRequired"));
      valid = false;
    } else {
      try {
        compilePattern(data.pattern, data.flags);
      } catch (error) {
        setFieldError("error-pattern", t("validation.patternInvalid") + error.message);
        valid = false;
      }
    }

    if (data.action === "mask" && !data.replacement) {
      setFieldError("error-replacement", t("validation.replacementRequired"));
      valid = false;
    }

    return valid ? data : null;
  }

  function saveRule(event) {
    if (event) event.preventDefault();
    const data = validateForm();
    if (!data) return;

    try {
      const now = new Date().toISOString();
      if (state.editingId) {
        const rule = findRule(state.editingId);
        if (!rule) return;
        rule.name = data.name;
        rule.description = data.description;
        rule.pattern = data.pattern;
        rule.settings.action = data.action;
        rule.settings.replacement = data.replacement;
        rule.settings.flags = data.flags;
        rule.settings.scopes = data.scopes;
        rule.updatedAt = now;
      } else {
        state.rules.push({
          id: genId(),
          name: data.name,
          description: data.description,
          pattern: data.pattern,
          status: "disabled",
          settings: {
            action: data.action,
            replacement: data.replacement,
            scopes: data.scopes,
            flags: data.flags,
          },
          createdAt: now,
          updatedAt: now,
        });
      }

      closeRuleModal();
      scheduleSave();
      renderAll();
    } catch (error) {
      console.error("prompt-protection: failed to save rule", error);
      $("form-error").textContent = String((error && error.message) || error);
      $("form-error").hidden = false;
    }
  }

  function schedulePreview() {
    if (previewTimer) window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(updatePreview, 250);
  }

  function updatePreview() {
    const box = $("preview-result");
    const test = $("field-test").value;
    const pattern = $("field-pattern").value;

    if (!test || !pattern) {
      box.dataset.state = "idle";
      box.textContent = t("test.idle");
      return;
    }

    let regex;
    try {
      regex = compilePattern(pattern, $("field-flags").value);
    } catch (error) {
      box.dataset.state = "invalid";
      box.textContent = t("test.invalid") + error.message;
      return;
    }

    regex.lastIndex = 0;
    if (!regex.test(test)) {
      box.dataset.state = "idle";
      box.textContent = t("test.noMatch");
      return;
    }

    if ($("field-action").value === "reject") {
      box.dataset.state = "reject";
      box.textContent = t("test.rejectMatch");
      return;
    }

    regex.lastIndex = 0;
    const replacement = $("field-replacement").value || "";
    const result = test.replace(regex, function () {
      return replacement;
    });

    box.dataset.state = "match";
    box.replaceChildren();
    box.appendChild(el("div", "preview-label", t("test.maskResult")));
    box.appendChild(el("pre", null, result));
  }

  function askDelete(ids) {
    if (!ids || ids.length === 0) return;
    state.pendingDelete = ids.slice();
    if (ids.length === 1) {
      const rule = findRule(ids[0]);
      $("confirm-title").textContent = t("delete.title");
      $("confirm-description").textContent = t("delete.description", {
        name: rule ? rule.name : ids[0],
      });
    } else {
      $("confirm-title").textContent = t("delete.bulkTitle");
      $("confirm-description").textContent = t("delete.bulkDescription", { count: ids.length });
    }
    $("confirm-modal").hidden = false;
  }

  function closeConfirm() {
    $("confirm-modal").hidden = true;
    state.pendingDelete = null;
  }

  function confirmDelete() {
    const ids = state.pendingDelete;
    if (!ids) return;
    deleteRules(ids);
    closeConfirm();
  }

  function optionsSnapshot() {
    const payload = {};
    Object.keys(state.options || {}).forEach(function (key) {
      payload[key] = state.options[key];
    });
    payload.rules = state.rules;
    payload.rejectMessage = state.rejectMessage;
    return payload;
  }

  function paintSaveState() {
    const badge = $("save-state");
    if (!badge) return;
    const current = badge.dataset.state || "loading";
    const keys = {
      loading: "app.loading",
      saved: "app.saved",
      saving: "app.saving",
      unsaved: "app.unsaved",
      error: "app.saveError",
    };
    badge.textContent = t(keys[current] || "app.saved");
  }

  function setSaveState(value) {
    const badge = $("save-state");
    if (!badge) return;
    badge.dataset.state = value;
    paintSaveState();
  }

  function scheduleSave() {
    setSaveState("unsaved");
    if (state.saveTimer) window.clearTimeout(state.saveTimer);
    const elapsed = Date.now() - state.lastSaveAt;
    const wait = Math.max(180, 1150 - elapsed);
    state.saveTimer = window.setTimeout(function () {
      state.saveTimer = null;
      persistOptions();
    }, wait);
  }

  async function persistOptions() {
    if (state.saveInFlight) {
      state.saveQueued = true;
      return;
    }
    state.saveInFlight = true;
    setSaveState("saving");
    try {
      if (!state.optionsReady) {
        throw new Error("options are not loaded");
      }
      if (!bridge.options || typeof bridge.options.set !== "function") {
        throw new Error("options.set is unavailable");
      }
      const saved = await withTimeout(bridge.options.set(optionsSnapshot()), 6000, null);
      if (saved === null) throw new Error("options.set timed out");
      if (typeof saved === "object") state.options = saved;
      state.lastSaveAt = Date.now();
      setSaveState("saved");
    } catch (error) {
      console.error("prompt-protection: failed to save options", error);
      setSaveState("error");
    }
    state.saveInFlight = false;
    if (state.saveQueued) {
      state.saveQueued = false;
      scheduleSave();
    }
  }

  function fallbackBridge() {
    const storageKey = "magpie-prompt-protection-options";
    return {
      ready: Promise.resolve({
        lang: navigator.language || "zh",
        dark: Boolean(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches),
      }),
      options: {
        get: async function () {
          try {
            return JSON.parse(window.localStorage.getItem(storageKey) || "{}");
          } catch (error) {
            return {};
          }
        },
        set: async function (value) {
          window.localStorage.setItem(storageKey, JSON.stringify(value));
          return value;
        },
      },
      onTheme: function () {},
    };
  }

  function bindEvents() {
    $("create-rule").addEventListener("click", function () {
      openRuleModal(null);
    });
    $("empty-create").addEventListener("click", function () {
      openRuleModal(null);
    });

    $("search").addEventListener("input", function (event) {
      state.search = event.target.value;
      state.page = 1;
      renderTable();
      renderBulk();
    });

    $("status-filter").addEventListener("change", function (event) {
      state.statusFilter = event.target.value;
      state.page = 1;
      renderTable();
      renderBulk();
    });

    document.querySelectorAll(".th-sort").forEach(function (button) {
      button.addEventListener("click", function () {
        const field = button.getAttribute("data-sort");
        if (state.sortField === field) state.sortDesc = !state.sortDesc;
        else {
          state.sortField = field;
          state.sortDesc = field !== "name";
        }
        document.querySelectorAll(".th-sort").forEach(function (other) {
          const th = other.closest("th");
          if (other === button) th.setAttribute("data-sorted", state.sortDesc ? "desc" : "asc");
          else th.removeAttribute("data-sorted");
        });
        renderTable();
      });
    });

    $("select-all").addEventListener("change", function (event) {
      const checked = event.target.checked;
      (state.visibleIds || []).forEach(function (id) {
        if (checked) state.selected[id] = true;
        else delete state.selected[id];
      });
      renderTable();
      renderBulk();
    });

    $("page-size").addEventListener("change", function (event) {
      state.pageSize = Number(event.target.value) || 10;
      state.page = 1;
      renderTable();
      renderBulk();
    });

    $("page-prev").addEventListener("click", function () {
      if (state.page > 1) {
        state.page -= 1;
        renderTable();
        renderBulk();
      }
    });

    $("page-next").addEventListener("click", function () {
      const total = filteredRules().length;
      const pages = Math.max(1, Math.ceil(total / state.pageSize));
      if (state.page < pages) {
        state.page += 1;
        renderTable();
        renderBulk();
      }
    });

    $("bulk-enable").addEventListener("click", function () {
      setRulesStatus(selectedIds(), "enabled");
    });
    $("bulk-disable").addEventListener("click", function () {
      setRulesStatus(selectedIds(), "disabled");
    });
    $("bulk-delete").addEventListener("click", function () {
      askDelete(selectedIds());
    });

    $("reject-message").addEventListener("input", function (event) {
      state.rejectMessage = event.target.value;
      scheduleSave();
    });

    $("rule-close").addEventListener("click", closeRuleModal);
    $("rule-cancel").addEventListener("click", closeRuleModal);
    $("rule-submit").addEventListener("click", function () {
      saveRule();
    });
    $("rule-form").addEventListener("submit", saveRule);
    $("rule-form").addEventListener("keydown", function (event) {
      if (event.key !== "Enter" || event.target.tagName === "TEXTAREA") return;
      event.preventDefault();
      saveRule();
    });
    $("field-action").addEventListener("change", function () {
      setFieldError("error-replacement", "");
      syncActionFields();
      schedulePreview();
    });
    function clearFieldErrorOnEdit(event) {
      const target = event.target;
      if (!target || !target.id) return;
      const errors = {
        "field-name": "error-name",
        "field-pattern": "error-pattern",
        "field-replacement": "error-replacement",
      };
      if (errors[target.id]) setFieldError(errors[target.id], "");
      $("form-error").hidden = true;
    }
    $("rule-form").addEventListener("input", clearFieldErrorOnEdit);
    $("rule-form").addEventListener("change", clearFieldErrorOnEdit);
    ["field-pattern", "field-replacement", "field-flags", "field-test"].forEach(function (id) {
      $(id).addEventListener("input", schedulePreview);
    });

    $("confirm-cancel").addEventListener("click", closeConfirm);
    $("confirm-delete").addEventListener("click", confirmDelete);

    [$("rule-modal"), $("confirm-modal")].forEach(function (backdrop) {
      backdrop.addEventListener("click", function (event) {
        if (event.target !== backdrop) return;
        if (backdrop === $("rule-modal")) closeRuleModal();
        else closeConfirm();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!$("confirm-modal").hidden) closeConfirm();
      else if (!$("rule-modal").hidden) closeRuleModal();
    });
  }

  function withTimeout(promise, ms, fallbackValue) {
    return Promise.race([
      Promise.resolve(promise).catch(function () {
        return fallbackValue;
      }),
      new Promise(function (resolve) {
        window.setTimeout(function () {
          resolve(fallbackValue);
        }, ms);
      }),
    ]);
  }

  async function boot() {
    const embedded = window.parent !== window;
    bridge = window.magpie && embedded ? window.magpie : fallbackBridge();

    bindEvents();
    applyI18n();
    renderAll();

    const theme = await withTimeout(bridge.ready, 4000, null);
    if (theme && typeof theme === "object") {
      state.lang = normalizeLang(theme.lang);
      applyTheme(theme);
    } else {
      state.lang = normalizeLang(navigator.language);
    }
    applyI18n();

    if (typeof bridge.onTheme === "function") {
      bridge.onTheme(function (nextTheme) {
        state.lang = normalizeLang(nextTheme && nextTheme.lang);
        applyTheme(nextTheme);
        applyI18n();
        renderAll();
        if (!$("rule-modal").hidden) updatePreview();
      });
    }

    let options = null;
    if (bridge.options && typeof bridge.options.get === "function") {
      options = await withTimeout(bridge.options.get(), 4000, null);
    }
    if (options && typeof options === "object") {
      state.options = options;
      state.optionsReady = true;
      state.rules = normalizeRules(state.options.rules);
      state.rejectMessage =
        typeof state.options.rejectMessage === "string" && state.options.rejectMessage.trim()
          ? state.options.rejectMessage
          : DEFAULT_REJECT_MESSAGE;
      $("reject-message").value = state.rejectMessage;
      renderAll();
    }
    setSaveState(state.optionsReady ? "saved" : "error");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
