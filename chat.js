// ==========================================
// AI LIFE ASSISTANT
// chat.js
// Version 8.0
// Stable Chat Controller
// ==========================================

"use strict";

console.log("💬 chat.js loading...");

document.addEventListener("DOMContentLoaded", function () {

    console.log("💬 chat.js DOM ready");

    // ======================================
    // DOM
    // ======================================

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


    // ======================================
    // DEBUG
    // ======================================

    console.log("================================");
    console.log("CHAT SYSTEM CHECK");
    console.log("chatBox:", chatBox);
    console.log("userInput:", userInput);
    console.log("sendBtn:", sendBtn);
    console.log("smartAIReply:", typeof window.smartAIReply);
    console.log("conversationReply:", typeof window.conversationReply);
    console.log("memoryReply:", typeof window.memoryReply);
    console.log("================================");


    // ======================================
    // STOP IF CHAT HTML IS MISSING
    // ======================================

    if (!chatBox || !userInput || !sendBtn) {

        console.error(
            "❌ CHAT ERROR: Required chat elements are missing."
        );

        return;
    }


    // ======================================
    // UPLOAD MEMORY
    // ======================================

    window.uploadedFiles =
        window.uploadedFiles || [];


    // ======================================
    // TIME
    // ======================================

    function getCurrentTime() {

        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    }


    // ======================================
    // SCROLL
    // ======================================

    function scrollBottom() {

        chatBox.scrollTop =
            chatBox.scrollHeight;

    }


    // ======================================
    // ADD MESSAGE
    // ======================================

    function addMessage(type, text) {

        const message =
            document.createElement("div");

        message.className =
            "message " + type;


        const messageText =
            document.createElement("div");

        messageText.className =
            "messageText";


        messageText.textContent =
            String(text);


        const messageTime =
            document.createElement("div");

        messageTime.className =
            "messageTime";

        messageTime.textContent =
            getCurrentTime();


        message.appendChild(messageText);
        message.appendChild(messageTime);

        chatBox.appendChild(message);

        scrollBottom();

    }


    // ======================================
    // TYPING
    // ======================================

    function showTyping() {

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


    // ======================================
    // COMPOSER
    // ======================================

    function updateComposer() {

        userInput.style.height =
            "auto";

        userInput.style.height =
            Math.min(
                userInput.scrollHeight,
                140
            ) + "px";

    }


    // ======================================
    // SEND MESSAGE
    // ======================================

    let isSending = false;


    async function sendMessage() {

        console.log("🚀 sendMessage() called");


        if (isSending) {

            console.log(
                "⚠️ Message already sending"
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


        // Show user message
        addMessage(
            "user",
            text
        );


        // Clear input
        userInput.value = "";

        updateComposer();


        // Save context
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
                "Context error:",
                error
            );

        }


        // Disable send
        sendBtn.disabled = true;


        // AI reply
        showTyping();


        try {

            console.log(
                "🧠 Calling smartAIReply..."
            );


            if (
                typeof window.smartAIReply !==
                "function"
            ) {

                throw new Error(
                    "smartAIReply() is not available"
                );

            }


            const answer =
                await window.smartAIReply(
                    text
                );


            console.log(
                "🤖 AI answer:",
                answer
            );


            hideTyping();


            addMessage(
                "ai",
                answer ||
                "🤖 I don't have an answer for that yet."
            );


            // Save AI response
            try {

                if (
                    typeof window.saveContext ===
                    "function"
                ) {

                    window.saveContext(
                        "ai",
                        String(answer || "")
                    );

                }

            } catch (error) {

                console.warn(
                    "AI context error:",
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
                "⚠️ Sorry, I couldn't process that message."
            );

        }


        // Always unlock
        isSending = false;

        sendBtn.disabled = false;

        userInput.disabled = false;

        userInput.focus();

        updateComposer();

    }


    // ======================================
    // MAKE SEND AVAILABLE GLOBALLY
    // ======================================

    window.sendMessage =
        sendMessage;


    // ======================================
    // SEND BUTTON AND EVENT LISTENERS
    // ======================================

    sendBtn.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            sendMessage();
        }
    );

    userInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }
    );

    userInput.addEventListener(
        "input",
        updateComposer
    );

    // ======================================
    // ATTACHMENT MENU TOGGLE
    // ======================================

    if (attachBtn && attachmentMenu) {
        attachBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            attachmentMenu.classList.toggle("active");
        });

        document.addEventListener("click", function () {
            attachmentMenu.classList.remove("active");
        });
    }

    if (pickImageBtn && imagePicker) {
        pickImageBtn.addEventListener("click", () => imagePicker.click());
    }
    if (takePhotoBtn && cameraPicker) {
        takePhotoBtn.addEventListener("click", () => cameraPicker.click());
    }
    if (pickFileBtn && filePicker) {
        pickFileBtn.addEventListener("click", () => filePicker.click());
    }

}); // Ends DOMContentLoaded safely

    // ======================================
    // ENTER KEY
    // ======================================

    userInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                console.log(
                    "⌨️ ENTER PRESSED"
                );

                sendMessage();

            }

        }
    );


    // ======================================
    // INPUT RESIZE
    // ======================================

    userInput.addEventListener(
        "input",
        updateComposer
    );


    // ======================================
    // ATTACHMENT MENU
    // ======================================

    if (attachBtn && attachmentMenu) {

        attachBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                attachmentMenu.classList.toggle(
                    "show"
                );

            }
        );

    }


    // ======================================
    // IMAGE
    // ======================================

    if (pickImageBtn && imagePicker) {

        pickImageBtn.addEventListener(
            "click",
            function () {

                imagePicker.click();

            }
        );

    }


    // ======================================
    // CAMERA
    // ======================================

    if (takePhotoBtn && cameraPicker) {

        takePhotoBtn.addEventListener(
            "click",
            function () {

                cameraPicker.click();

            }
        );

    }


    // ======================================
    // FILE
    // ======================================

    if (pickFileBtn && filePicker) {

        pickFileBtn.addEventListener(
            "click",
            function () {

                filePicker.click();

            }
        );

    }


    // ======================================
    // VOICE
    // ======================================

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


    // ======================================
    // INITIALIZE
    // ======================================

    updateComposer();

    console.log(
        "✅ chat.js Version 8.0 READY"
    );

});
