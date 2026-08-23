"use strict";

// ==========================================
// AI LIFE ASSISTANT
// chat.js
// Version 9.0
// Chat + Attachment Controller
// ==========================================

console.log("🚀 chat.js loading...");


// ==========================================
// ELEMENTS
// ==========================================

const chatBox =
    document.getElementById("chatBox");

const userInput =
    document.getElementById("userInput");

const sendBtn =
    document.getElementById("sendBtn");

const attachBtn =
    document.getElementById("attachBtn");

const attachmentMenu =
    document.getElementById("attachmentMenu");

const pickImageBtn =
    document.getElementById("pickImageBtn");

const takePhotoBtn =
    document.getElementById("takePhotoBtn");

const pickFileBtn =
    document.getElementById("pickFileBtn");

const imagePicker =
    document.getElementById("imagePicker");

const cameraPicker =
    document.getElementById("cameraPicker");

const filePicker =
    document.getElementById("filePicker");


// ==========================================
// ATTACHMENT STATE
// ==========================================

let currentAttachment = null;


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(type, text) {

    if (!chatBox) {

        console.error(
            "❌ chatBox not found"
        );

        return null;

    }


    const message =
        document.createElement("div");


    message.className =
        "message " + type;


    message.innerHTML = `
        <div class="messageText">
            ${escapeHTML(text)}
        </div>

        <div class="messageTime">
            ${new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}
        </div>
    `;


    chatBox.appendChild(message);


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return message;

}


// ==========================================
// SHOW / HIDE ATTACHMENT MENU
// ==========================================

function toggleAttachmentMenu() {

    if (!attachmentMenu) {
        return;
    }


    attachmentMenu.classList.toggle(
        "show"
    );

}


// ==========================================
// CLOSE ATTACHMENT MENU
// ==========================================

function closeAttachmentMenu() {

    if (!attachmentMenu) {
        return;
    }


    attachmentMenu.classList.remove(
        "show"
    );

}


// ==========================================
// SAVE IMAGE ATTACHMENT
// ==========================================

function setImageAttachment(file) {

    if (!file) {
        return;
    }


    currentAttachment = {

        type: "image",

        name: file.name,

        mimeType: file.type,

        size: file.size,

        file: file,

        data: file

    };


    window.aiAttachment =
        currentAttachment;


    console.log(
        "🖼️ Image attachment saved:",
        currentAttachment
    );


    addMessage(
        "user",
        "🖼️ Attached image: " +
        file.name
    );


    closeAttachmentMenu();

}


// ==========================================
// SAVE FILE ATTACHMENT
// ==========================================

function setFileAttachment(file) {

    if (!file) {
        return;
    }


    currentAttachment = {

        type: "file",

        name: file.name,

        mimeType: file.type,

        size: file.size,

        file: file

    };


    window.aiAttachment =
        currentAttachment;


    console.log(
        "📄 File attachment saved:",
        currentAttachment
    );


    addMessage(
        "user",
        "📎 Attached file: " +
        file.name
    );


    closeAttachmentMenu();

}


// ==========================================
// IMAGE PICKER
// ==========================================

if (imagePicker) {

    imagePicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (file) {

                setImageAttachment(file);

            }


            this.value = "";

        }
    );

}


// ==========================================
// CAMERA PICKER
// ==========================================

if (cameraPicker) {

    cameraPicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (file) {

                setImageAttachment(file);

            }


            this.value = "";

        }
    );

}


// ==========================================
// FILE PICKER
// ==========================================

if (filePicker) {

    filePicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (file) {

                setFileAttachment(file);

            }


            this.value = "";

        }
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
// PICK IMAGE BUTTON
// ==========================================

if (pickImageBtn) {

    pickImageBtn.addEventListener(
        "click",
        function () {

            closeAttachmentMenu();

            if (imagePicker) {

                imagePicker.click();

            }

        }
    );

}


// ==========================================
// TAKE PHOTO BUTTON
// ==========================================

if (takePhotoBtn) {

    takePhotoBtn.addEventListener(
        "click",
        function () {

            closeAttachmentMenu();

            if (cameraPicker) {

                cameraPicker.click();

            }

        }
    );

}


// ==========================================
// PICK FILE BUTTON
// ==========================================

if (pickFileBtn) {

    pickFileBtn.addEventListener(
        "click",
        function () {

            closeAttachmentMenu();

            if (filePicker) {

                filePicker.click();

            }

        }
    );

}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    console.log(
        "📨 SEND BUTTON PRESSED"
    );


    if (!userInput) {

        console.error(
            "❌ userInput not found"
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


    // ======================================
    // SHOW USER MESSAGE
    // ======================================

    addMessage(
        "user",
        text
    );


    // ======================================
    // CLEAR INPUT
    // ======================================

    userInput.value = "";

    userInput.style.height =
        "auto";


    // ======================================
    // THINKING MESSAGE
    // ======================================

    const thinking =
        addMessage(
            "ai",
            "🧠 Thinking..."
        );


    try {

        // ==================================
        // CHECK SMART AI
        // ==================================

        if (
            typeof window.smartAIReply !==
            "function"
        ) {

            throw new Error(
                "smartAIReply is not loaded."
            );

        }


        console.log(
            "🧠 Sending to smartAIReply..."
        );


        const response =
            await window.smartAIReply(
                text
            );


        // ==================================
        // REMOVE THINKING
        // ==================================

        if (thinking) {

            thinking.remove();

        }


        // ==================================
        // AI RESPONSE
        // ==================================

        addMessage(
            "ai",
            response ||
            "🤖 I don't have an answer yet."
        );


    }

    catch (error) {

        console.error(
            "❌ AI SEND ERROR:",
            error
        );


        if (thinking) {

            thinking.remove();

        }


        addMessage(
            "ai",
            "⚠️ Something went wrong while processing your message."
        );

    }

}


// ==========================================
// SEND BUTTON
// ==========================================

if (sendBtn) {

    console.log(
        "✅ sendBtn found"
    );


    sendBtn.addEventListener(
        "click",
        sendMessage
    );


} else {

    console.error(
        "❌ sendBtn NOT FOUND"
    );

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

                sendMessage(event);

            }

        }
    );


    // ======================================
    // AUTO RESIZE
    // ======================================

    userInput.addEventListener(
        "input",
        function () {

            this.style.height =
                "auto";


            this.style.height =
                Math.min(
                    this.scrollHeight,
                    140
                ) + "px";

        }
    );

}


// ==========================================
// GLOBAL EXPORTS
// ==========================================

window.sendMessage =
    sendMessage;

window.addMessage =
    addMessage;

window.getCurrentChatAttachment =
    function () {

        return (
            window.aiAttachment ||
            null
        );

    };


// ==========================================
// STARTUP DIAGNOSTICS
// ==========================================

console.log(
    "================================="
);

console.log(
    "✅ chat.js Version 9.0 loaded"
);

console.log(
    "sendBtn:",
    sendBtn
);

console.log(
    "userInput:",
    userInput
);

console.log(
    "chatBox:",
    chatBox
);

console.log(
    "attachBtn:",
    attachBtn
);

console.log(
    "imagePicker:",
    imagePicker
);

console.log(
    "cameraPicker:",
    cameraPicker
);

console.log(
    "filePicker:",
    filePicker
);

console.log(
    "smartAIReply:",
    typeof window.smartAIReply
);

console.log(
    "readImageText:",
    typeof window.readImageText
);

console.log(
    "analyzeImage:",
    typeof window.analyzeImage
);

console.log(
    "analyzeFile:",
    typeof window.analyzeFile
);

console.log(
    "================================="
);
