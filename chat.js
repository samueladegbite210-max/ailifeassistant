// ==========================================
// AI LIFE ASSISTANT
// chat.js
// Version 4.0
// Clean Chat Foundation
// ==========================================

"use strict";


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

// IMPORTANT:
// Do NOT declare currentAttachment again
// inside smartAI.js.

window.aiAttachment = null;


// ==========================================
// UPLOAD MEMORY
// ==========================================

window.uploadedFiles = window.uploadedFiles || [];


// ==========================================
// HELPER — CURRENT TIME
// ==========================================

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}


// ==========================================
// HELPER — SCROLL CHAT
// ==========================================

function scrollBottom() {

    if (!chatBox) return;

    chatBox.scrollTop = chatBox.scrollHeight;

}


// ==========================================
// HELPER — ESCAPE TEXT
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

function addMessage(type, text, html = false) {

    if (!chatBox) return;

    const message = document.createElement("div");

    message.className = "message " + type;


    const messageText = document.createElement("div");

    messageText.className = "messageText";


    if (html) {

        messageText.innerHTML = text;

    } else {

        messageText.innerHTML =
            escapeHTML(text).replace(/\n/g, "<br>");

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

async function sendMessage(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();

    }


    if (!userInput) return;


    const text = userInput.value.trim();


    if (!text) return;


    // Show user message

    addMessage("user", text);


    // Save conversation

    if (typeof saveContext === "function") {

        try {

            saveContext("user", text);

        } catch (error) {

            console.error(
                "saveContext error:",
                error
            );

        }

    }


    // Clear input

    userInput.value = "";

    userInput.style.height = "48px";


    updateComposer();


    // Ask AI

    await aiReply(text);

}


// ==========================================
// AI REPLY
// ==========================================

async function aiReply(text) {

    if (!chatBox) return;


    const typing = document.createElement("div");

    typing.className =
        "message ai typing";


    typing.innerHTML = `
        <div class="messageText">
            🤖 AI is typing...
        </div>
    `;


    chatBox.appendChild(typing);

    scrollBottom();


    // Disable composer

    if (userInput) {

        userInput.disabled = true;

    }


    if (sendBtn) {

        sendBtn.disabled = true;

    }


    try {

        let reply;


        if (
            typeof smartAIReply === "function"
        ) {

            reply =
                await smartAIReply(text);

        } else {

            reply =
                "⚠️ AI controller is not connected.";

        }


        typing.remove();


        if (reply !== null && reply !== undefined) {

            addMessage(
                "ai",
                String(reply)
            );

        }


        // Save AI response

        if (
            reply &&
            typeof saveContext === "function"
        ) {

            try {

                saveContext(
                    "ai",
                    String(reply)
                );

            } catch (error) {

                console.error(
                    "AI saveContext error:",
                    error
                );

            }

        }

    }

    catch (error) {

        console.error(
            "AI Reply Error:",
            error
        );


        typing.remove();


        addMessage(
            "ai",
            "⚠️ Sorry, something went wrong while processing your message."
        );

    }

    finally {

        if (userInput) {

            userInput.disabled = false;

            userInput.focus();

        }


        if (sendBtn) {

            sendBtn.disabled = false;

        }


        updateComposer();

    }

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

    }

    else {

        sendBtn.classList.remove("active");


        if (voiceBtn) {

            voiceBtn.style.display = "flex";

        }

    }

}


// ==========================================
// TEXTAREA AUTO EXPAND
// ==========================================

if (userInput) {

    userInput.addEventListener(
        "input",
        function () {

            this.style.height = "48px";

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

                sendMessage();

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
        sendMessage
    );

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
// CLOSE ATTACHMENT MENU
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (!attachmentMenu) return;


        if (
            !attachmentMenu.contains(event.target) &&
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

    if (!imagePicker) return;

    imagePicker.removeAttribute(
        "capture"
    );

    imagePicker.click();

}


function takePhoto() {

    if (!imagePicker) return;

    imagePicker.setAttribute(
        "capture",
        "environment"
    );

    imagePicker.click();

}


// ==========================================
// FILE PICKER
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

    const file =
        imagePicker.files &&
        imagePicker.files[0];


    if (!file) return;


    if (!file.type.startsWith("image/")) {

        addMessage(
            "ai",
            "⚠️ Please select a valid image."
        );

        imagePicker.value = "";

        return;

    }


    const reader =
        new FileReader();


    reader.onload = function (event) {

        const imageData =
            event.target.result;


        // Store attachment globally

        window.aiAttachment = {

            type: "image",

            name: file.name,

            mimeType: file.type,

            size: file.size,

            data: imageData,

            file: file,

            date: new Date().toISOString()

        };


        // Display image

        addMessage(
            "user",
            `
            <img
                src="${imageData}"
                class="chatImage"
                alt="Uploaded image"
            >
            `,
            true
        );


        // Save upload

        rememberUpload(
            file,
            "image"
        );


        addMessage(
            "ai",
            "📷 Image received. You can now ask me to read the text, describe it, or analyze it."
        );


        imagePicker.value = "";

        imagePicker.removeAttribute(
            "capture"
        );

        closeAttachmentMenu();

    };


    reader.onerror = function () {

        addMessage(
            "ai",
            "⚠️ I couldn't read that image."
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


function handleFileUpload() {

    const file =
        filePicker.files &&
        filePicker.files[0];


    if (!file) return;


    // Store attachment globally

    window.aiAttachment = {

        type: "file",

        name: file.name,

        mimeType:
            file.type ||
            "application/octet-stream",

        size: file.size,

        file: file,

        date: new Date().toISOString()

    };


    // Display file

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


    // Save upload

    rememberUpload(
        file,
        "file"
    );


    addMessage(
        "ai",
        `📄 ${file.name} received. You can now ask me to read or summarize it.`
    );


    filePicker.value = "";

    closeAttachmentMenu();

}


// ==========================================
// FILE SIZE
// ==========================================

function formatFileSize(bytes) {

    if (!bytes) return "0 Bytes";


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (
                bytes /
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(1)
        )
        +
        " " +
        units[index]
    );

}


// ==========================================
// UPLOAD MEMORY
// ==========================================

function rememberUpload(file, type) {

    if (!window.uploadedFiles) {

        window.uploadedFiles = [];

    }


    window.uploadedFiles.push({

        name: file.name,

        type: type,

        size: file.size,

        date:
            new Date()
            .toLocaleString()

    });

}


// ==========================================
// GET UPLOADED FILES
// ==========================================

function getUploadedFiles() {

    return window.uploadedFiles || [];

}


// ==========================================
// INITIALIZE
// ==========================================

updateComposer();


console.log(
    "✅ AI Life Assistant chat.js loaded successfully"
);
