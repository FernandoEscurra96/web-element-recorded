// WeakSet para evitar capturas duplicadas por click
const clickedElements = new WeakSet();

// Genera un selector único aproximado
function getUniqueSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  if (el.className) return `${el.tagName.toLowerCase()}.${el.className.split(" ").join(".")}`;
  return el.tagName.toLowerCase();
}

// Extrae info completa del elemento
function getElementInfo(el) {
  return {
    selector: getUniqueSelector(el),
    id: el.id || null,
    name: el.name || null,
    class: el.className || null
  };
}

// Captura clicks
function captureClick(e) {
  if (clickedElements.has(e.target)) return; // ya capturado
  clickedElements.add(e.target);

  const elInfo = getElementInfo(e.target);

  const step = {
    action: "click",
    ...elInfo,
    url: window.location.href,
    timestamp: Date.now()
  };

  chrome.runtime.sendMessage({ type: "record_step", step });

  // Limpiar WeakSet después del ciclo de evento
  setTimeout(() => clickedElements.delete(e.target), 0);
}

// Captura cambios en inputs y textareas
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

// Listeners
document.addEventListener("click", captureClick, false); // fase bubbling para evitar duplicados
document.addEventListener("input", captureInput, true);   // captura en tiempo real
document.addEventListener("change", captureInput, true);  // captura al perder foco
