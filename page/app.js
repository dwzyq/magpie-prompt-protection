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
    scopes: ["user"],
  };
  const PRESET_RULES = [
    {
      id: "preset-jailbreak",
      name: "破限",
      description: "去除cc内置安全约束提示词",
      pattern: "IMPORTANT: Assist with authorized security testing.*?or defensive use cases.",
      status: "disabled",
      createdAt: "2026-11-06T00:00:00.000Z",
      updatedAt: "2026-11-06T00:00:00.000Z",
      settings: {
        action: "mask",
        replacement: ".",
        scopes: ["system"],
      },
    },
  ];

  const TEXT = {
    zh: {
      "app.title": "提示保护规则",
      "app.subtitle": "管理基于正则的提示保护规则，可对命中内容做脱敏或直接拒绝。",
      "app.create": "创建规则",
      "app.loading": "正在加载…",
      "app.saved": "已保存",
      "app.saving": "保存中…",
      "app.unsaved": "未保存",
      "app.saveError": "保存失败",
      "search.placeholder": "按名称筛选...",
      "bulk.clear": "取消选择",
      "bulk.enable": "启用",
      "bulk.disable": "禁用",
      "bulk.delete": "删除",
      "selection.count": "已选择 {count} 项",
      "table.name": "名称",
      "table.description": "描述",
      "table.pattern": "匹配规则",
      "table.action": "处理方式",
      "table.scopes": "作用范围",
      "table.status": "状态",
      "table.created": "创建时间",
      "table.actions": "操作",
      "table.empty": "暂无数据",
      "table.selectAll": "全选",
      "table.selectRow": "选择行",
      "row.edit": "编辑",
      "row.delete": "删除",
      "menu.open": "打开菜单",
      "action.mask": "脱敏",
      "action.reject": "拒绝",
      "scope.system": "系统",
      "scope.developer": "开发者",
      "scope.user": "用户",
      "scope.assistant": "助手",
      "scope.tool": "工具",
      "page.size": "每页行数",
      "page.prev": "上一页",
      "page.next": "下一页",
      "pagination.selected": "已选择 {selected} / {count} 行 / 总计 {total} 行",
      "dialog.createTitle": "创建提示保护规则",
      "dialog.editTitle": "编辑提示保护规则",
      "dialog.createDescription": "配置正则匹配规则，并选择命中后脱敏还是直接拒绝。",
      "dialog.editDescription": "更新匹配规则、处理方式和作用范围。",
      "dialog.cancel": "取消",
      "dialog.close": "关闭",
      "dialog.createAction": "创建",
      "dialog.saveAction": "保存",
      "dialog.confirm": "确认",
      "field.name": "名称",
      "field.description": "描述",
      "field.pattern": "正则表达式",
      "field.action": "处理方式",
      "field.replacement": "替换文本",
      "field.scopes": "作用范围",
      "test.title": "测试预览",
      "test.input": "测试文本",
      "test.result": "预览结果",
      "test.placeholder": "输入测试文本以预览正则替换效果",
      "test.idle": "输入测试文本后显示预览结果",
      "test.noMatch": "无匹配",
      "test.rejected": "命中拒绝规则，请求将被拦截",
      "test.invalid": "无效的正则表达式：",
      "validation.nameRequired": "请输入名称",
      "validation.patternRequired": "请输入正则表达式",
      "validation.patternInvalid": "无效的正则表达式：",
      "validation.replacementRequired": "请输入替换文本",
      "validation.duplicateName": "规则名称已存在",
      "statusChange.title": "更新规则状态",
      "statusChange.enableDescription": "确定启用规则“{name}”吗？",
      "statusChange.disableDescription": "确定禁用规则“{name}”吗？",
      "delete.title": "删除提示保护规则",
      "delete.description": "确定删除规则“{name}”吗？此操作不可撤销。",
      "bulkEnable.title": "启用所选规则",
      "bulkEnable.description": "确定启用 {count} 条已选规则吗？",
      "bulkDisable.title": "禁用所选规则",
      "bulkDisable.description": "确定禁用 {count} 条已选规则吗？",
      "bulkDelete.title": "删除所选规则",
      "bulkDelete.description": "确定删除 {count} 条已选规则吗？此操作不可撤销。",
      "messages.createSuccess": "提示保护规则已创建",
      "messages.updateSuccess": "提示保护规则已更新",
      "messages.deleteSuccess": "提示保护规则已删除",
      "messages.statusUpdateSuccess": "规则状态已更新",
      "messages.bulkEnableSuccess": "已启用所选规则",
      "messages.bulkDisableSuccess": "已禁用所选规则",
      "messages.bulkDeleteSuccess": "已删除所选规则",
    },
    en: {
      "app.title": "Prompt Protection Rules",
      "app.subtitle": "Manage regex-based prompt protection rules for masking or rejecting matched content.",
      "app.create": "Create Rule",
      "app.loading": "Loading…",
      "app.saved": "Saved",
      "app.saving": "Saving…",
      "app.unsaved": "Unsaved",
      "app.saveError": "Save failed",
      "search.placeholder": "Filter by name...",
      "bulk.clear": "Clear selection",
      "bulk.enable": "Enable",
      "bulk.disable": "Disable",
      "bulk.delete": "Delete",
      "selection.count": "{count} selected",
      "table.name": "Name",
      "table.description": "Description",
      "table.pattern": "Pattern",
      "table.action": "Action",
      "table.scopes": "Scopes",
      "table.status": "Status",
      "table.created": "Created At",
      "table.actions": "Actions",
      "table.empty": "No data",
      "table.selectAll": "Select all",
      "table.selectRow": "Select row",
      "row.edit": "Edit",
      "row.delete": "Delete",
      "menu.open": "Open menu",
      "action.mask": "Mask",
      "action.reject": "Reject",
      "scope.system": "System",
      "scope.developer": "Developer",
      "scope.user": "User",
      "scope.assistant": "Assistant",
      "scope.tool": "Tool",
      "page.size": "Rows per page",
      "page.prev": "Previous page",
      "page.next": "Next page",
      "pagination.selected": "{selected} of {count} row(s) selected / {total} total",
      "dialog.createTitle": "Create prompt protection rule",
      "dialog.editTitle": "Edit prompt protection rule",
      "dialog.createDescription": "Define a regex rule and choose whether matches are masked or rejected.",
      "dialog.editDescription": "Update the matching pattern, action, and scope settings.",
      "dialog.cancel": "Cancel",
      "dialog.close": "Close",
      "dialog.createAction": "Create",
      "dialog.saveAction": "Save",
      "dialog.confirm": "Confirm",
      "field.name": "Name",
      "field.description": "Description",
      "field.pattern": "Pattern",
      "field.action": "Action",
      "field.replacement": "Replacement",
      "field.scopes": "Scopes",
      "test.title": "Test Preview",
      "test.input": "Test Input",
      "test.result": "Preview Result",
      "test.placeholder": "Enter test text to preview regex replacement",
      "test.idle": "Enter test text to see the preview result",
      "test.noMatch": "No match",
      "test.rejected": "Reject rule matched. The request will be blocked.",
      "test.invalid": "Invalid regex pattern: ",
      "validation.nameRequired": "Name is required",
      "validation.patternRequired": "Pattern is required",
      "validation.patternInvalid": "Invalid regex pattern: ",
      "validation.replacementRequired": "Replacement is required",
      "validation.duplicateName": "Rule name already exists",
      "statusChange.title": "Update rule status",
      "statusChange.enableDescription": "Enable rule “{name}”?",
      "statusChange.disableDescription": "Disable rule “{name}”?",
      "delete.title": "Delete prompt protection rule",
      "delete.description": "Delete rule “{name}”? This cannot be undone.",
      "bulkEnable.title": "Enable selected rules",
      "bulkEnable.description": "Enable {count} selected rules?",
      "bulkDisable.title": "Disable selected rules",
      "bulkDisable.description": "Disable {count} selected rules?",
      "bulkDelete.title": "Delete selected rules",
      "bulkDelete.description": "Delete {count} selected rules? This cannot be undone.",
      "messages.createSuccess": "Prompt protection rule created",
      "messages.updateSuccess": "Prompt protection rule updated",
      "messages.deleteSuccess": "Prompt protection rule deleted",
      "messages.statusUpdateSuccess": "Rule status updated",
      "messages.bulkEnableSuccess": "Selected rules enabled",
      "messages.bulkDisableSuccess": "Selected rules disabled",
      "messages.bulkDeleteSuccess": "Selected rules deleted",
    },
  };

  const state = {
    lang: "zh",
    options: {},
    rules: [],
    rejectMessage: DEFAULT_REJECT_MESSAGE,
    search: "",
    sortField: "createdAt",
    sortDesc: true,
    page: 1,
    pageSize: 20,
    pageRuleCount: 0,
    selected: {},
    visibleIds: [],
    editingId: null,
    pendingConfirm: null,
    pendingToast: null,
    saveTimer: null,
    lastSaveAt: 0,
    saveInFlight: false,
    saveQueued: false,
    optionsReady: false,
  };

  let bridge = null;
  let previewTimer = null;
  let toastTimer = null;

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
    document.querySelectorAll("[data-i18n-title]").forEach(function (node) {
      const text = t(node.getAttribute("data-i18n-title"));
      node.title = text;
      node.setAttribute("aria-label", text);
    });
    document.title = t("app.title") + " · Magpie";
    updateModalTexts();
  }

  function applyTheme(theme) {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme.dark ? "dark" : "light");
  }

  function updateModalTexts() {
    const isEdit = Boolean(state.editingId);
    const title = $("rule-modal-title");
    const subtitle = $("rule-modal-subtitle");
    const submit = $("rule-submit");
    if (title) title.textContent = t(isEdit ? "dialog.editTitle" : "dialog.createTitle");
    if (subtitle) subtitle.textContent = t(isEdit ? "dialog.editDescription" : "dialog.createDescription");
    if (submit) submit.textContent = t(isEdit ? "dialog.saveAction" : "dialog.createAction");
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

  function loadSortPreference() {
    try {
      const stored = JSON.parse(window.localStorage.getItem("magpie-prompt-protection-sorting") || "null");
      if (stored && (stored.field === "name" || stored.field === "createdAt")) {
        state.sortField = stored.field;
        state.sortDesc = Boolean(stored.desc);
      }
    } catch (error) {
      // Storage can be unavailable in the plugin sandbox.
    }
  }

  function saveSortPreference() {
    try {
      window.localStorage.setItem(
        "magpie-prompt-protection-sorting",
        JSON.stringify({ field: state.sortField, desc: state.sortDesc })
      );
    } catch (error) {
      // Storage can be unavailable in the plugin sandbox.
    }
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

  function compilePattern(pattern) {
    let source = String(pattern || "").replace(/\(\?'([A-Za-z_][A-Za-z0-9_]*)'/g, function (match, name) {
      return "(?<" + name + ">";
    });
    let finalFlags = "";
    for (;;) {
      const match = source.match(/^\(\?([ims]+)\)/);
      if (!match) break;
      finalFlags = sanitizeFlags(finalFlags + match[1]);
      source = source.slice(match[0].length);
    }
    if (/\\[pP]\{/.test(source) && finalFlags.indexOf("u") < 0) finalFlags += "u";
    if (finalFlags.indexOf("g") < 0) finalFlags += "g";
    return new RegExp(source, finalFlags);
  }

  // AxonHub's regexp2 replacement expands $1 and ${name}; JavaScript spells
  // the latter $<name>.
  function replacementTemplate(template) {
    return String(template || "")
      .replace(/\$0\b/g, function () {
        return "$&";
      })
      .replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, function (match, name) {
        return "$<" + name + ">";
      });
  }

  function findRule(id) {
    return state.rules.find(function (rule) {
      return rule.id === id;
    });
  }

  function filteredRules() {
    const search = state.search.trim().toLowerCase();
    return state.rules.filter(function (rule) {
      return !search || rule.name.toLowerCase().indexOf(search) >= 0;
    });
  }

  function sortedRules(rules) {
    return rules.slice().sort(function (a, b) {
      let result;
      if (state.sortField === "name") {
        result = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      } else {
        result = String(a.createdAt).localeCompare(String(b.createdAt));
      }
      return state.sortDesc ? -result : result;
    });
  }

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function formatDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return formatDate(value) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
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

  function renderAll() {
    pruneSelection();
    renderTable();
    renderBulk();
    updateSortMarks();
  }

  function renderTable() {
    const rules = sortedRules(filteredRules());
    const pages = Math.max(1, Math.ceil(rules.length / state.pageSize));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;

    const start = (state.page - 1) * state.pageSize;
    const pageRules = rules.slice(start, start + state.pageSize);
    state.pageRuleCount = pageRules.length;
    state.visibleIds = pageRules.map(function (rule) {
      return rule.id;
    });

    const tbody = $("rules-body");
    tbody.replaceChildren();
    if (pageRules.length === 0) {
      const row = el("tr", "empty-row");
      const cell = el("td", null, t("table.empty"));
      cell.colSpan = 9;
      row.appendChild(cell);
      tbody.appendChild(row);
    } else {
      pageRules.forEach(function (rule) {
        tbody.appendChild(renderRow(rule));
      });
    }

    updateSelectAllState();
    renderPagination(rules.length, pages);
  }

  function renderRow(rule) {
    const row = el("tr");

    const selectCell = el("td", "col-select");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(state.selected[rule.id]);
    checkbox.setAttribute("aria-label", t("table.selectRow"));
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) state.selected[rule.id] = true;
      else delete state.selected[rule.id];
      renderBulk();
      updateSelectAllState();
    });
    selectCell.appendChild(checkbox);
    row.appendChild(selectCell);

    const nameCell = el("td", "col-name");
    const name = el("div", "cell-ellipsis rule-name-text", rule.name || "(unnamed)");
    name.title = rule.name;
    nameCell.appendChild(name);
    row.appendChild(nameCell);

    const descriptionCell = el("td", "col-description");
    const description = el("div", "cell-ellipsis cell-muted", rule.description || "-");
    description.title = rule.description;
    descriptionCell.appendChild(description);
    row.appendChild(descriptionCell);

    const patternCell = el("td", "col-pattern");
    const pattern = el("code", "pattern-code", rule.pattern);
    pattern.title = rule.pattern;
    patternCell.appendChild(pattern);
    row.appendChild(patternCell);

    const actionCell = el("td", "col-action");
    actionCell.appendChild(
      el("span", "badge " + (rule.settings.action === "reject" ? "badge-reject" : "badge-mask"), t("action." + rule.settings.action))
    );
    row.appendChild(actionCell);

    const scopesCell = el("td", "col-scopes");
    scopesCell.appendChild(el("span", "badge badge-outline", String((rule.settings.scopes || []).length)));
    row.appendChild(scopesCell);

    const statusCell = el("td", "col-status");
    const statusBox = el("div", "status-cell");
    const switchButton = el("button", "switch");
    switchButton.type = "button";
    switchButton.setAttribute("role", "switch");
    switchButton.setAttribute("aria-checked", rule.status === "enabled" ? "true" : "false");
    switchButton.setAttribute("aria-label", t(rule.status === "enabled" ? "bulk.disable" : "bulk.enable"));
    switchButton.title = t(rule.status === "enabled" ? "bulk.disable" : "bulk.enable");
    switchButton.addEventListener("click", function () {
      askStatusChange(rule);
    });
    statusBox.appendChild(switchButton);
    statusCell.appendChild(statusBox);
    row.appendChild(statusCell);

    const createdCell = el("td", "col-created");
    const created = el("span", null, formatDate(rule.createdAt));
    created.title = formatDateTime(rule.createdAt);
    createdCell.appendChild(created);
    row.appendChild(createdCell);

    const actionsCell = el("td", "col-actions");
    const menuButton = el("button", "icon-btn row-menu-trigger", "⋮");
    menuButton.type = "button";
    menuButton.title = t("menu.open");
    menuButton.setAttribute("aria-label", t("menu.open"));
    menuButton.addEventListener("click", function (event) {
      event.stopPropagation();
      openRowMenu(rule.id, menuButton);
    });
    actionsCell.appendChild(menuButton);
    row.appendChild(actionsCell);

    return row;
  }

  function updateSelectionInfo(total) {
    const node = $("selection-info");
    if (!node) return;
    node.textContent = t("pagination.selected", {
      selected: selectedIds().length,
      count: state.pageRuleCount,
      total: total === undefined ? filteredRules().length : total,
    });
  }

  function renderPagination(total, pages) {
    updateSelectionInfo(total);
    $("page-prev").disabled = state.page <= 1;
    $("page-next").disabled = state.page >= pages;
  }

  function renderBulk() {
    const ids = selectedIds();
    $("bulk-actions").hidden = ids.length === 0;
    $("bulk-count").textContent = t("selection.count", { count: ids.length });
    updateSelectionInfo();
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

  function askStatusChange(rule) {
    const next = rule.status === "enabled" ? "disabled" : "enabled";
    openConfirm({
      title: t("statusChange.title"),
      description: t(next === "enabled" ? "statusChange.enableDescription" : "statusChange.disableDescription", {
        name: rule.name,
      }),
      confirmLabel: t("dialog.confirm"),
      danger: false,
      action: function () {
        rule.status = next;
        rule.updatedAt = new Date().toISOString();
        state.pendingToast = t("messages.statusUpdateSuccess");
        scheduleSave();
        renderAll();
      },
    });
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
          scopes: rule.settings.scopes.slice(),
        }
      : {
          name: DEFAULT_RULE.name,
          description: DEFAULT_RULE.description,
          pattern: DEFAULT_RULE.pattern,
          action: DEFAULT_RULE.action,
          replacement: DEFAULT_RULE.replacement,
          scopes: DEFAULT_RULE.scopes.slice(),
        };

    $("field-id").value = id || "";
    $("field-name").value = values.name;
    $("field-description").value = values.description;
    $("field-pattern").value = values.pattern;
    $("field-action").value = values.action;
    $("field-replacement").value = values.replacement;
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
        compilePattern(data.pattern);
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
        rule.settings.scopes = data.scopes;
        rule.updatedAt = now;
        state.pendingToast = t("messages.updateSuccess");
      } else {
        state.rules.push({
          id: genId(),
          name: data.name,
          description: data.description,
          pattern: data.pattern,
          status: "enabled",
          settings: {
            action: data.action,
            replacement: data.replacement,
            scopes: data.scopes,
          },
          createdAt: now,
          updatedAt: now,
        });
        state.pendingToast = t("messages.createSuccess");
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

  function setPreviewState(box, state) {
    box.dataset.state = state;
  }

  function updatePreview() {
    const box = $("preview-result");
    const test = $("field-test").value;
    const pattern = $("field-pattern").value;

    if (!test) {
      setPreviewState(box, "idle");
      box.textContent = t("test.idle");
      return;
    }

    if (!pattern) {
      setPreviewState(box, "no-match");
      box.textContent = t("test.noMatch");
      return;
    }

    let regex;
    try {
      regex = compilePattern(pattern);
    } catch (error) {
      setPreviewState(box, "invalid");
      box.textContent = t("test.invalid") + error.message;
      return;
    }

    regex.lastIndex = 0;
    if (!regex.test(test)) {
      setPreviewState(box, "no-match");
      box.textContent = t("test.noMatch");
      return;
    }

    const action = $("field-action").value;
    if (action === "reject") {
      setPreviewState(box, "reject");
      box.textContent = t("test.rejected");
      return;
    }

    regex.lastIndex = 0;
    const replacement = $("field-replacement").value || "[MASKED]";
    const result = test.replace(regex, replacementTemplate(replacement));
    setPreviewState(box, "match");
    box.textContent = result;
  }

  function openConfirm(options) {
    state.pendingConfirm = options;
    $("confirm-title").textContent = options.title;
    $("confirm-description").textContent = options.description;
    const action = $("confirm-action");
    action.textContent = options.confirmLabel || t("dialog.confirm");
    action.className = "btn " + (options.danger ? "btn-danger" : "btn-primary");
    $("confirm-modal").hidden = false;
    window.setTimeout(function () {
      action.focus();
    }, 30);
  }

  function closeConfirm() {
    $("confirm-modal").hidden = true;
    state.pendingConfirm = null;
  }

  function runConfirm() {
    const pending = state.pendingConfirm;
    closeConfirm();
    if (pending && typeof pending.action === "function") pending.action();
  }

  function closeRowMenu() {
    const menu = $("row-menu");
    if (menu) menu.hidden = true;
  }

  function openRowMenu(ruleId, anchor) {
    const menu = $("row-menu");
    menu.replaceChildren();

    const edit = el("button", "menu-item", t("row.edit"));
    edit.type = "button";
    edit.addEventListener("click", function () {
      closeRowMenu();
      openRuleModal(ruleId);
    });

    const remove = el("button", "menu-item danger", t("row.delete"));
    remove.type = "button";
    remove.addEventListener("click", function () {
      closeRowMenu();
      const rule = findRule(ruleId);
      openConfirm({
        title: t("delete.title"),
        description: t("delete.description", { name: rule ? rule.name : ruleId }),
        confirmLabel: t("row.delete"),
        danger: true,
        action: function () {
          deleteRules([ruleId]);
          state.pendingToast = t("messages.deleteSuccess");
          renderAll();
        },
      });
    });

    menu.appendChild(edit);
    menu.appendChild(remove);
    menu.hidden = false;

    const rect = anchor.getBoundingClientRect();
    const width = 160;
    const height = menu.offsetHeight || 76;
    const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
    const top = rect.bottom + 4 + height > window.innerHeight ? rect.top - height - 4 : rect.bottom + 4;
    menu.style.width = width + "px";
    menu.style.left = left + "px";
    menu.style.top = top + "px";
  }

  function showToast(message, isError) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = "toast" + (isError ? " error" : "");
    toast.hidden = false;
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.hidden = true;
    }, 2500);
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

  function scheduleSave() {
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
      if (state.pendingToast) {
        showToast(state.pendingToast);
        state.pendingToast = null;
      }
    } catch (error) {
      console.error("prompt-protection: failed to save options", error);
      state.pendingToast = null;
      showToast(t("app.saveError"), true);
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

    $("search").addEventListener("input", function (event) {
      state.search = event.target.value;
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
        saveSortPreference();
        renderTable();
        updateSortMarks();
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
      state.pageSize = Number(event.target.value) || 20;
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

    $("bulk-clear").addEventListener("click", function () {
      state.selected = {};
      renderAll();
    });

    $("bulk-enable").addEventListener("click", function () {
      const ids = selectedIds();
      if (ids.length === 0) return;
      openConfirm({
        title: t("bulkEnable.title"),
        description: t("bulkEnable.description", { count: ids.length }),
        confirmLabel: t("bulk.enable"),
        danger: false,
        action: function () {
          setRulesStatus(ids, "enabled");
          state.pendingToast = t("messages.bulkEnableSuccess");
          state.selected = {};
          renderAll();
        },
      });
    });

    $("bulk-disable").addEventListener("click", function () {
      const ids = selectedIds();
      if (ids.length === 0) return;
      openConfirm({
        title: t("bulkDisable.title"),
        description: t("bulkDisable.description", { count: ids.length }),
        confirmLabel: t("bulk.disable"),
        danger: false,
        action: function () {
          setRulesStatus(ids, "disabled");
          state.pendingToast = t("messages.bulkDisableSuccess");
          state.selected = {};
          renderAll();
        },
      });
    });

    $("bulk-delete").addEventListener("click", function () {
      const ids = selectedIds();
      if (ids.length === 0) return;
      openConfirm({
        title: t("bulkDelete.title"),
        description: t("bulkDelete.description", { count: ids.length }),
        confirmLabel: t("bulk.delete"),
        danger: true,
        action: function () {
          deleteRules(ids);
          state.pendingToast = t("messages.bulkDeleteSuccess");
          state.selected = {};
          renderAll();
        },
      });
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
    ["field-pattern", "field-replacement", "field-test"].forEach(function (id) {
      $(id).addEventListener("input", schedulePreview);
    });
    document.querySelectorAll(".scope-option input").forEach(function (input) {
      input.addEventListener("change", schedulePreview);
    });

    $("confirm-cancel").addEventListener("click", closeConfirm);
    $("confirm-action").addEventListener("click", runConfirm);

    [$("rule-modal"), $("confirm-modal")].forEach(function (backdrop) {
      backdrop.addEventListener("click", function (event) {
        if (event.target !== backdrop) return;
        if (backdrop === $("rule-modal")) closeRuleModal();
        else closeConfirm();
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest || !event.target.closest("#row-menu")) closeRowMenu();
    });
    window.addEventListener("resize", closeRowMenu);
    window.addEventListener("scroll", closeRowMenu, true);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Tab") {
        const backdrop = !$("confirm-modal").hidden
          ? $("confirm-modal")
          : !$("rule-modal").hidden
            ? $("rule-modal")
            : null;
        if (!backdrop) return;
        const focusable = Array.prototype.filter.call(
          backdrop.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
          ),
          function (node) {
            return node.getClientRects().length > 0;
          }
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const outside = !backdrop.contains(document.activeElement);
        if (event.shiftKey && (outside || document.activeElement === first)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (outside || document.activeElement === last)) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (event.key !== "Escape") return;
      closeRowMenu();
      if (!$("confirm-modal").hidden) closeConfirm();
      else if (!$("rule-modal").hidden) closeRuleModal();
    });
  }

  function withTimeout(promise, ms, fallbackValue) {
    return new Promise(function (resolve) {
      let settled = false;
      const timer = window.setTimeout(function () {
        if (settled) return;
        settled = true;
        resolve(fallbackValue);
      }, ms);
      Promise.resolve(promise).then(
        function (value) {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve(value);
        },
        function () {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          resolve(fallbackValue);
        }
      );
    });
  }

  async function boot() {
    const embedded = window.parent !== window;
    bridge = window.magpie && embedded ? window.magpie : fallbackBridge();

    bindEvents();
    loadSortPreference();
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
      if (!Array.isArray(state.options.rules)) {
        state.rules = normalizeRules(PRESET_RULES);
        state.options.rules = state.rules;
        scheduleSave();
      }
      state.rejectMessage =
        typeof state.options.rejectMessage === "string" && state.options.rejectMessage.trim()
          ? state.options.rejectMessage
          : DEFAULT_REJECT_MESSAGE;
      renderAll();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
