"use strict";

// ==========================================
// AI LIFE ASSISTANT
// chat.js
// SEND BUTTON TEST VERSION
// ==========================================

console.log("🚀 chat.js loading...");


// ==========================================
// ELEMENTS
// ==========================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(type, text) {

    if (!chatBox) {
        console.error("❌ chatBox not found");
        return;
    }

    const message = document.createElement("div");

    message.className = "message " + type;

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

    chatBox.scrollTop = chatBox.scrollHeight;
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
// SEND MESSAGE
// ==========================================

function sendMessage(event) {

    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    console.log("📨 SEND BUTTON PRESSED");

    if (!userInput) {
        console.error("❌ userInput not found");
        return;
    }

    const text = userInput.value.trim();

    console.log("📝 Message:", text);

    if (!text) {
        console.log("⚠️ Empty message");
        return;
    }

    // Show user message
    addMessage("user", text);

    // Clear input
    userInput.value = "";

    // Temporary response
    setTimeout(function () {

        addMessage(
            "ai",
            "✅ Send button is working! The AI engine is connected next."
        );

    }, 300);
}


// ==========================================
// BUTTON
// ==========================================

if (sendBtn) {

    console.log("✅ sendBtn found");

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

} else {

    console.error(
        "❌ userInput NOT FOUND"
    );

}


// ==========================================
// GLOBAL EXPORT
// ==========================================

window.sendMessage = sendMessage;
window.addMessage = addMessage;


// ==========================================
// READY
// ==========================================

console.log("=================================");
console.log("✅ chat.js loaded");
console.log("sendMessage:", typeof window.sendMessage);
console.log("sendBtn:", sendBtn);
console.log("userInput:", userInput);
console.log("chatBox:", chatBox);
console.log("=================================");
