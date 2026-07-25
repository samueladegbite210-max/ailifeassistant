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

    text = text.replace(/\n/g, "<br>");

    chat.innerHTML += `
        <div class="message ${type}">
            ${text}
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// ================================
// AI Reply
// ================================

async function aiReply(text){

    const answer = await smartAIReply(text);

    addMessage("ai", answer);

    // Save AI response
    if(typeof saveContext === "function"){
        saveContext("ai", answer);
    }

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

// ================================
// Enter Key
// ================================

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});
