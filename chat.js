alert("Chat.js is working!");

const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

function sendMessage() {
    alert("Send button works!");

    const text = input.value.trim();

    if (text === "") return;

    chat.innerHTML += "<p><strong>You:</strong> " + text + "</p>";

    input.value = "";
}
