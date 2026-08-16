// ==========================================
// AI Life Assistant Chat
// Version 3.1
// Clean Chat + Attachment System
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
// ATTACHMENT STATE
// ==========================================

let currentAttachment = null;
let uploadedFiles = [];


// ==========================================
// HELPERS
// ==========================================

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}


function scrollBottom() {

    if (!chatBox) return;

    chatBox.scrollTop = chatBox.scrollHeight;

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(type, content, isHTML = false) {

    if (!chatBox) return;

    const message = document.createElement("div");

    message.className = `message ${type}`;


    const messageText = document.createElement("div");

    messageText.className = "messageText";


    if (isHTML) {

        messageText.innerHTML = content;

    } else {

        messageText.innerHTML = escapeHTML(content)
            .replace(/\n/g, "<br>");

    }


    const messageTime = document.createElement("div");

    messageTime.className = "messageTime";

    messageTime.textContent = getCurrentTime();


    message.appendChild(messageText);

    message.appendChild(messageTime);

    chatBox.appendChild(message);


    scrollBottom();

}


// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage() {

    if (!userInput) return;


    const text = userInput.value.trim();


    if (text === "") return;


    // Show user message

    addMessage("user", text);


    // Save conversation

    if (typeof saveContext === "function") {

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

if (userInput) {

    userInput.addEventListener("input", function () {

        this.style.height = "48px";

        this.style.height = this.scrollHeight + "px";

        updateComposer();

    });


    // ======================================
    // ENTER TO SEND
    // ======================================

    userInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    });

}


// ==========================================
// COMPOSER
// ==========================================

function updateComposer() {

    if (!userInput || !sendBtn) return;


    const hasText =
        userInput.value.trim().length > 0;


    if (hasText) {

        sendBtn.classList.add("active");


        if (voiceBtn) {

            voiceBtn.style.display = "none";

        }

    } else {

        sendBtn.classList.remove("active");


        if (voiceBtn) {

            voiceBtn.style.display = "flex";

        }

    }

}


// ==========================================
// SEND BUTTON
// ==========================================

if (sendBtn) {

    sendBtn.addEventListener("click", sendMessage);

}


// ==========================================
// AI REPLY
// ==========================================

async function aiReply(userMessage) {

    if (!chatBox) return;


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

    if (userInput) {

        userInput.disabled = true;

    }


    if (sendBtn) {

        sendBtn.disabled = true;

    }


    if (voiceBtn) {

        voiceBtn.disabled = true;

    }


    try {

        // Ask AI Brain

        let reply;


        if (typeof smartAIReply === "function") {

            reply = await smartAIReply(userMessage);

        } else {

            reply =
                "⚠️ AI brain is not connected yet.";

        }


        // Remove typing

        typing.remove();


        // Show AI message

        addMessage("ai", reply);


        // Save memory

        if (typeof saveContext === "function") {

            saveContext("ai", reply);

        }

    }


    catch (error) {

        console.error("AI Reply Error:", error);


        typing.remove();


        addMessage(
            "ai",
            "⚠️ Sorry, something went wrong while processing your message."
        );

    }


    finally {

        // Enable input again

        if (userInput) {

            userInput.disabled = false;

        }


        if (sendBtn) {

            sendBtn.disabled = false;

        }


        if (voiceBtn) {

            voiceBtn.disabled = false;

        }


        if (userInput) {

            userInput.focus();

        }

    }

}


// ==========================================
// ATTACHMENT MENU
// ==========================================

function openAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.add("show");

}


function closeAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.remove("show");

}


function toggleAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.toggle("show");

}


// ==========================================
// ATTACH BUTTON
// ==========================================

if (attachBtn) {

    attachBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        toggleAttachmentMenu();

    });

}


// ==========================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// ==========================================

document.addEventListener("click", function (e) {

    if (!attachmentMenu) return;


    if (
        !attachmentMenu.contains(e.target) &&
        e.target !== attachBtn
    ) {

        closeAttachmentMenu();

    }

});


// ==========================================
// PICK IMAGE
// ==========================================

function pickImage() {

    if (!imagePicker) return;


    imagePicker.removeAttribute("capture");


    imagePicker.click();

}


// ==========================================
// CAMERA
// ==========================================

function takePhoto() {

    if (!imagePicker) return;


    imagePicker.setAttribute(
        "capture",
        "environment"
    );


    imagePicker.click();

}


// ==========================================
// PICK FILE
// ==========================================

function pickFile() {

    if (!filePicker) return;


    filePicker.click();

}


// ==========================================
// IMAGE UPLOAD
// ==========================================

if (imagePicker) {

    imagePicker.addEventListener(
        "change",
        handleImageUpload
    );

}


function handleImageUpload() {

    const file = this.files && this.files[0];


    if (!file) return;


    // Check image

    if (!file.type.startsWith("image/")) {

        addMessage(
            "ai",
            "⚠️ Please select a valid image file."
        );

        this.value = "";

        return;

    }


    const reader = new FileReader();


    reader.onload = function (e) {

        const imageData = e.target.result;


        // ==================================
        // SAVE CURRENT IMAGE
        // ==================================

        currentAttachment = {

            type: "image",

            name: file.name,

            mimeType: file.type,

            size: file.size,

            data: imageData,

            file: file,

            date: new Date().toISOString()

        };


        // ==================================
        // SHOW IMAGE IN CHAT
        // ==================================

        addMessage(

            "user",

            `<img
                src="${imageData}"
                class="chatImage"
                alt="Uploaded image"
            >`,

            true

        );


        // ==================================
        // SAVE UPLOAD MEMORY
        // ==================================

        rememberUpload(file, "image");


        // ==================================
        // AI CONFIRMATION
        // ==================================

        setTimeout(function () {

            addMessage(

                "ai",

                `📷 Image received successfully.

What would you like me to do?

📝 Read text from image

👀 Describe the image

🔍 Analyze the image

❓ Answer questions about it`

            );

        }, 700);


        // Reset picker

        imagePicker.value = "";


        closeAttachmentMenu();

    };


    reader.onerror = function () {

        addMessage(
            "ai",
            "⚠️ I couldn't read that image. Please try again."
        );

        imagePicker.value = "";

    };


    reader.readAsDataURL(file);

}


// ==========================================
// FILE UPLOAD
// ==========================================

if (filePicker) {

    filePicker.addEventListener(
        "change",
        handleFileUpload
    );

}


async function handleFileUpload() {

    const file = this.files && this.files[0];


    if (!file) return;


    // ==================================
    // SAVE CURRENT FILE
    // ==================================

    currentAttachment = {

        type: "file",

        name: file.name,

        mimeType: file.type,

        size: file.size,

        file: file,

        date: new Date().toISOString()

    };


    // ==================================
    // SHOW FILE IN CHAT
    // ==================================

    addMessage(

        "user",

        `
        <div class="chatFile">

            <div class="fileIcon">
                📄
            </div>

            <div class="fileInfo">

                <div class="fileName">
                    ${escapeHTML(file.name)}
                </div>

                <div class="fileSize">
                    ${formatFileSize(file.size)}
                </div>

            </div>

        </div>
        `,

        true

    );


    // ==================================
    // SAVE MEMORY
    // ==================================

    rememberUpload(file, "file");


    closeAttachmentMenu();


    // Reset picker

    filePicker.value = "";


    // ==================================
    // SEND FILE TO FILE HANDLER
    // ==================================

    if (typeof handleFileCommand === "function") {

        try {

            await handleFileCommand(file);

        }

        catch (error) {

            console.error(
                "File Handler Error:",
                error
            );

            addMessage(
                "ai",
                "⚠️ The file was uploaded, but I couldn't analyze it."
            );

        }

        return;

    }


    // ==================================
    // FALLBACK CONFIRMATION
    // ==================================

    aiUploadReply("file", file);

}


// ==========================================
// FILE SIZE
// ==========================================

function formatFileSize(bytes) {

    if (bytes === 0) return "0 Bytes";


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const i = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );


    return (
        parseFloat(
            (bytes / Math.pow(1024, i))
                .toFixed(1)
        )
        + " "
        + units[i]
    );

}


// ==========================================
// UPLOAD MEMORY
// ==========================================

function rememberUpload(file, type) {

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

function aiUploadReply(type, file) {

    let reply = "";


    if (type === "image") {

        reply = `

📷 Image received successfully.

What would you like me to do?

• 📝 Read text from image

• 👀 Describe the image

• 🔍 Analyze the image

• ❓ Answer questions about it

`;

    }

    else {

        reply = `

📄 ${escapeHTML(file.name)} uploaded successfully.

What would you like me to do?

• 📑 Summarize the file

• 🧠 Explain the contents

• 🔍 Find important information

• ❓ Answer questions about it

`;

    }


    setTimeout(function () {

        addMessage(
            "ai",
            reply
        );

    }, 700);

}


// ==========================================
// GET UPLOADED FILES
// ==========================================

function getUploadedFiles() {

    return uploadedFiles;

}


// ==========================================
// INITIALIZE
// ==========================================

updateComposer();

console.log(
    "✅ AI Life Assistant chat.js loaded successfully."
);
