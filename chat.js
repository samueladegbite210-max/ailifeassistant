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
// Auto expand textarea

const textarea = document.getElementById("userInput");

textarea.addEventListener("input", () => {

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

});
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
// ======================
// Image Preview
// ======================

const imagePicker = document.getElementById("imagePicker");

if(imagePicker){

    imagePicker.addEventListener("change", function(){

        const file = this.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload = function(e){

            chat.innerHTML += `
                <div class="message user">

                    <img
                        src="${e.target.result}"
                        class="chatImage">

                    <div class="time">
                        ${new Date().toLocaleTimeString([],{
                            hour:"2-digit",
                            minute:"2-digit"
                        })}
                    </div>

                </div>
            `;

            chat.scrollTop = chat.scrollHeight;

        };

        reader.readAsDataURL(file);
        aiUploadReply("image",file);
        rememberUpload(file, "image");
        aiUploadReply("file",file);
     rememberUpload(file, "file");

    });

}
// ======================
// File Preview
// ======================

const filePicker = document.getElementById("filePicker");

if(filePicker){

    filePicker.addEventListener("change",function(){

        const file = this.files[0];

        if(!file) return;

        const time = new Date().toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
        });

        chat.innerHTML += `
            <div class="message user">

                <div class="chatFile">

                    <div class="fileIcon">📄</div>

                    <div class="fileInfo">

                        <div class="fileName">${file.name}</div>

                        <div class="fileSize">
                            ${(file.size/1024).toFixed(1)} KB
                        </div>

                    </div>

                </div>

                <div class="time">${time}</div>

            </div>
        `;

        chat.scrollTop = chat.scrollHeight;

        filePicker.value = "";

    });

}
// ======================
// AI Upload Reply
// ======================

function aiUploadReply(type, file){

    let reply = "";

    if(type === "image"){

        reply = `
📷 Image received successfully.

What would you like me to do?

• 📝 Read text from the image
• 👀 Describe the image
• 🔍 Analyze it
• ❓Answer questions about it
`;

    }

    else{

        reply = `
📄 ${file.name} uploaded successfully.

What would you like me to do?

• 📑 Summarize it
• 🧠 Explain it
• 🔍 Find important information
• ❓Answer questions about it
`;

    }

    setTimeout(()=>{

        addMessage("ai",reply);

    },800);

}
// ======================
// Upload Memory
// ======================

let uploadedFiles = [];

function rememberUpload(file, type){

    uploadedFiles.push({

        name: file.name,
        type: type,
        size: file.size,
        date: new Date().toLocaleString()

    });

}
// ================================
// Enter Key
// ================================

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});
