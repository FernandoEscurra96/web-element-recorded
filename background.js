const SERVER_URL = "http://localhost:3000/steps"; // tu backend Node.js
let isRecording = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "start_recording") {
    isRecording = true;
    console.log("Grabación iniciada");
  }

  if (message.type === "stop_recording") {
    isRecording = false;
    console.log("Grabación detenida");
  }
  
  if(isRecording){
    console.log("send record step");
    console.log( message.step)
  }
  //console.log("send record step");
  //console.log( message.step)
  
  if (message.type === "record_step" && isRecording && false) {
    console.log("Step captured:", message.step);

    fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.step)
    }).catch(err => console.error("Error sending step:", err));
  }
});
