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

function addMessage(type, text){

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
// ==========================================
// AI REPLY
// ==========================================

async function aiReply(userMessage){

    // Create typing indicator

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

    // Disable input

    userInput.disabled = true;

    sendBtn.disabled = true;

    if(voiceBtn){

        voiceBtn.disabled = true;

    }

    try{

        // Ask AI Brain

        let reply = await smartAIReply(userMessage);

        // Remove typing

        typing.remove();

        // Show AI message

        addMessage("ai", reply);

        // Save memory

        if(typeof saveContext === "function"){

            saveContext("ai", reply);

        }

    }

    catch(error){

        console.error(error);

        typing.remove();

        addMessage(

            "ai",

            "⚠️ Sorry, something went wrong."

        );

    }

    finally{

        // Enable input again

        userInput.disabled = false;

        sendBtn.disabled = false;

        if(voiceBtn){

            voiceBtn.disabled = false;

        }

        userInput.focus();

    }

}

// ==========================================
// ATTACHMENT MENU
// ==========================================

function openAttachmentMenu(){

    attachmentMenu.classList.toggle("show");

}

function closeAttachmentMenu(){

    attachmentMenu.classList.remove("show");

}



// ==========================================
// ATTACH BUTTON
// ==========================================

if(attachBtn){

    attachBtn.addEventListener("click", function(e){

        e.stopPropagation();

        openAttachmentMenu();

    });

}


// ==========================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// ==========================================

document.addEventListener("click", function(e){

    if(
        attachmentMenu &&
        !attachmentMenu.contains(e.target) &&
        e.target !== attachBtn
    ){

        closeAttachmentMenu();

    }

});



// ==========================================
// PICK IMAGE
// ==========================================

function pickImage(){

    imagePicker.removeAttribute("capture");

    imagePicker.click();

}

if(attachBtn){

    attachBtn.addEventListener("click", function(e){

        e.stopPropagation();

        openAttachmentMenu();

    });

}

// ==========================================
// CAMERA
// ==========================================

function takePhoto(){

    imagePicker.setAttribute("capture","environment");

    imagePicker.click();

}



// ==========================================
// PICK FILE
// ==========================================

function pickFile(){

    filePicker.click();

}



// ==========================================
// IMAGE UPLOAD
// ==========================================

imagePicker.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        addMessage("user",

            `<img
                src="${e.target.result}"
                class="chatImage">`

        );

    };

    reader.readAsDataURL(file);

    rememberUpload(file,"image");

    aiUploadReply("image",file);

    imagePicker.value = "";

    closeAttachmentMenu();

});



// ==========================================
// FILE UPLOAD
// ==========================================

filePicker.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    addMessage("user",

        `
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
        `

    );

    rememberUpload(file,"file");

    aiUploadReply("file",file);

    filePicker.value="";

    closeAttachmentMenu();

});
// ==========================================
// UPLOAD MEMORY
// ==========================================

let uploadedFiles = [];

function rememberUpload(file, type){

    uploadedFiles.push({

        name: file.name,

        type: type,

        size: file.size,

        date: new Date().toLocaleString()

    });

}



// ==========================================
// AI UPLOAD REPLY
// ==========================================

function aiUploadReply(type, file){

    let reply = "";

    if(type === "image"){

        reply = `

📷 Image received successfully.

What would you like me to do?

• 📝 Read text from image

• 👀 Describe the image

• 🔍 Analyze the image

• ❓Answer questions about it

`;

    }

    else{

        reply = `

📄 ${file.name} uploaded successfully.

What would you like me to do?

• 📑 Summarize the file

• 🧠 Explain the contents

• 🔍 Find important information

• ❓Answer questions about it

`;

    }

    setTimeout(function(){

        addMessage("ai", reply);

    },700);

}



// ==========================================
// OPTIONAL HELPER
// ==========================================

function getUploadedFiles(){

    return uploadedFiles;

}
