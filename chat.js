// ==========================================
// AI Life Assistant Chat
// Version 3.0
// ==========================================

// -------------------------
// Elements
// -------------------------

const chatBox = document.getElementById("chatBox");

const userInput = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");

const attachBtn = document.getElementById("attachBtn");

const voiceBtn = document.getElementById("voiceBtn");

const attachmentMenu = document.getElementById("attachmentMenu");

const imagePicker = document.getElementById("imagePicker");

const filePicker = document.getElementById("filePicker");

// -------------------------
// Upload Memory
// -------------------------

let uploadedFiles = [];
// -------------------------
// Helpers
// -------------------------

function getCurrentTime(){

    return new Date().toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

function scrollBottom(){

    chatBox.scrollTop = chatBox.scrollHeight;

}
// -------------------------
// Add Message
// -------------------------

function addMessage(type, content){

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.innerHTML = `
        <div class="messageText">
            ${content}
        </div>

        <div class="messageTime">
            ${getCurrentTime()}
        </div>
    `;

    chatBox.appendChild(message);

    scrollBottom();

}
// -------------------------
// Typing Indicator
// -------------------------

function showTyping(){

    const typing = document.createElement("div");

    typing.className = "message ai typing";

    typing.id = "typingIndicator";

    typing.innerHTML = `
        <div class="messageText">
            🤖 AI is typing...
        </div>
    `;

    chatBox.appendChild(typing);

    scrollBottom();

}

function hideTyping(){

    const typing = document.getElementById("typingIndicator");

    if(typing){

        typing.remove();

    }

}
// -------------------------
// Auto Expand
// -------------------------

userInput.addEventListener("input",function(){

    this.style.height = "auto";

    this.style.height = this.scrollHeight + "px";

});

// -------------------------
// Composer State
// -------------------------

function updateComposer(){

    if(userInput.value.trim().length > 0){

        sendBtn.classList.add("active");

        if(voiceBtn){

            voiceBtn.style.display = "none";

        }

    }else{

        sendBtn.classList.remove("active");

        if(voiceBtn){

            voiceBtn.style.display = "flex";

        }

    }

}

userInput.addEventListener("input",updateComposer);

updateComposer();

// -------------------------
// AI Reply
// -------------------------

async function aiReply(text){

    showTyping();

    userInput.disabled = true;

    sendBtn.disabled = true;

    try{

        const answer = await smartAIReply(text);

        hideTyping();

        addMessage("ai", answer);

        if(typeof saveContext === "function"){

            saveContext("ai", answer);

        }

    }catch(error){

        hideTyping();

        addMessage(
            "ai",
            "⚠️ Sorry, something went wrong."
        );

        console.error(error);

    }

    userInput.disabled = false;

    sendBtn.disabled = false;

    userInput.focus();

}
