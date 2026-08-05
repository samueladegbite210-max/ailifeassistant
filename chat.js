// ==========================================
// AI Life Assistant Chat UI
// Version 2.0
// Clean Foundation
// ==========================================


// ------------------------------------------
// Elements
// ------------------------------------------

const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

const imagePicker = document.getElementById("imagePicker");
const filePicker = document.getElementById("filePicker");

// Auto Expand Textarea

input.addEventListener("input", function(){

    this.style.height = "auto";

    this.style.height = this.scrollHeight + "px";

});
// ------------------------------------------
// Helpers
// ------------------------------------------

function getCurrentTime() {

    return new Date().toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });

}

function scrollBottom(){

    chat.scrollTop = chat.scrollHeight;

}


// ------------------------------------------
// Add Chat Message
// ------------------------------------------

function addMessage(type,text){

    text = text.replace(/\n/g,"<br>");

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.innerHTML = `
        <div class="messageText">
            ${text}
        </div>

        <div class="messageTime">
            ${getCurrentTime()}
        </div>
    `;

    chat.appendChild(message);

    scrollBottom();

}


// ------------------------------------------
// AI Reply
// ------------------------------------------

async function aiReply(text){

    const typing = document.createElement("div");

    typing.className = "message ai typing";

    typing.id = "typingIndicator";

    typing.innerHTML = "🤖 AI is typing...";

    chat.appendChild(typing);

    scrollBottom();

    input.disabled = true;

    const sendBtn = document.getElementById("sendBtn");

    if(sendBtn) sendBtn.disabled = true;

    const answer = await smartAIReply(text);

    typing.remove();

    addMessage("ai",answer);

    if(typeof saveContext==="function"){

        saveContext("ai",answer);

    }

    input.disabled = false;

    if(sendBtn) sendBtn.disabled = false;

    input.focus();

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

    reader.onload=function(e){

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

document.addEventListener("click", function(e){

    document.addEventListener("click", function(e){

    const menu = document.getElementById("attachmentMenu");

    if(!menu) return;

    if(
        !menu.contains(e.target) &&
        e.target.id !== "attachBtn"
    ){

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
