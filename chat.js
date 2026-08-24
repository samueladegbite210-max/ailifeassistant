"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   chat.js
   Version 15.0
   Main Chat + Attachment Controller
========================================== */

console.log("🚀 chat.js v15 loading...");


function startChat() {

    console.log("🚀 Starting chat controller...");


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


    /* ======================================
       CHECK REQUIRED ELEMENTS
    ====================================== */

    if (
        !chatBox ||
        !userInput ||
        !sendBtn
    ) {

        console.error(
            "❌ Required chat elements missing"
        );

        console.log(
            "chatBox:",
            chatBox
        );

        console.log(
            "userInput:",
            userInput
        );

        console.log(
            "sendBtn:",
            sendBtn
        );

        return;

    }


    console.log(
        "✅ Chat elements found"
    );

const attachmentPreview =
    document.getElementById(
        "attachmentPreview"
    );

const attachmentPreviewContent =
    document.getElementById(
        "attachmentPreviewContent"
    );

const removeAttachmentBtn =
    document.getElementById(
        "removeAttachmentBtn"
    );
   /* ==========================================
   SHOW ATTACHMENT PREVIEW
========================================== */

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


    /*
    ------------------------------------------
    IMAGE PREVIEW
    ------------------------------------------
    */

    if (type === "image") {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            URL.createObjectURL(
                file
            );


        image.alt =
            file.name;


        attachmentPreviewContent.appendChild(
            image
        );

    }


    /*
    ------------------------------------------
    TEXT
    ------------------------------------------
    */

    const textBox =
        document.createElement(
            "div"
        );


    textBox.className =
        "attachmentPreviewText";


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "attachmentPreviewName";


    name.textContent =
        type === "image"
            ? "🖼️ " + file.name
            : "📄 " + file.name;


    const fileType =
        document.createElement(
            "div"
        );


    fileType.className =
        "attachmentPreviewType";


    fileType.textContent =
        file.type ||
        "Unknown file";


    textBox.appendChild(
        name
    );


    textBox.appendChild(
        fileType
    );


    attachmentPreviewContent.appendChild(
        textBox
    );


    attachmentPreview.classList.add(
        "show"
    );

}
   /* ==========================================
   REMOVE ATTACHMENT
========================================== */

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

        imagePicker.value =
            "";

    }


    if (cameraPicker) {

        cameraPicker.value =
            "";

    }


    if (filePicker) {

        filePicker.value =
            "";

    }


    console.log(
        "🗑️ Attachment removed"
    );

}
   if (removeAttachmentBtn) {

    removeAttachmentBtn.addEventListener(
        "click",
        function () {

            removeCurrentAttachment();

        }
    );

}
   
    /* ======================================
       ATTACHMENT STORAGE
    ====================================== */

    window.aiAttachment =
        window.aiAttachment || null;

    window.uploadedFiles =
        window.uploadedFiles || [];


    /* ======================================
       ADD MESSAGE
    ====================================== */

    function addMessage(
        sender,
        text
    ) {

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


    window.addMessage =
        addMessage;


    /* ======================================
       SEND MESSAGE
    ====================================== */

    async function sendMessage(
        event
    ) {

        if (event) {

            event.preventDefault();

        }


        console.log(
            "🔥 SEND BUTTON CLICKED"
        );


        let message =
            userInput.value.trim();


        const attachment =
            window.aiAttachment;


        /*
           Attachment only
        */

        if (
            !message &&
            attachment
        ) {

            if (
                attachment.type ===
                "image"
            ) {

                message =
                    "describe the image";

            } else {

                message =
                    "summarize the file";

            }

        }


        if (!message) {

            userInput.focus();

            return;

        }


        addMessage(
            "user",
            message
        );


        userInput.value = "";

        userInput.style.height =
            "auto";


        const thinking =
            addMessage(
                "ai",
                "🧠 Thinking..."
            );


        try {

            let response;


            if (
                typeof window.smartAIReply ===
                "function"
            ) {

                response =
                    await window.smartAIReply(
                        message
                    );

            } else {

                response =
                    "⚠️ smartAI.js is not loaded.";

            }


            if (thinking) {

                thinking.remove();

            }


            addMessage(
                "ai",
                response ||
                "🤖 I don't have an answer yet."
            );

        }
removeCurrentAttachment();
        catch (error) {

            console.error(
                "❌ SEND ERROR:",
                error
            );


            if (thinking) {

                thinking.remove();

            }


            addMessage(
                "ai",
                "⚠️ Something went wrong."
            );

        }

    }


    window.sendMessage =
        sendMessage;


    /* ======================================
       SEND BUTTON
    ====================================== */

    /*
       Use onclick so only ONE
       send controller exists.
    */

    sendBtn.onclick =
        sendMessage;


    console.log(
        "✅ Send button connected"
    );


    /* ======================================
       ENTER KEY
    ====================================== */

    userInput.onkeydown =
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage(
                    event
                );

            }

        };


    /* ======================================
       AUTO RESIZE
    ====================================== */

    userInput.oninput =
        function () {

            this.style.height =
                "auto";


            this.style.height =
                Math.min(
                    this.scrollHeight,
                    140
                ) + "px";

        };


    /* ======================================
       ATTACHMENT MENU
    ====================================== */

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


    function openAttachmentMenu() {

        if (!attachmentMenu) {
            return;
        }


        attachmentMenu.classList.add(
            "show"
        );


        attachmentMenu.style.display =
            "block";

    }


    if (attachBtn) {

        attachBtn.onclick =
            function (event) {

                event.preventDefault();


                if (
                    attachmentMenu &&
                    attachmentMenu.classList.contains(
                        "show"
                    )
                ) {

                    closeAttachmentMenu();

                } else {

                    openAttachmentMenu();

                }

            };

    }


    /* ======================================
       SAVE IMAGE
    ====================================== */

    function saveImageAttachment(
        file
    ) {

        if (!file) {
            return;
        }


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
       showAttachmentPreview(
    file,
    "image"
);

        addMessage(
            "ai",
            "🖼️ Image attached: " +
            file.name +
            "\n\nAsk me to read the text or describe the image."
        );


        console.log(
            "✅ Image attached:",
            file.name
        );

    }


    /* ======================================
       SAVE FILE
    ====================================== */

    function saveFileAttachment(
        file
    ) {

        if (!file) {
            return;
        }


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

        showAttachmentPreview(
    file,
    "file"
);
        addMessage(
            "ai",
            "📄 File attached: " +
            file.name +
            "\n\nAsk me to summarize or read the file."
        );


        console.log(
            "✅ File attached:",
            file.name
        );

    }


    /* ======================================
       IMAGE BUTTON
    ====================================== */

    if (
        pickImageBtn &&
        imagePicker
    ) {

        pickImageBtn.onclick =
            function () {

                closeAttachmentMenu();

                imagePicker.value =
                    "";

                imagePicker.click();

            };

    }


    /* ======================================
       CAMERA BUTTON
    ====================================== */

    if (
        takePhotoBtn &&
        cameraPicker
    ) {

        takePhotoBtn.onclick =
            function () {

                closeAttachmentMenu();

                cameraPicker.value =
                    "";

                cameraPicker.click();

            };

    }


    /* ======================================
       FILE BUTTON
    ====================================== */

    if (
        pickFileBtn &&
        filePicker
    ) {

        pickFileBtn.onclick =
            function () {

                closeAttachmentMenu();

                filePicker.value =
                    "";

                filePicker.click();

            };

    }


    /* ======================================
       IMAGE CHANGE
    ====================================== */

    if (imagePicker) {

        imagePicker.onchange =
            function () {

                const file =
                    this.files &&
                    this.files[0];


                saveImageAttachment(
                    file
                );

            };

    }


    /* ======================================
       CAMERA CHANGE
    ====================================== */

    if (cameraPicker) {

        cameraPicker.onchange =
            function () {

                const file =
                    this.files &&
                    this.files[0];


                saveImageAttachment(
                    file
                );

            };

    }


    /* ======================================
       FILE CHANGE
    ====================================== */

    if (filePicker) {

        filePicker.onchange =
            function () {

                const file =
                    this.files &&
                    this.files[0];


                saveFileAttachment(
                    file
                );

            };

    }


    /* ======================================
       GLOBALS
    ====================================== */

    window.saveImageAttachment =
        saveImageAttachment;

    window.saveFileAttachment =
        saveFileAttachment;

    window.openAttachmentMenu =
        openAttachmentMenu;

    window.closeAttachmentMenu =
        closeAttachmentMenu;


    console.log(
        "================================"
    );

    console.log(
        "✅ chat.js v15 READY"
    );

    console.log(
        "Send:",
        typeof window.sendMessage
    );

    console.log(
        "================================"
    );

}


/* ==========================================
   START
========================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startChat
    );

} else {

    startChat();

}
