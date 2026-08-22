// ==========================================
// AI LIFE ASSISTANT
// chat.js
// Version 10.0
// STABLE CHAT CONTROLLER
// ==========================================

"use strict";

console.log("💬 chat.js loading...");


// ==========================================
// DOM ELEMENTS
// ==========================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

const attachBtn = document.getElementById("attachBtn");
const attachmentMenu = document.getElementById("attachmentMenu");

const imagePicker = document.getElementById("imagePicker");
const cameraPicker = document.getElementById("cameraPicker");
const filePicker = document.getElementById("filePicker");

const pickImageBtn = document.getElementById("pickImageBtn");
const takePhotoBtn = document.getElementById("takePhotoBtn");
const pickFileBtn = document.getElementById("pickFileBtn");


// ==========================================
// STARTUP CHECK
// ==========================================

console.log("💬 Chat elements:");

console.log("chatBox =", chatBox);
console.log("userInput =", userInput);
console.log("sendBtn =", sendBtn);
console.log("voiceBtn =", voiceBtn);
console.log("attachBtn =", attachBtn);


// ==========================================
// GLOBAL UPLOAD MEMORY
// ==========================================

window.uploadedFiles =
    Array.isArray(window.uploadedFiles)
        ? window.uploadedFiles
        : [];


// ==========================================
// GLOBAL ATTACHMENT
// ==========================================

if (!("aiAttachment" in window)) {

    window.aiAttachment = null;

}


// ==========================================
// STATE
// ==========================================

let isSending = false;


// ==========================================
// TIME
// ==========================================

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}


// ==========================================
// SCROLL
// ==========================================

function scrollBottom() {

    if (!chatBox) return;

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ==========================================
// ESCAPE HTML
// ==========================================

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

function addMessage(
    type,
    text,
    isHTML = false
) {

    if (!chatBox) {

        console.error(
            "❌ chatBox was not found."
        );

        return;

    }


    const message =
        document.createElement("div");

    message.className =
        "message " + type;


    const messageText =
        document.createElement("div");

    messageText.className =
        "messageText";


    if (isHTML) {

        messageText.innerHTML =
            text;

    } else {

        messageText.innerHTML =
            escapeHTML(text)
                .replace(/\n/g, "<br>");

    }


    const messageTime =
        document.createElement("div");

    messageTime.className =
        "messageTime";

    messageTime.textContent =
        getCurrentTime();


    message.appendChild(
        messageText
    );

    message.appendChild(
        messageTime
    );

    chatBox.appendChild(
        message
    );


    scrollBottom();

}


// ==========================================
// TYPING INDICATOR
// ==========================================

function showTyping() {

    hideTyping();


    if (!chatBox) return;


    const typing =
        document.createElement("div");

    typing.id =
        "typingIndicator";

    typing.className =
        "message ai";


    typing.innerHTML = `

        <div class="messageText">
            🤖 AI is typing...
        </div>

    `;


    chatBox.appendChild(
        typing
    );


    scrollBottom();

}


function hideTyping() {

    const typing =
        document.getElementById(
            "typingIndicator"
        );


    if (typing) {

        typing.remove();

    }

}


// ==========================================
// COMPOSER
// ==========================================

function updateComposer() {

    if (!userInput || !sendBtn) {

        return;

    }


    const hasText =
        userInput.value.trim().length > 0;


    if (hasText) {

        sendBtn.classList.add(
            "active"
        );


        if (voiceBtn) {

            voiceBtn.style.display =
                "none";

        }

    } else {

        sendBtn.classList.remove(
            "active"
        );


        if (voiceBtn) {

            voiceBtn.style.display =
                "flex";

        }

    }

}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage(event) {

    // Prevent button/form default behavior

    if (event) {

        event.preventDefault();
        event.stopPropagation();

    }


    console.log(
        "🚀 sendMessage() called"
    );


    // --------------------------------------
    // Check input
    // --------------------------------------

    if (!userInput) {

        console.error(
            "❌ userInput not found."
        );

        return;

    }


    // --------------------------------------
    // Prevent double sending
    // --------------------------------------

    if (isSending) {

        console.log(
            "⏳ Message already processing."
        );

        return;

    }


    const text =
        userInput.value.trim();


    console.log(
        "📝 User message:",
        text
    );


    // --------------------------------------
    // Empty message
    // --------------------------------------

    if (!text) {

        console.log(
            "⚠️ Empty message."
        );

        return;

    }


    isSending = true;


    // --------------------------------------
    // Show user message
    // --------------------------------------

    addMessage(
        "user",
        text
    );


    // --------------------------------------
    // Save user context
    // --------------------------------------

    try {

        if (
            typeof window.saveContext ===
            "function"
        ) {

            window.saveContext(
                "user",
                text
            );

        }

    } catch (error) {

        console.warn(
            "⚠️ saveContext failed:",
            error
        );

    }


    // --------------------------------------
    // Clear input
    // --------------------------------------

    userInput.value = "";

    userInput.style.height =
        "auto";


    updateComposer();


    // --------------------------------------
    // Generate AI response
    // --------------------------------------

    await aiReply(text);

}


// ==========================================
// AI REPLY
// ==========================================

async function aiReply(text) {

    console.log(
        "🧠 aiReply() started:",
        text
    );


    showTyping();


    // Disable input while processing

    if (userInput) {

        userInput.disabled =
            true;

    }


    if (sendBtn) {

        sendBtn.disabled =
            true;

    }


    try {

        let reply = null;


        // ----------------------------------
        // Check AI controller
        // ----------------------------------

        if (
            typeof window.smartAIReply !==
            "function"
        ) {

            throw new Error(
                "smartAIReply() is not loaded."
            );

        }


        console.log(
            "🧠 Calling smartAIReply()..."
        );


        // ----------------------------------
        // CALL MAIN AI
        // ----------------------------------

        reply =
            await window.smartAIReply(
                text
            );


        console.log(
            "🤖 AI response:",
            reply
        );


        hideTyping();


        // ----------------------------------
        // Empty response
        // ----------------------------------

        if (
            reply === null ||
            reply === undefined ||
            String(reply).trim() === ""
        ) {

            reply =
                "🤖 I couldn't generate a response.";

        }


        // ----------------------------------
        // Show AI response
        // ----------------------------------

        addMessage(
            "ai",
            String(reply)
        );


        // ----------------------------------
        // Save AI context
        // ----------------------------------

        try {

            if (
                typeof window.saveContext ===
                "function"
            ) {

                window.saveContext(
                    "ai",
                    String(reply)
                );

            }

        } catch (error) {

            console.warn(
                "⚠️ AI context save failed:",
                error
            );

        }


    } catch (error) {

        console.error(
            "❌ AI REPLY ERROR:",
            error
        );


        hideTyping();


        addMessage(
            "ai",
            "⚠️ I couldn't process that message.\n\n" +
            "Error: " +
            error.message
        );

    } finally {

        // ----------------------------------
        // ALWAYS UNLOCK CHAT
        // ----------------------------------

        isSending =
            false;


        if (userInput) {

            userInput.disabled =
                false;

            userInput.focus();

        }


        if (sendBtn) {

            sendBtn.disabled =
                false;

        }


        updateComposer();


        console.log(
            "✅ Chat ready."
        );

    }

}


// ==========================================
// MAKE FUNCTIONS GLOBAL
// ==========================================

window.sendMessage =
    sendMessage;

window.aiReply =
    aiReply;

window.addMessage =
    addMessage;


// ==========================================
// TEXTAREA INPUT
// ==========================================

if (userInput) {

    userInput.addEventListener(
        "input",
        function () {

            this.style.height =
                "auto";


            this.style.height =
                this.scrollHeight + "px";


            updateComposer();

        }
    );


    userInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage(event);

            }

        }
    );

}


// ==========================================
// SEND BUTTON
// ==========================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        function (event) {

            console.log(
                "🟢 SEND BUTTON CLICKED"
            );


            sendMessage(event);

        }
    );

} else {

    console.error(
        "❌ sendBtn NOT FOUND."
    );

}


// ==========================================
// ATTACHMENT MENU
// ==========================================

function openAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.add(
        "show"
    );

}


function closeAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.remove(
        "show"
    );

}


function toggleAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.toggle(
        "show"
    );

}


// ==========================================
// ATTACH BUTTON
// ==========================================

if (attachBtn) {

    attachBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            toggleAttachmentMenu();

        }
    );

}


// ==========================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (!attachmentMenu) return;


        if (
            !attachmentMenu.contains(
                event.target
            ) &&
            event.target !== attachBtn
        ) {

            closeAttachmentMenu();

        }

    }
);


// ==========================================
// IMAGE PICKER
// ==========================================

function pickImage() {

    if (!imagePicker) {

        console.error(
            "❌ imagePicker not found."
        );

        return;

    }


    imagePicker.removeAttribute(
        "capture"
    );


    imagePicker.click();

}


function takePhoto() {

    if (!cameraPicker) {

        console.error(
            "❌ cameraPicker not found."
        );

        return;

    }


    cameraPicker.click();

}


function pickFile() {

    if (!filePicker) {

        console.error(
            "❌ filePicker not found."
        );

        return;

    }


    filePicker.click();

}


// Make attachment functions global

window.pickImage =
    pickImage;

window.takePhoto =
    takePhoto;

window.pickFile =
    pickFile;


// ==========================================
// IMAGE UPLOAD
// ==========================================

if (pickImageBtn) {

    pickImageBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            pickImage();

            closeAttachmentMenu();

        }
    );

}


if (takePhotoBtn) {

    takePhotoBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            takePhoto();

            closeAttachmentMenu();

        }
    );

}


if (imagePicker) {

    imagePicker.addEventListener(
        "change",
        function () {

            processImage(
                imagePicker
            );

        }
    );

}


if (cameraPicker) {

    cameraPicker.addEventListener(
        "change",
        function () {

            processImage(
                cameraPicker
            );

        }
    );

}


// ==========================================
// PROCESS IMAGE
// ==========================================

function processImage(input) {

    const file =
        input.files &&
        input.files[0];


    if (!file) return;


    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {

        addMessage(
            "ai",
            "⚠️ Please select a valid image."
        );

        input.value = "";

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            const imageData =
                event.target.result;


            window.aiAttachment = {

                type: "image",

                name: file.name,

                mimeType: file.type,

                size: file.size,

                data: imageData,

                file: file,

                date:
                    new Date().toISOString()

            };


            addMessage(
                "user",

                `<img
                    src="${imageData}"
                    class="chatImage"
                    alt="Uploaded image"
                >`,

                true
            );


            rememberUpload(
                file,
                "image"
            );


            addMessage(
                "ai",
                "📷 Image received.\n\n" +
                "You can ask me to:\n" +
                "📝 Read the text\n" +
                "👀 Describe the image\n" +
                "🔍 Analyze the image"
            );


            input.value = "";

            input.removeAttribute(
                "capture"
            );


            closeAttachmentMenu();

        };


    reader.onerror =
        function () {

            console.error(
                "❌ Image FileReader error"
            );


            addMessage(
                "ai",
                "⚠️ I couldn't read that image."
            );


            input.value = "";

        };


    reader.readAsDataURL(file);

}


// ==========================================
// FILE UPLOAD
// ==========================================

if (pickFileBtn) {

    pickFileBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            pickFile();

            closeAttachmentMenu();

        }
    );

}


if (filePicker) {

    filePicker.addEventListener(
        "change",
        function () {

            processFile(
                filePicker
            );

        }
    );

}


// ==========================================
// PROCESS FILE
// ==========================================

function processFile(input) {

    const file =
        input.files &&
        input.files[0];


    if (!file) return;


    window.aiAttachment = {

        type: "file",

        name: file.name,

        mimeType:
            file.type ||
            "application/octet-stream",

        size: file.size,

        file: file,

        date:
            new Date().toISOString()

    };


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


    rememberUpload(
        file,
        "file"
    );


    addMessage(
        "ai",
        `📄 ${file.name} received.\n\n` +
        "You can ask me to read, explain, or summarize it."
    );


    input.value = "";

    closeAttachmentMenu();

}


// ==========================================
// FILE SIZE
// ==========================================

function formatFileSize(bytes) {

    if (!bytes || bytes <= 0) {

        return "0 Bytes";

    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );


    return (
        (
            bytes /
            Math.pow(1024, index)
        ).toFixed(1)
        +
        " " +
        units[index]
    );

}


// ==========================================
// REMEMBER UPLOAD
// ==========================================

function rememberUpload(
    file,
    type
) {

    if (!file) return;


    if (!Array.isArray(
        window.uploadedFiles
    )) {

        window.uploadedFiles = [];

    }


    window.uploadedFiles.push({

        name: file.name,

        type: type,

        size: file.size,

        date:
            new Date().toISOString()

    });

}


// ==========================================
// GET UPLOADS
// ==========================================

function getUploadedFiles() {

    return Array.isArray(
        window.uploadedFiles
    )
        ? window.uploadedFiles
        : [];

}


window.getUploadedFiles =
    getUploadedFiles;


// ==========================================
// VOICE
// ==========================================

if (voiceBtn) {

    voiceBtn.addEventListener(
        "click",
        function () {

            addMessage(
                "ai",
                "🎤 Voice input is coming soon."
            );

        }
    );

}


// ==========================================
// INITIALIZE
// ==========================================

updateComposer();


console.log(
    "================================="
);

console.log(
    "✅ chat.js VERSION 10 LOADED"
);

console.log(
    "sendMessage:",
    typeof window.sendMessage
);

console.log(
    "aiReply:",
    typeof window.aiReply
);

// ==========================================
// GLOBAL CHAT EXPORTS
// ==========================================

window.sendMessage = sendMessage;
window.aiReply = aiReply;
window.addMessage = addMessage;
window.updateComposer = updateComposer;

console.log(
    "📨 sendMessage exported:",
    typeof window.sendMessage
);
console.log(
    "================================="
);
