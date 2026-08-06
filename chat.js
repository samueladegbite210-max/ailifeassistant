// ==========================================
// AI Life Assistant Chat
// Version 3.0
// Foundation
// ==========================================



// ==========================================
// ELEMENTS
// ==========================================

const chatBox = document.getElementById("chatBox");

const userInput = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");

const voiceBtn = document.getElementById("voiceBtn");

const attachBtn = document.getElementById("attachBtn");

const attachmentMenu = document.getElementById("attachmentMenu");

const imagePicker = document.getElementById("imagePicker");

const filePicker = document.getElementById("filePicker");



// ==========================================
// HELPERS
// ==========================================

function getCurrentTime(){

    return new Date().toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

function scrollBottom(){

    chatBox.scrollTop = chatBox.scrollHeight;

}



// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(type,text){

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.innerHTML = `

        <div class="messageText">

            ${text.replace(/\n/g,"<br>")}

        </div>

        <div class="messageTime">

            ${getCurrentTime()}

        </div>

    `;

    chatBox.appendChild(message);

    scrollBottom();

}
// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage(){

    const text = userInput.value.trim();

    if(text === "") return;

    // Show user message
    addMessage("user", text);

    // Save conversation
    if(typeof saveContext === "function"){

        saveContext("user", text);

    }

    // Clear input
    userInput.value = "";

    // Reset textarea height
    userInput.style.height = "48px";

    // Update composer
    updateComposer();

    // Ask AI
    aiReply(text);

}



// ==========================================
// AUTO EXPAND TEXTAREA
// ==========================================

userInput.addEventListener("input", function(){

    this.style.height = "48px";

    this.style.height = this.scrollHeight + "px";

    updateComposer();

});



// ==========================================
// ENTER TO SEND
// ==========================================

userInput.addEventListener("keydown", function(e){

    if(e.key === "Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});



// ==========================================
// COMPOSER
// ==========================================

function updateComposer(){

    const hasText = userInput.value.trim().length > 0;

    if(hasText){

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



// ==========================================
// SEND BUTTON
// ==========================================

sendBtn.addEventListener("click", sendMessage);



// ==========================================
// INITIALIZE
// ==========================================

updateComposer();
