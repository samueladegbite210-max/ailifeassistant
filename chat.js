// ============================================================
// AI LIFE ASSISTANT
// chat.js
// Stable Text Chat Foundation
// ============================================================

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ chat.js loaded");


    // ========================================================
    // ELEMENTS
    // ========================================================

    const chatBox = document.getElementById("chatBox");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const voiceBtn = document.getElementById("voiceBtn");


    // ========================================================
    // CHECK ELEMENTS
    // ========================================================

    if (!chatBox) {
        console.error("❌ chatBox not found");
        return;
    }

    if (!userInput) {
        console.error("❌ userInput not found");
        return;
    }

    if (!sendBtn) {
        console.error("❌ sendBtn not found");
        return;
    }


    console.log("✅ Chat elements connected");


    // ========================================================
    // TIME
    // ========================================================

    function getCurrentTime() {

        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    }


    // ========================================================
    // SCROLL
    // ========================================================

    function scrollBottom() {

        chatBox.scrollTop = chatBox.scrollHeight;

    }


    // ========================================================
    // ESCAPE TEXT
    // ========================================================

    function escapeHTML(text) {

        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ========================================================
    // ADD MESSAGE
    // ========================================================

    function addMessage(type, text) {

        const message = document.createElement("div");

        message.className = "message " + type;


        const messageText = document.createElement("div");

        messageText.className = "messageText";

        messageText.innerHTML =
            escapeHTML(text).replace(/\n/g, "<br>");


        const messageTime = document.createElement("div");

        messageTime.className = "messageTime";

        messageTime.textContent = getCurrentTime();


        message.appendChild(messageText);

        message.appendChild(messageTime);

        chatBox.appendChild(message);


        scrollBottom();

    }


    // ========================================================
    // COMPOSER
    // ========================================================

    function updateComposer() {

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


    // ========================================================
    // AI REPLY
    // ========================================================

    async function aiReply(text) {

        const typing = document.createElement("div");

        typing.className = "message ai";

        typing.innerHTML = `
            <div class="messageText">
                🤖 AI is typing...
            </div>
        `;


        chatBox.appendChild(typing);

        scrollBottom();


        userInput.disabled = true;

        sendBtn.disabled = true;


        try {

            let answer;


            if (typeof window.smartAIReply === "function") {

                answer =
                    await window.smartAIReply(text);

            } else {

                answer =
                    "⚠️ smartAIReply is not connected.";

            }


            typing.remove();


            if (!answer) {

                answer =
                    "🤖 I don't have an answer for that yet.";

            }


            addMessage("ai", answer);


            if (
                typeof window.saveContext ===
                "function"
            ) {

                window.saveContext(
                    "ai",
                    answer
                );

            }

        }

        catch (error) {

            console.error(
                "❌ AI ERROR:",
                error
            );


            typing.remove();


            addMessage(
                "ai",
                "⚠️ Something went wrong while getting the AI response."
            );

        }


        finally {

            userInput.disabled = false;

            sendBtn.disabled = false;

            userInput.focus();

            updateComposer();

        }

    }


    // ========================================================
    // SEND MESSAGE
    // ========================================================

    function sendMessage(event) {

        if (event) {

            event.preventDefault();

        }


        const text =
            userInput.value.trim();


        if (!text) {

            return;

        }


        console.log(
            "📤 Message sent:",
            text
        );


        // USER MESSAGE

        addMessage(
            "user",
            text
        );


        // SAVE USER MESSAGE

        if (
            typeof window.saveContext ===
            "function"
        ) {

            window.saveContext(
                "user",
                text
            );

        }


        // CLEAR INPUT

        userInput.value = "";

        userInput.style.height = "48px";


        updateComposer();


        // AI

        aiReply(text);

    }


    // ========================================================
    // SEND BUTTON
    // ========================================================

    sendBtn.addEventListener(
        "click",
        sendMessage
    );


    // ========================================================
    // TEXT INPUT
    // ========================================================

    userInput.addEventListener(
        "input",
        function () {

            this.style.height = "48px";

            this.style.height =
                Math.min(
                    this.scrollHeight,
                    150
                ) + "px";


            updateComposer();

        }
    );


    // ========================================================
    // ENTER KEY
    // ========================================================

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


    // ========================================================
    // INITIALIZE
    // ========================================================

    updateComposer();

    scrollBottom();


    console.log(
        "✅ AI Life Assistant chat ready"
    );

});
