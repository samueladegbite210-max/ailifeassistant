
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

function addMessage(type, text){

    chat.innerHTML += `
        <p><strong>${type}:</strong> ${text}</p>
    `;

    chat.scrollTop = chat.scrollHeight;

}

function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    addMessage("You", text);

    input.value = "";

}
