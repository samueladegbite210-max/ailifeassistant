"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   chat.js
   Version 14.0

   RESPONSIBILITIES:
   - Send messages
   - Receive AI responses
   - Attachment menu
   - Photo upload
   - Camera upload
   - File upload
   - Attachment preview
   - Show attachment in chat
   - Prevent duplicate attachment messages
   - Remove attachment
========================================== */

console.log("🚀 chat.js loading...");


/* =====================================================
   ELEMENTS
===================================================== */

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

const voiceBtn =
    document.getElementById("voiceBtn");

const attachmentPreview =
    document.getElementById("attachmentPreview");

const attachmentPreviewContent =
    document.getElementById(
        "attachmentPreviewContent"
    );

const removeAttachmentBtn =
    document.getElementById(
        "removeAttachmentBtn"
    );


/* =====================================================
   STARTUP CHECK
===================================================== */

console.log("chatBox:", !!chatBox);
console.log("userInput:", !!userInput);
console.log("sendBtn:", !!sendBtn);
console.log("attachBtn:", !!attachBtn);
console.log(
    "smartAIReply:",
    typeof window.smartAIReply
);


/* =====================================================
   ATTACHMENT STATE
===================================================== */

window.aiAttachment =
    window.aiAttachment || null;

window.uploadedFiles =
    window.uploadedFiles || [];


/* =====================================================
   SHOW ATTACHMENT PREVIEW
===================================================== */

function showAttachmentPreview(
    file,
    type
) {

    if (
        !attachmentPreview ||
        !attachmentPreviewContent ||
        !file
    ) {
        return;
    }


    attachmentPreviewContent.innerHTML =
        "";


    /* ======================================
       IMAGE PREVIEW
    ====================================== */

    if (type === "image") {

        const image =
            document.createElement("img");

        image.src =
            URL.createObjectURL(file);

        image.alt =
            file.name || "Attached image";

        attachmentPreviewContent.appendChild(
            image
        );

    }


    /* ======================================
       TEXT
    ====================================== */

    const textBox =
        document.createElement("div");

    textBox.className =
        "attachmentPreviewText";


    const name =
        document.createElement("div");

    name.className =
        "attachmentPreviewName";

    name.textContent =
        type === "image"
            ? "🖼️ " + file.name
            : "📄 " + file.name;


    const fileType =
        document.createElement("div");

    fileType.className =
        "attachmentPreviewType";

    fileType.textContent =
        file.type ||
        "Unknown file";


    textBox.appendChild(name);

    textBox.appendChild(fileType);

    attachmentPreviewContent.appendChild(
        textBox
    );


    attachmentPreview.classList.add("show");

}


/* =====================================================
   REMOVE ATTACHMENT
===================================================== */

function removeCurrentAttachment() {

    window.aiAttachment =
        null;


    if (attachmentPreview) {

        attachmentPreview.classList.remove(
            "show"
        );

    }


    if (attachmentPreviewContent) {

        attachmentPreviewContent.innerHTML =
            "";

    }


    if (imagePicker) {
        imagePicker.value = "";
    }


    if (cameraPicker) {
        cameraPicker.value = "";
    }


    if (filePicker) {
        filePicker.value = "";
    }


    console.log(
        "🗑️ Attachment removed"
    );

}


/* =====================================================
   REMOVE BUTTON
===================================================== */

if (removeAttachmentBtn) {

    removeAttachmentBtn.addEventListener(
        "click",
        function () {

            removeCurrentAttachment();

        }
    );

}


/* =====================================================
   ADD NORMAL MESSAGE
===================================================== */

function addLocalMessage(
    sender,
    text
) {

    if (!chatBox) {

        console.error(
            "❌ chatBox not found"
        );

        return null;

    }


    const message =
        document.createElement("div");


    message.className =
        "message " +
        (
            sender === "user"
                ? "user"
                : "ai"
        );


    const messageText =
        document.createElement("div");

    messageText.className =
        "messageText";


    messageText.textContent =
        String(text || "");


    const messageTime =
        document.createElement("div");

    messageTime.className =
        "messageTime";


    messageTime.textContent =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    message.appendChild(
        messageText
    );

    message.appendChild(
        messageTime
    );

    chatBox.appendChild(
        message
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return message;

}


/* =====================================================
   ADD ATTACHMENT MESSAGE
===================================================== */

function addAttachmentMessage(
    sender,
    file,
    type
) {

    if (
        !chatBox ||
        !file
    ) {

        return null;

    }


    const message =
        document.createElement("div");


    message.className =
        "message " +
        (
            sender === "user"
                ? "user"
                : "ai"
        );


    const messageText =
        document.createElement("div");

    messageText.className =
        "messageText";


    /* ======================================
       IMAGE
    ====================================== */

    if (type === "image") {

        const image =
            document.createElement("img");

        image.className =
            "chatAttachmentImage";


        image.src =
            URL.createObjectURL(file);


        image.alt =
            file.name || "Attached image";


        image.onload =
            function () {

                chatBox.scrollTop =
                    chatBox.scrollHeight;

            };


        messageText.appendChild(image);


        const fileName =
            document.createElement("div");

        fileName.className =
            "chatAttachmentName";

        fileName.textContent =
            "🖼️ " + file.name;


        messageText.appendChild(
            fileName
        );

    }


    /* ======================================
       FILE
    ====================================== */

    else {

        const fileBox =
            document.createElement("div");

        fileBox.className =
            "chatFileAttachment";


        const icon =
            document.createElement("div");

        icon.className =
            "chatFileIcon";

        icon.textContent =
            "📄";


        const fileInfo =
            document.createElement("div");

        fileInfo.className =
            "chatFileInfo";


        const fileName =
            document.createElement("div");

        fileName.className =
            "chatAttachmentName";

        fileName.textContent =
            file.name;


        const fileType =
            document.createElement("div");

        fileType.className =
            "chatAttachmentType";

        fileType.textContent =
            file.type ||
            "File";


        fileInfo.appendChild(
            fileName
        );

        fileInfo.appendChild(
            fileType
        );

        fileBox.appendChild(
            icon
        );

        fileBox.appendChild(
            fileInfo
        );

        messageText.appendChild(
            fileBox
        );

    }


    /* ======================================
       TIME
    ====================================== */

    const messageTime =
        document.createElement("div");

    messageTime.className =
        "messageTime";

    messageTime.textContent =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    message.appendChild(
        messageText
    );

    message.appendChild(
        messageTime
    );

    chatBox.appendChild(
        message
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return message;

}


/* =====================================================
   ATTACHMENT MENU
===================================================== */

function closeAttachmentMenu() {

    if (!attachmentMenu) {
        return;
    }


    attachmentMenu.classList.remove(
        "show"
    );

    attachmentMenu.style.display =
        "none";

}


if (attachBtn) {

    attachBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (!attachmentMenu) {
                return;
            }


            const isOpen =
                attachmentMenu.classList.contains(
                    "show"
                );


            if (isOpen) {

                closeAttachmentMenu();

            } else {

                attachmentMenu.classList.add(
                    "show"
                );

                attachmentMenu.style.display =
                    "block";

            }

        }
    );

}


/* =====================================================
   PHOTO BUTTON
===================================================== */

if (pickImageBtn) {

    pickImageBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            closeAttachmentMenu();


            if (imagePicker) {

                imagePicker.value = "";

                imagePicker.click();

            }

        }
    );

}


/* =====================================================
   CAMERA BUTTON
===================================================== */

if (takePhotoBtn) {

    takePhotoBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            closeAttachmentMenu();


            if (cameraPicker) {

                cameraPicker.value = "";

                cameraPicker.click();

            }

        }
    );

}


/* =====================================================
   FILE BUTTON
===================================================== */

if (pickFileBtn) {

    pickFileBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            closeAttachmentMenu();


            if (filePicker) {

                filePicker.value = "";

                filePicker.click();

            }

        }
    );

}


/* =====================================================
   SAVE IMAGE ATTACHMENT
===================================================== */

function saveImageAttachment(file) {

    if (!file) {
        return;
    }


    console.log(
        "🖼️ Image selected:",
        file.name
    );


    window.aiAttachment = {

        type: "image",

        name: file.name,

        mimeType: file.type,

        size: file.size,

        file: file,

        data: file

    };


    window.uploadedFiles.push({

        name: file.name,

        type:
            file.type ||
            "image",

        size: file.size,

        uploadedAt:
            new Date().toISOString()

    });


    /*
       SHOW PREVIEW
    */

    showAttachmentPreview(
        file,
        "image"
    );


    /*
       SHOW IMAGE IN CHAT

       IMPORTANT:
       Only called ONCE.

       This fixes the duplicate
       image problem.
    */

    const attachmentMessage =
        addAttachmentMessage(
            "user",
            file,
            "image"
        );


    console.log(
        "🖼️ Image attachment added:",
        attachmentMessage
    );

}


/* =====================================================
   SAVE FILE ATTACHMENT
===================================================== */

function saveFileAttachment(file) {

    if (!file) {
        return;
    }


    console.log(
        "📄 File selected:",
        file.name
    );


    window.aiAttachment = {

        type: "file",

        name: file.name,

        mimeType: file.type,

        size: file.size,

        file: file

    };


    window.uploadedFiles.push({

        name: file.name,

        type:
            file.type ||
            "application/octet-stream",

        size: file.size,

        uploadedAt:
            new Date().toISOString()

    });


    /*
       SHOW PREVIEW
    */

    showAttachmentPreview(
        file,
        "file"
    );


    /*
       SHOW FILE IN CHAT
    */

    const attachmentMessage =
        addAttachmentMessage(
            "user",
            file,
            "file"
        );


    console.log(
        "📄 File attachment added:",
        attachmentMessage
    );

}


/* =====================================================
   IMAGE PICKER
===================================================== */

if (imagePicker) {

    imagePicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            saveImageAttachment(file);

        }
    );

}


/* =====================================================
   CAMERA PICKER
===================================================== */

if (cameraPicker) {

    cameraPicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            saveImageAttachment(file);

        }
    );

}


/* =====================================================
   FILE PICKER
===================================================== */

if (filePicker) {

    filePicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            saveFileAttachment(file);

        }
    );

}


/* =====================================================
   SEND MESSAGE
===================================================== */

async function sendMessage() {

    console.log(
        "🔥 Sending message..."
    );


    if (!userInput) {

        console.error(
            "❌ userInput not found"
        );

        return;

    }


    let message =
        userInput.value.trim();


    const attachment =
        window.aiAttachment;


    /* ======================================
       ATTACHMENT WITHOUT TEXT
    ====================================== */

    if (
        !message &&
        attachment
    ) {

        if (
            attachment.type === "image"
        ) {

            message =
                "describe the image";

        } else {

            message =
                "summarize the file";

        }

    }


    /* ======================================
       NOTHING TO SEND
    ====================================== */

    if (!message) {

        userInput.focus();

        return;

    }


    /* ======================================
       SHOW USER MESSAGE
    ====================================== */

    addLocalMessage(
        "user",
        message
    );


    userInput.value = "";

    userInput.style.height =
        "auto";


    /* ======================================
       THINKING MESSAGE
    ====================================== */

    const thinking =
        addLocalMessage(
            "ai",
            "🧠 Thinking..."
        );


    try {

        /* ==================================
           SMART AI
        ================================== */

        if (
            typeof window.smartAIReply ===
            "function"
        ) {

            console.log(
                "🧠 Sending to smartAIReply:",
                message
            );


            const response =
                await window.smartAIReply(
                    message
                );


            if (thinking) {
                thinking.remove();
            }


            addLocalMessage(
                "ai",
                response ||
                "🤖 I don't have an answer yet."
            );


            /*
               Remove attachment only
               AFTER AI responds.
            */

            removeCurrentAttachment();

        }

        else {

            if (thinking) {
                thinking.remove();
            }


            addLocalMessage(
                "ai",
                "⚠️ smartAI.js is not loaded."
            );

        }

    }

    catch (error) {

        console.error(
            "❌ SEND ERROR:",
            error
        );


        if (thinking) {
            thinking.remove();
        }


        addLocalMessage(
            "ai",
            "⚠️ Something went wrong while processing your message."
        );

    }

}


/* =====================================================
   GLOBAL SEND ACCESS
===================================================== */

window.sendMessage =
    sendMessage;


/* =====================================================
   SEND BUTTON
===================================================== */

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            sendMessage();

        }
    );


    console.log(
        "✅ Send button connected"
    );

} else {

    console.error(
        "❌ sendBtn NOT FOUND"
    );

}


/* =====================================================
   ENTER KEY
===================================================== */

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

}


/* =====================================================
   AUTO RESIZE
===================================================== */

if (userInput) {

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


/* =====================================================
   CLOSE MENU OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            attachmentMenu &&
            attachBtn &&
            !attachmentMenu.contains(
                event.target
            ) &&
            !attachBtn.contains(
                event.target
            )
        ) {

            closeAttachmentMenu();

        }

    }
);


/* =====================================================
   WELCOME NAME
===================================================== */

const savedName =
    localStorage.getItem(
        "profileName"
    );


const welcomeName =
    document.getElementById(
        "welcomeName"
    );


if (
    welcomeName &&
    savedName
) {

    welcomeName.textContent =
        savedName;

}


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.addLocalMessage =
    addLocalMessage;

window.addAttachmentMessage =
    addAttachmentMessage;

window.showAttachmentPreview =
    showAttachmentPreview;

window.removeCurrentAttachment =
    removeCurrentAttachment;

window.saveImageAttachment =
    saveImageAttachment;

window.saveFileAttachment =
    saveFileAttachment;


/* =====================================================
   READY
===================================================== */

console.log(
    "========================================"
);

console.log(
    "🚀 chat.js READY"
);

console.log(
    "smartAIReply:",
    typeof window.smartAIReply
);

console.log(
    "Send button:",
    !!sendBtn
);

console.log(
    "Attach button:",
    !!attachBtn
);

console.log(
    "Image picker:",
    !!imagePicker
);

console.log(
    "Camera picker:",
    !!cameraPicker
);

console.log(
    "File picker:",
    !!filePicker
);

console.log(
    "========================================"
);
