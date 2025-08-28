const clickedElements = new WeakSet();

function getUniqueSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  if (el.className) return `${el.tagName.toLowerCase()}.${el.className.split(" ").join(".")}`;
  return el.tagName.toLowerCase();
}

function getElementInfo(el) {
  return {
    selector: getUniqueSelector(el),
    id: el.id || null,
    name: el.name || null,
    class: el.className || null
  };
}

// ---- CLICK ----
function captureClick(e) {
  if (clickedElements.has(e.target)) return;
  clickedElements.add(e.target);

  const elInfo = getElementInfo(e.target);
  const step = {
    action: "click",
    ...elInfo,
    url: window.location.href,
    timestamp: Date.now()
  };

  chrome.runtime.sendMessage({ type: "record_step", step });

  setTimeout(() => clickedElements.delete(e.target), 0);
}

// ---- INPUT y TEXTAREA ----
function captureInput(e) {
  const tag = e.target.tagName.toLowerCase();
  if (tag !== "input" && tag !== "textarea") return;

  const elInfo = getElementInfo(e.target);
  const step = {
    action: "type",
    ...elInfo,
    value: e.target.value,
    inputType: e.target.type || "text",
    url: window.location.href,
    timestamp: Date.now()
  };

  chrome.runtime.sendMessage({ type: "record_step", step });
}

// ---- INPUT final (Enter / Tab) ----
function captureInputFinal(e) {
  const tag = e.target.tagName.toLowerCase();
  if (tag !== "input" && tag !== "textarea") return;

  if (e.key === "Enter" || e.key === "Tab") {
    const elInfo = getElementInfo(e.target);
    const step = {
      action: "type",
      ...elInfo,
      value: e.target.value,
      inputType: e.target.type || "text",
      url: window.location.href,
      timestamp: Date.now()
    };
    chrome.runtime.sendMessage({ type: "record_step", step });
  }
}

// ---- SELECT nativo ----
function captureSelect(e) {
  if (e.target.tagName.toLowerCase() !== "select") return;

  const elInfo = getElementInfo(e.target);
  const selectedOption = e.target.options[e.target.selectedIndex];

  const step = {
    action: "select",
    ...elInfo,
    value: selectedOption.value,
    text: selectedOption.text,
    url: window.location.href,
    timestamp: Date.now()
  };

  chrome.runtime.sendMessage({ type: "record_step", step });
}

// ---- Listeners ----
document.addEventListener("click", captureClick, false);
document.addEventListener("input", captureInput, true);
document.addEventListener("change", captureInput, true);
document.addEventListener("keydown", captureInputFinal, true);
document.addEventListener("change", captureSelect, true);
