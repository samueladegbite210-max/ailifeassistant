// Storage
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

// ==========================
function addMessage(type, text){

    chat.innerHTML += `
        <div class="message ${type}">
            ${text}
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// ==========================
async function aiReply(text){

    const answer = await smartAIReply(text);

    addMessage("ai", answer);

}

// ==========================
function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    addMessage("user", text);

    input.value="";

    aiReply(text);

}

input.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});
