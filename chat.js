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

// Send Message

// -------------------------

function sendMessage(){

    const text = userInput.value.trim();

    if(!text) return;

    // Show user message

    addMessage("user", text);

    // Save conversation

    if(typeof saveContext === "function"){

        saveContext("user", text);

    }


    // Clear input

    userInput.value = "";

    userInput.style.height = "auto";

    updateComposer();

    // Ask AI

    aiReply(text);

}

// -------------------------
// Enter to Send
// -------------------------

userInput.addEventListener("keydown",function(e){

    if(e.key === "Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});
// -------------------------
// Send Button
// -------------------------

sendBtn.addEventListener("click", sendMessage);
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

// ==========================================
// Attachment Menu
// ==========================================

function openAttachmentMenu(){

    attachmentMenu.classList.toggle("show");

}

function closeAttachmentMenu(){

    attachmentMenu.classList.remove("show");

}

attachBtn.addEventListener("click", openAttachmentMenu);

document.addEventListener("click",(e)=>{

    if(
        !attachmentMenu.contains(e.target) &&
        e.target !== attachBtn
    ){

        closeAttachmentMenu();

    }

});
// ==========================================
// Image Upload
// ==========================================

function pickImage(){

    imagePicker.removeAttribute("capture");

    imagePicker.click();

}

function takePhoto(){

    imagePicker.setAttribute(
        "capture",
        "environment"
    );

    imagePicker.click();

}

imagePicker.addEventListener("change",()=>{

    const file = imagePicker.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload=(e)=>{

        addMessage(
            "user",
            `<img src="${e.target.result}" class="chatImage">`
        );

    };

    reader.readAsDataURL(file);

    rememberUpload(file,"image");

    aiUploadReply("image",file);

    imagePicker.value="";

    closeAttachmentMenu();

});

// ==========================================
// File Upload
// ==========================================

function pickFile(){

    filePicker.click();

}

filePicker.addEventListener("change",()=>{

    const file = filePicker.files[0];

    if(!file) return;

    addMessage(
        "user",
        `
        <div class="chatFile">

            <div class="fileIcon">📄</div>

            <div class="fileInfo">

                <div class="fileName">
                    ${file.name}
                </div>

                <div class="fileSize">
                    ${(file.size/1024).toFixed(1)} KB
                </div>

            </div>

        </div>
        `
    );

    rememberUpload(file,"file");

    aiUploadReply("file",file);

    filePicker.value="";

    closeAttachmentMenu();

});
