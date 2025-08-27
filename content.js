function getUniqueSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  if (el.className) return `${el.tagName.toLowerCase()}.${el.className.split(" ").join(".")}`;
  return el.tagName.toLowerCase();
}

function captureClick(e) {
  const step = {
    action: "click",
    selector: getUniqueSelector(e.target),
    url: window.location.href,
    timestamp: Date.now()
  };
  chrome.runtime.sendMessage({ type: "record_step", step });
}

function captureInput(e) {
  // Solo capturamos <input> y <textarea>
  if (e.target.tagName.toLowerCase() !== "input" && e.target.tagName.toLowerCase() !== "textarea") return;

  const step = {
    action: "type",
    selector: getUniqueSelector(e.target),
    value: e.target.value,
    inputType: e.target.type || "text", // para saber si era tel, email, etc.
    url: window.location.href,
    timestamp: Date.now()
  };

  chrome.runtime.sendMessage({ type: "record_step", step });
}

// Listeners globales
document.addEventListener("click", captureClick, true);

// Capturamos cambios en inputs (incluye type="tel")
document.addEventListener("input", captureInput, true);
document.addEventListener("change", captureInput, true);
