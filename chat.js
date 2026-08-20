
// ==========================================
// AI LIFE ASSISTANT CHAT
// Version 7.0
// Stable Chat Controller
// ==========================================

"use strict";

console.log("💬 chat.js loading...");


// ==========================================
// DOM ELEMENTS
// ==========================================

const chatBox =
    document.getElementById("chatBox");

const userInput =
    document.getElementById("userInput");

const sendBtn =
    document.getElementById("sendBtn");

const attachBtn =
    document.getElementById("attachBtn");

const voiceBtn =
    document.getElementById("voiceBtn");

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


// ==========================================
// UPLOAD MEMORY
// ==========================================

let uploadedFiles =
    window.uploadedFiles || [];

window.uploadedFiles =
    uploadedFiles;


function rememberUpload(file, type) {

    if (!file) return;

    uploadedFiles.unshift({

        name: file.name,

        type: type,

        size: file.size,

        date: new Date()

    });

    window.uploadedFiles =
        uploadedFiles;

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

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


function escapeHTML(str) {

    return String(str)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );

    }

    return (

        (bytes / (1024 * 1024)).toFixed(1) +

        " MB"

    );

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(
    type,
    content,
    isHTML = false
) {

    if (!chatBox) return;

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;


    const textDiv =
        document.createElement("div");

    textDiv.className =
        "messageText";


    if (isHTML) {

        textDiv.innerHTML =
            content;

    } else {

        textDiv.textContent =
            content;

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

    typing.className =
        "message ai typing";

    typing.id =
        "typingIndicator";


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

    if (!userInput || !sendBtn) {

        return;

    }


    userInput.style.height =
        "auto";


    userInput.style.height =
        userInput.scrollHeight + "px";


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

let isSending = false;


async function sendMessage() {

    if (!userInput) return;


    if (isSending) {

        return;

    }


    const text =
        userInput.value.trim();


    if (!text) {

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
    // Save context
    // --------------------------------------

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
    // AI reply
    // --------------------------------------

    await aiReply(text);

}


// ==========================================
// ENTER KEY
// ==========================================

if (userInput) {

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


    userInput.addEventListener(
        "input",
        updateComposer
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

            sendMessage();

        }
    );

}


// ==========================================
// AI REPLY
// ==========================================

async function aiReply(text) {

    showTyping();


    if (userInput) {

        userInput.disabled =
            true;

    }


    if (sendBtn) {

        sendBtn.disabled =
            true;

    }


    let answer =
        null;


    try {

        if (
            typeof smartAIReply !==
            "function"
        ) {

            throw new Error(
                "smartAIReply() is not available"
            );

        }


        answer =
            await smartAIReply(text);


        hideTyping();


        if (!answer) {

            answer =
                "🤖 I didn't receive a response.";

        }


        addMessage(
            "ai",
            String(answer)
        );


        // Save AI response

        try {

            if (
                typeof saveContext ===
                "function"
            ) {

                saveContext(
                    "ai",
                    String(answer)
                );

            }

        } catch (saveError) {

            console.warn(
                "⚠️ AI context save failed:",
                saveError
            );

        }


    } catch (error) {

        console.error(
            "❌ AI reply error:",
            error
        );


        hideTyping();


        addMessage(
            "ai",
            "⚠️ Sorry, I couldn't process that message. Please try again."
        );

    } finally {

        // ==================================
        // ALWAYS UNLOCK CHAT
        // ==================================

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

    }

}


// ==========================================
// ATTACHMENT MENU
// ==========================================

function openAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.hidden =
        false;

    attachmentMenu.classList.add(
        "show"
    );

}


function closeAttachmentMenu() {

    if (!attachmentMenu) return;

    attachmentMenu.classList.remove(
        "show"
    );

    attachmentMenu.hidden =
        true;

}


if (attachBtn) {

    attachBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (attachmentMenu.hidden) {

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

    if (!cameraPicker) return;

    cameraPicker.click();

}


// Make functions available to HTML
window.pickImage =
    pickImage;

window.takePhoto =
    takePhoto;

window.pickFile =
    function () {

        if (filePicker) {

            filePicker.click();

        }

    };


// ==========================================
// PROCESS IMAGE
// ==========================================

function processImage(file) {

    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            window.aiAttachment = {

                type: "image",

                data: event.target.result,

                file: file

            };


            const safeURL =
                String(
                    event.target.result
                );


            addMessage(
                "user",
                `<img src="${safeURL}" class="chatImage" alt="Uploaded image">`,
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
                "❌ Image read error:",
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

function handleImageInput(
    input
) {

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

function aiUploadReply(
    type,
    file
) {

    let reply = "";


    if (type === "image") {

        reply =
            "📷 Nice! I received your image.\n\n" +
            "I can help you:\n" +
            "📝 Read text from the image\n" +
            "👀 Describe what I see\n" +
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

console.log(
    "✅ chat.js fully loaded"
);
