const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

startBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "start_recording" });
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stop_recording" });
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
