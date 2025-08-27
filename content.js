function getElementInfo(el) {
  return {
    selector: getUniqueSelector(el),
    id: el.id || null,
    name: el.name || null,
    class: el.className || null
  };
}

function getUniqueSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  if (el.className) return `${el.tagName.toLowerCase()}.${el.className.split(" ").join(".")}`;
  return el.tagName.toLowerCase();
}

function captureClick(e) {
  const elInfo = getElementInfo(e.target);

  const step = {
    action: "click",
    ...elInfo,
    url: window.location.href,
    timestamp: Date.now()
  };

  chrome.runtime.sendMessage({ type: "record_step", step });
}

function captureInput(e) {
  if (e.target.tagName.toLowerCase() !== "input" && e.target.tagName.toLowerCase() !== "textarea") return;

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

// Listeners globales
document.addEventListener("click", captureClick, true);
document.addEventListener("input", captureInput, true);
document.addEventListener("change", captureInput, true);
