// ==========================================
// AI Life Assistant Chat UI
// Version 3.0
// Clean Architecture
// ==========================================



// ==========================================
// ELEMENTS
// ==========================================

const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const attachBtn = document.getElementById("attachBtn");

const attachmentMenu = document.getElementById("attachmentMenu");

const imagePicker = document.getElementById("imagePicker");
const filePicker = document.getElementById("filePicker");



// ==========================================
// GLOBAL VARIABLES
// ==========================================

let uploadedFiles =
JSON.parse(localStorage.getItem("uploadedFiles")) || [];

let isTyping = false;



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

    if(!chat) return;

    chat.scrollTop = chat.scrollHeight;

}



function saveUploads(){

    localStorage.setItem(

        "uploadedFiles",

        JSON.stringify(uploadedFiles)

    );

}

// ==========================================
// MESSAGE SYSTEM
// ==========================================

function createMessage(type, content){

    const bubble = document.createElement("div");

    bubble.className = `message ${type}`;

    const text = document.createElement("div");

    text.className = "messageText";

    text.innerHTML = content;

    const time = document.createElement("div");

    time.className = "messageTime";

    time.textContent = getCurrentTime();

    bubble.appendChild(text);

    bubble.appendChild(time);

    chat.appendChild(bubble);

    scrollBottom();

    return bubble;

}



// Simple Text Message

function addMessage(type, text){

    if(!chat) return;

    text = text.replace(/\n/g,"<br>");

    createMessage(type, text);

}

// ==========================================
// TYPING INDICATOR
// ==========================================

function showTyping(){

    if(isTyping) return;

    isTyping = true;

    const typing = document.createElement("div");

    typing.className = "message ai typing";

    typing.id = "typingIndicator";

    typing.innerHTML = `
        <div class="messageText">
            🤖 AI is typing<span class="dots">...</span>
        </div>
    `;

    chat.appendChild(typing);

    scrollBottom();

}



function hideTyping(){

    const typing = document.getElementById("typingIndicator");

    if(typing){

        typing.remove();

    }

    isTyping = false;

}
// ==========================================
// AI REPLY
// ==========================================

async function aiReply(text){

    showTyping();

    input.disabled = true;

    if(sendBtn){

        sendBtn.disabled = true;

    }

    try{

        const answer = await smartAIReply(text);

        hideTyping();

        addMessage("ai", answer);

        if(typeof saveContext === "function"){

            saveContext("ai", answer);

        }

    }

    catch(error){

        hideTyping();

        addMessage("ai","⚠️ Something went wrong. Please try again.");

        console.error(error);

    }

    finally{

        input.disabled = false;

        if(sendBtn){

            sendBtn.disabled = false;

        }

        input.focus();

    }

}

// ================================
// Composer Behaviour
// ================================

const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

function updateComposer(){

    const hasText = input.value.trim().length > 0;

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

input.addEventListener("input", updateComposer);

updateComposer();


// ------------------------------------------
// Send Message
// ------------------------------------------

function sendMessage(){

    const text = input.value.trim();

    if(text==="") return;

    addMessage("user",text);

    if(typeof saveContext==="function"){

        saveContext("user",text);

    }

    input.value="";
    updateComposer();

    input.style.height="auto";

    aiReply(text);

}


// ================================
// Enter Key
// ================================

input.addEventListener("keydown", function(e){

    if(e.key === "Enter" && !e.shiftKey){

    e.preventDefault();

    sendMessage();

}

});


// ------------------------------------------
// Attachment Menu
// ------------------------------------------

function openAttachmentMenu(){

    document
    .getElementById("attachmentMenu")
    .classList.toggle("show");

}

function closeAttachmentMenu(){

    document
    .getElementById("attachmentMenu")
    .classList.remove("show");

}

function pickImage(){

    imagePicker.removeAttribute("capture");

    imagePicker.click();

}

function takePhoto(){

    imagePicker.setAttribute("capture","environment");

    imagePicker.click();

}

function pickFile(){

    filePicker.click();

}


// ------------------------------------------
// Image Upload
// ------------------------------------------

if(imagePicker){

imagePicker.addEventListener("change",function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        addMessage("user",`

            <img
            src="${e.target.result}"
            class="chatImage">

        `);

    };

    reader.readAsDataURL(file);

    rememberUpload(file,"image");

    aiUploadReply("image",file);

    imagePicker.value="";

    imagePicker.removeAttribute("capture");

    closeAttachmentMenu();

});

}


// ------------------------------------------
// File Upload
// ------------------------------------------

if(filePicker){

filePicker.addEventListener("change",function(){

    const file = this.files[0];

    if(!file) return;

    addMessage("user",`

        <div class="chatFile">

            <div class="fileIcon">
                📄
            </div>

            <div class="fileInfo">

                <div class="fileName">
                    ${file.name}
                </div>

                <div class="fileSize">
                    ${(file.size/1024).toFixed(1)} KB
                </div>

            </div>

        </div>

    `);

    rememberUpload(file,"file");

    aiUploadReply("file",file);

    filePicker.value="";

    closeAttachmentMenu();

});

}


// ------------------------------------------
// AI Upload Reply
// ------------------------------------------

function aiUploadReply(type,file){

    let reply="";

    if(type==="image"){

        reply=`
📷 Image received successfully.

What would you like me to do?

• 📝 Read text
• 👀 Describe image
• 🔍 Analyze image
• ❓Answer questions
`;

    }

    else{

        reply=`
📄 ${file.name} uploaded.

What would you like me to do?

• 📑 Summarize
• 🧠 Explain
• 🔍 Extract information
• ❓Answer questions
`;

    }

    setTimeout(()=>{

        addMessage("ai",reply);

    },700);

}
// ======================
// Attachment Button
// ======================

const attachBtn = document.getElementById("attachBtn");

if (attachBtn) {

    attachBtn.addEventListener("click", openAttachmentMenu);

}
// ======================
// Close Attachment Menu
// ======================

document.addEventListener("click", function (e) {

    const menu = document.getElementById("attachmentMenu");

    if (!menu) return;

    if (
        !menu.contains(e.target) &&
        e.target.id !== "attachBtn"
    ) {
        menu.classList.remove("show");
    }

});
// ------------------------------------------
// Upload Memory
// ------------------------------------------

let uploadedFiles=[];

function rememberUpload(file,type){

    uploadedFiles.push({

        name:file.name,

        type:type,

        size:file.size,

        date:new Date().toLocaleString()

    });

}
