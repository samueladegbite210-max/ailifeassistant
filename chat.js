const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

function addMessage(type, text) {
    chat.innerHTML += `
        <div class="message ${type}">
            ${text}
        </div>
    `;
}

function sendMessage() {
    alert("chat.js works!");

    const text = input.value.trim();

    if (text === "") return;

    addMessage("user", text);

    input.value = "";

    addMessage("ai", "Hello Samuel!");
}
