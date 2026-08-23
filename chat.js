"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   chat.js
   Version 13.0
   Stable Chat + Attachment Controller
========================================== */

console.log("🚀 chat.js loading...");


/* ==========================================
   ELEMENTS
========================================== */

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


/* ==========================================
   ATTACHMENT STATE
========================================== */

window.aiAttachment =
    window.aiAttachment || null;

window.uploadedFiles =
    window.uploadedFiles || [];


/* ==========================================
   ADD MESSAGE
========================================== */

function addMessage(sender, text) {

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


window.addMessage =
    addMessage;


/* ==========================================
   ATTACHMENT MENU
========================================== */

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


/* ==========================================
   ATTACH BUTTON
========================================== */

if (attachBtn) {

    attachBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


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

        }
    );

}


/* ==========================================
   IMAGE PICKER
========================================== */

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


/* ==========================================
   CAMERA
========================================== */

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


/* ==========================================
   FILE PICKER
========================================== */

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


/* ==========================================
   SAVE IMAGE ATTACHMENT
========================================== */

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

        type: file.type || "image",

        size: file.size,

        uploadedAt:
            new Date().toISOString()

    });


    addMessage(
        "ai",
        "🖼️ Image attached: " +
        file.name +
        "\n\n" +
        "You can ask me:\n" +
        "• Read the text\n" +
        "• Describe the image\n" +
        "• Analyze the image"
    );


    console.log(
        "✅ Image attachment saved"
    );
}


/* ==========================================
   SAVE FILE ATTACHMENT
========================================== */

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


    addMessage(
        "ai",
        "📄 File attached: " +
        file.name +
        "\n\n" +
        "You can ask me:\n" +
        "• Summarize the file\n" +
        "• Read the file\n" +
        "• Explain the contents"
    );


    console.log(
        "✅ File attachment saved"
    );
}


/* ==========================================
   IMAGE CHANGE
========================================== */

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


            saveImageAttachment(
                file
            );

        }
    );

}


/* ==========================================
   CAMERA CHANGE
========================================== */

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


            saveImageAttachment(
                file
            );

        }
    );

}


/* ==========================================
   FILE CHANGE
========================================== */

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


            saveFileAttachment(
                file
            );

        }
    );

}


/* ==========================================
   SEND MESSAGE
========================================== */

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


    let message =
        userInput.value.trim();


    const attachment =
        window.aiAttachment;


    /*
       If only an attachment exists,
       automatically choose a useful command.
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

        console.log(
            "⚠️ Empty message"
        );

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

        if (
            typeof window.smartAIReply ===
            "function"
        ) {

            console.log(
                "🧠 Sending to smartAIReply..."
            );


            const response =
                await window.smartAIReply(
                    message
                );


            if (thinking) {

                thinking.remove();

            }


            addMessage(
                "ai",
                response ||
                "🤖 I don't have an answer yet."
            );


            return;

        }


        if (thinking) {

            thinking.remove();

        }


        addMessage(
            "ai",
            "⚠️ smartAI.js is not loaded."
        );

    }

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
            "⚠️ Something went wrong while processing your message."
        );

    }

}


window.sendMessage =
    sendMessage;


/* ==========================================
   SEND BUTTON
========================================== */

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        sendMessage
    );


    console.log(
        "✅ sendBtn connected"
    );

} else {

    console.error(
        "❌ sendBtn NOT FOUND"
    );

}


/* ==========================================
   ENTER KEY
========================================== */

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

}


/* ==========================================
   AUTO RESIZE
========================================== */

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


/* ==========================================
   CLOSE ATTACHMENT MENU
========================================== */

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


/* ==========================================
   WELCOME NAME
========================================== */

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


/* ==========================================
   GLOBAL ATTACHMENT FUNCTIONS
========================================== */

window.saveImageAttachment =
    saveImageAttachment;

window.saveFileAttachment =
    saveFileAttachment;

window.openAttachmentMenu =
    openAttachmentMenu;

window.closeAttachmentMenu =
    closeAttachmentMenu;


/* ==========================================
   READY
========================================== */

console.log(
    "========================================"
);

console.log(
    "✅ chat.js Version 13.0 ready"
);

console.log(
    "Send:",
    !!sendBtn
);

console.log(
    "Attach:",
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
    "smartAIReply:",
    typeof window.smartAIReply
);

console.log(
    "========================================"
);
