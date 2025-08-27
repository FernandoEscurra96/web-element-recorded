const SERVER_URL = "http://localhost:3000/steps"; // tu backend Node.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("send record step");
    console.log( message.step)
    if (message.type === "record_step"&& false) {
    console.log("Step captured:", message.step);

    // Mandar al servidor
    fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.step)
    }).catch(err => console.error("Error sending step:", err));
  }
});
