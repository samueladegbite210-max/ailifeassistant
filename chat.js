// ==========================================
// AI LIFE ASSISTANT
// chat.js
// Version 8.0
// Stable Chat Controller
// ==========================================

"use strict";

console.log("💬 chat.js loading...");

// ==========================================
// DOM ELEMENTS
// ==========================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const attachBtn = document.getElementById("attachBtn");
const voiceBtn = document.getElementById("voiceBtn");

const attachmentMenu =
    document.getElementById("attachmentMenu");

const imagePicker =
    document.getElementById("imagePicker");

const cameraPicker =
    document.getElementById("cameraPicker");

const filePicker =
    document.getElementById("filePicker");

const pickImageBtn =
    document.getElementById("pickImageBtn");

const takePhotoBtn =
    document.getElementById("takePhotoBtn");

const pickFileBtn =
    document.getElementById("pickFileBtn");

console.log("💬 Elements:", {
    chatBox: !!chatBox,
    userInput: !!userInput,
    sendBtn: !!sendBtn,
    attachBtn: !!attachBtn,
    voiceBtn: !!voiceBtn,
    attachmentMenu: !!attachmentMenu,
    imagePicker: !!imagePicker,
    cameraPicker: !!cameraPicker,
    filePicker: !!filePicker
});

// ==========================================
// UPLOAD MEMORY
// ==========================================

const uploadedFiles =
    window.uploadedFiles || [];

window.uploadedFiles = uploadedFiles;

function rememberUpload(file, type) {

    if (!file) return;

    uploadedFiles.unshift({
        name: file.name,
        type: type,
        size: file.size,
        date: new Date().toISOString()
    });

    window.uploadedFiles = uploadedFiles;

    console.log("📎 Upload remembered:", file.name);
}

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

    requestAnimationFrame(() => {
        chatBox.scrollTop =
            chatBox.scrollHeight;
    });

}

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

function formatFileSize(bytes) {

    bytes = Number(bytes) || 0;

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }

    return (
        (bytes / (1024 * 1024)).toFixed(1) +
        " MB"
    );

}

// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(type, content, isHTML = false) {

    if (!chatBox) {
        console.error("❌ chatBox not found");
        return;
    }

    const message =
        document.createElement("div");

    message.className =
        "message " + type;

    const textDiv =
        document.createElement("div");

    textDiv.className =
        "messageText";

    if (isHTML) {
        textDiv.innerHTML = content;
    } else {
        textDiv.textContent =
            String(content || "");
    }

    const timeDiv =
        document.createElement("div");

    timeDiv.className =
        "messageTime";

    timeDiv.textContent =
        getCurrentTime();

    message.appendChild(textDiv);
    message.appendChild(timeDiv);

    chatBox.appendChild(message);

    scrollBottom();

}

// ==========================================
// TYPING INDICATOR
// ==========================================

function showTyping() {

    if (!chatBox) return;

    hideTyping();

    const typing =
        document.createElement("div");

    typing.id =
        "typingIndicator";

    typing.className =
        "message ai typing";

    typing.innerHTML = `
        <div class="typingBubble">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chatBox.appendChild(typing);

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

    if (!userInput || !sendBtn) return;

    userInput.style.height = "auto";

    userInput.style.height =
        Math.min(
            userInput.scrollHeight,
            140
        ) + "px";

    const hasText =
        userInput.value.trim().length > 0;

    sendBtn.classList.toggle(
        "active",
        hasText
    );

    sendBtn.disabled = false;

    if (voiceBtn) {

        voiceBtn.style.display =
            hasText ? "none" : "flex";

    }

}

// ==========================================
// SEND MESSAGE
// ==========================================

let isSending = false;

async function sendMessage() {

    console.log("🚀 sendMessage() called");

    if (!userInput) {
        console.error(
            "❌ userInput element not found"
        );
        return;
    }

    if (isSending) {
        console.log(
            "⏳ Already processing a message"
        );
        return;
    }

    const text =
        userInput.value.trim();

    console.log(
        "📝 Message:",
        text
    );

    if (!text) {
        console.log(
            "⚠️ Empty message"
        );
        return;
    }

    isSending = true;

    // ======================================
    // SHOW USER MESSAGE
    // ======================================

    addMessage(
        "user",
        text
    );

    // ======================================
    // SAVE USER CONTEXT
    // ======================================

    try {

        if (
            typeof saveContext ===
            "function"
        ) {

            saveContext(
                "user",
                text
            );

        }

    } catch (error) {

        console.warn(
            "⚠️ saveContext error:",
            error
        );

    }

    // ======================================
    // CLEAR INPUT
    // ======================================

    userInput.value = "";

    updateComposer();

    // ======================================
    // GET AI RESPONSE
    // ======================================

    await aiReply(text);

}

// ==========================================
// AI REPLY
// ==========================================

async function aiReply(text) {

    console.log(
        "🤖 aiReply() started:",
        text
    );

    showTyping();

    if (userInput) {
        userInput.disabled = true;
    }

    if (sendBtn) {
        sendBtn.disabled = true;
    }

    try {

        // ==================================
        // CHECK SMART AI
        // ==================================

        if (
            typeof smartAIReply !==
            "function"
        ) {

            throw new Error(
                "smartAIReply() is not available"
            );

        }

        console.log(
            "🧠 Calling smartAIReply()..."
        );

        const answer =
            await smartAIReply(text);

        console.log(
            "🧠 AI response:",
            answer
        );

        hideTyping();

        addMessage(
            "ai",
            answer ||
            "🤖 I couldn't generate a response."
        );

        // ==================================
        // SAVE AI RESPONSE
        // ==================================

        try {

            if (
                typeof saveContext ===
                "function"
            ) {

                saveContext(
                    "ai",
                    String(
                        answer ||
                        ""
                    )
                );

            }

        } catch (error) {

            console.warn(
                "⚠️ AI context error:",
                error
            );

        }

    } catch (error) {

        console.error(
            "❌ AI ERROR:",
            error
        );

        hideTyping();

        addMessage(
            "ai",
            "⚠️ Something went wrong while processing your message."
        );

    } finally {

        isSending = false;

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
            "✅ AI request finished"
        );

    }

}

// ==========================================
// ENTER KEY
// ==========================================

if (userInput) {

    userInput.addEventListener(
        "input",
        updateComposer
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
        function (event) {

            event.preventDefault();

            console.log(
                "🖱️ SEND BUTTON CLICKED"
            );

            sendMessage();

        }
    );

} else {

    console.error(
        "❌ sendBtn was NOT found"
    );

}

// ==========================================
// ATTACHMENT MENU
// ==========================================

function openAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.hidden = false;

    attachmentMenu.classList.add(
        "show"
    );

}

function closeAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.remove(
        "show"
    );

    attachmentMenu.hidden = true;

}

if (attachBtn) {

    attachBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (
                attachmentMenu &&
                attachmentMenu.hidden
            ) {

                openAttachmentMenu();

            } else {

                closeAttachmentMenu();

            }

        }
    );

}

document.addEventListener(
    "click",
    function (event) {

        if (
            attachmentMenu &&
            attachBtn &&
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
// IMAGE
// ==========================================

function pickImage() {

    if (!imagePicker) return;

    imagePicker.removeAttribute(
        "capture"
    );

    imagePicker.click();

}

function takePhoto() {

    if (!cameraPicker) return;

    cameraPicker.click();

}

function pickFile() {

    if (!filePicker) return;

    filePicker.click();

}

window.pickImage = pickImage;
window.takePhoto = takePhoto;
window.pickFile = pickFile;

// ==========================================
// ATTACHMENT BUTTONS
// ==========================================

if (pickImageBtn) {

    pickImageBtn.addEventListener(
        "click",
        function () {

            pickImage();

            closeAttachmentMenu();

        }
    );

}

if (takePhotoBtn) {

    takePhotoBtn.addEventListener(
        "click",
        function () {

            takePhoto();

            closeAttachmentMenu();

        }
    );

}

if (pickFileBtn) {

    pickFileBtn.addEventListener(
        "click",
        function () {

            pickFile();

            closeAttachmentMenu();

        }
    );

}

// ==========================================
// PROCESS IMAGE
// ==========================================

function processImage(file) {

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function (event) {

            const imageData =
                event.target.result;

            window.aiAttachment = {

                type: "image",

                data: imageData,

                file: file

            };

            addMessage(
                "user",
                `<img src="${imageData}" class="chatImage" alt="Uploaded image">`,
                true
            );

            rememberUpload(
                file,
                "image"
            );

            aiUploadReply(
                "image",
                file
            );

        };

    reader.onerror =
        function (error) {

            console.error(
                "❌ Image error:",
                error
            );

            addMessage(
                "ai",
                "⚠️ I couldn't open that image."
            );

        };

    reader.readAsDataURL(file);

}

// ==========================================
// IMAGE INPUT
// ==========================================

function handleImageInput(input) {

    if (!input) return;

    const file =
        input.files &&
        input.files[0];

    if (!file) return;

    processImage(file);

    input.value = "";

    closeAttachmentMenu();

}

if (imagePicker) {

    imagePicker.addEventListener(
        "change",
        function () {

            handleImageInput(
                imagePicker
            );

        }
    );

}

if (cameraPicker) {

    cameraPicker.addEventListener(
        "change",
        function () {

            handleImageInput(
                cameraPicker
            );

        }
    );

}

// ==========================================
// FILE UPLOAD
// ==========================================

if (filePicker) {

    filePicker.addEventListener(
        "change",
        function () {

            const file =
                filePicker.files &&
                filePicker.files[0];

            if (!file) return;

            window.aiAttachment = {

                type: "file",

                file: file

            };

            const html = `
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
            `;

            addMessage(
                "user",
                html,
                true
            );

            rememberUpload(
                file,
                "file"
            );

            aiUploadReply(
                "file",
                file
            );

            filePicker.value = "";

            closeAttachmentMenu();

        }
    );

}

// ==========================================
// UPLOAD RESPONSE
// ==========================================

function aiUploadReply(type, file) {

    let reply = "";

    if (type === "image") {

        reply =
            "📷 Nice! I received your image.\n\n" +
            "I can help you:\n" +
            "📝 Read the text from the image\n" +
            "👀 Describe the image\n" +
            "🔍 Analyze the image\n" +
            "❓ Answer questions about it.";

    }

    if (type === "file") {

        reply =
            `📄 I received: ${file.name}\n\n` +
            "I can help you:\n" +
            "📑 Summarize it\n" +
            "🧠 Explain it\n" +
            "🔍 Find important information\n" +
            "❓ Answer questions about it.";

    }

    setTimeout(
        function () {

            addMessage(
                "ai",
                reply
            );

        },
        500
    );

}

// ==========================================
// VOICE
// ==========================================

if (voiceBtn) {

    voiceBtn.addEventListener(
        "click",
        function () {

            addMessage(
                "ai",
                "🎤 Voice input is coming soon!"
            );

        }
    );

}

// ==========================================
// INITIALIZE
// ==========================================

updateComposer();

window.sendMessage = sendMessage;
window.aiReply = aiReply;

console.log("✅ chat.js fully loaded");
console.log("📤 sendMessage available:", typeof window.sendMessage);
console.log("🤖 aiReply available:", typeof window.aiReply);
