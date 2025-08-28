// ==========================
// Utils
// ==========================
function getElementInfo(el) {
  let selector = "";
  if (el.id) {
    selector = `#${el.id}`;
  } else if (el.name) {
    selector = `[name="${el.name}"]`;
  } else if (el.className) {
    selector =
      el.tagName.toLowerCase() +
      "." +
      el.className.trim().replace(/\s+/g, ".");
  } else {
    selector = el.tagName.toLowerCase();
  }

  // Calcular índice si hay múltiples iguales
  const allSimilar = Array.from(document.querySelectorAll(selector));
  let index = -1;
  if (allSimilar.length > 1) {
    index = allSimilar.indexOf(el);
  }

  return {
    selector,
    id: el.id || null,
    name: el.name || null,
    class: el.className || null,
    index: index >= 0 ? index : null,
  };
}

function findNearestLabelText(el) {
  // label[for=id]
  if (el.id) {
    const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (lbl) return lbl.innerText.trim();
  }

  // envoltorio <label> ... <el> ...
  const wrapLabel = el.closest("label");
  if (wrapLabel) return wrapLabel.innerText.trim();

  // label dentro del contenedor padre
  const container = el.closest(".form-group, .row, .field, div");
  if (container) {
    const lbl = container.querySelector("label");
    if (lbl) return lbl.innerText.trim();
  }

  return "unknown-label";
}

function sendStep(step) {
  chrome.runtime.sendMessage({ type: "record_step", step });
}

// ==========================
// Clicks
// ==========================
document.addEventListener("click", (e) => {
  const target = e.target.closest("button, a, input[type=button], input[type=submit]");
  if (!target) return;

  const step = {
    action: "click",
    ...getElementInfo(target),
    text: target.innerText || target.value || null,
    url: window.location.href,
    timestamp: Date.now(),
  };
  sendStep(step);
});

// ==========================
// Inputs (text, tel, email, etc.)
// ==========================
function attachInputListener(inputEl) {
  if (inputEl._hasRecorderListener) return;
  inputEl._hasRecorderListener = true;

  const handler = () => {
    const step = {
      action: "input",
      ...getElementInfo(inputEl),
      value: inputEl.value,
      url: window.location.href,
      timestamp: Date.now(),
    };
    sendStep(step);
  };

  inputEl.addEventListener("blur", handler);
  inputEl.addEventListener("change", handler);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      handler();
    }
  });
}

document.querySelectorAll("input[type=text], input[type=tel], input[type=email], input[type=number], input[type=password]")
  .forEach(attachInputListener);

// ==========================
// Selects
// ==========================
function attachSelectListener(selectEl) {
  if (selectEl._hasRecorderListener) return;
  selectEl._hasRecorderListener = true;

  selectEl.addEventListener("change", () => {
    const opt = selectEl.options[selectEl.selectedIndex];
    const step = {
      action: "select",
      ...getElementInfo(selectEl),
      value: selectEl.value,
      text: opt ? opt.textContent.trim() : null,
      context: findNearestLabelText(selectEl),
      url: window.location.href,
      timestamp: Date.now(),
    };
    sendStep(step);
  });
}

document.querySelectorAll("select").forEach(attachSelectListener);

// ==========================
// Observer para inputs y selects dinámicos
// ==========================
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    m.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        if (node.tagName) {
          const tag = node.tagName.toLowerCase();
          if (tag === "input") {
            attachInputListener(node);
          } else if (tag === "select") {
            attachSelectListener(node);
          }
        }
        // Si el nodo tiene hijos
        node.querySelectorAll &&
          node.querySelectorAll("input, select").forEach((el) => {
            if (el.tagName.toLowerCase() === "input") attachInputListener(el);
            if (el.tagName.toLowerCase() === "select") attachSelectListener(el);
          });
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
