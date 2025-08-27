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
  const step = {
    action: "type",
    selector: getUniqueSelector(e.target),
    value: e.target.value,
    url: window.location.href,
    timestamp: Date.now()
  };
  chrome.runtime.sendMessage({ type: "record_step", step });
}

document.addEventListener("click", captureClick, true);
document.addEventListener("change", captureInput, true);
