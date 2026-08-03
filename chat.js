// ================================
// AI Life Assistant Chat UI
// ================================

// Elements
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");



// ================================
// Add Message
// ================================
function addMessage(type, text){
    text = text.replace(/\n/g,"<br>");
    const time = new Date().toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.innerHTML = `
        <div class="messageText">
            ${text}
        </div>
        <div class="messageTime">
            ${time}
        </div>
    `;
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}
// ================================
// AI Reply
// ================================
async function aiReply(text){
    const typing = document.createElement("div");
    typing.className = "message ai typing";
    typing.id = "typingIndicator";
    typing.innerHTML = "🤖 AI is typing...";
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
    // Disable input while AI is replying
    input.disabled = true;
    const sendBtn = document.querySelector("button[onclick='sendMessage()']");
    if(sendBtn) sendBtn.disabled = true;
    const answer = await smartAIReply(text);
    // Remove typing indicator
    typing.remove();
    addMessage("ai", answer);
    if(typeof saveContext === "function"){
        saveContext("ai", answer);
    }
    // Enable input again
    input.disabled = false;
    if(sendBtn) sendBtn.disabled = false;
    input.focus();
}
// ================================
// Send Message
// ================================

function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    addMessage("user", text);

    // Save user message
    if(typeof saveContext === "function"){
        saveContext("user", text);
    }

    input.value = "";

    aiReply(text);

}
// ======================
// Attachment Menu
// ======================

function openAttachmentMenu(){

    document
        .getElementById("attachmentMenu")
        .classList.toggle("show");

}

function pickImage(){

    document
        .getElementById("imagePicker")
        .click();

}

function pickFile(){

    document
        .getElementById("filePicker")
        .click();

}

function takePhoto(){

    document
        .getElementById("imagePicker")
        .setAttribute("capture","environment");

    document
        .getElementById("imagePicker")
        .click();

}

// ================================
// Enter Key
// ================================

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});
