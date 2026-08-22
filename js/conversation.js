"use strict";

// ==========================================
// AI LIFE ASSISTANT
// conversation.js
// Version 7.0
// Stable Conversation Engine
// ==========================================

console.log("💬 conversation.js loading...");


// ==========================================
// MAIN CONVERSATION REPLY
// ==========================================

function conversationReply(rawMsg) {

    // --------------------------------------
    // Normalize message safely
    // --------------------------------------

    const msg =
        typeof normalizeMessage === "function"
            ? normalizeMessage(rawMsg)
            : String(rawMsg || "")
                .trim()
                .toLowerCase();


    if (!msg) {
        return null;
    }


    // ======================================
    // GREETINGS
    // ======================================

    if (
        msg === "hi" ||
        msg === "hello" ||
        msg === "hey" ||
        msg === "hiya" ||
        msg === "hey there"
    ) {

        return (
            "👋 Hello " +
            getProfileName() +
            "! How can I help you today?"
        );

    }


    // ======================================
    // HOW ARE YOU
    // ======================================

    if (
        msg === "how are you" ||
        msg === "how are u" ||
        msg.includes("how are you doing") ||
        msg.includes("how are u doing")
    ) {

        return (
            "😊 I'm doing great! " +
            "Thanks for asking. How are you?"
        );

    }


    // ======================================
    // GOOD MORNING
    // ======================================

    if (
        msg === "good morning" ||
        msg.startsWith("good morning ")
    ) {

        return (
            "🌅 Good morning, " +
            getProfileName() +
            "! I hope you have a wonderful day."
        );

    }


    // ======================================
    // GOOD AFTERNOON
    // ======================================

    if (
        msg === "good afternoon" ||
        msg.startsWith("good afternoon ")
    ) {

        return (
            "☀️ Good afternoon, " +
            getProfileName() +
            "! How is your day going?"
        );

    }


    // ======================================
    // GOOD EVENING
    // ======================================

    if (
        msg === "good evening" ||
        msg.startsWith("good evening ")
    ) {

        return (
            "🌇 Good evening, " +
            getProfileName() +
            "! How has your day been?"
        );

    }


    // ======================================
    // GOOD NIGHT
    // ======================================

    if (
        msg === "good night" ||
        msg.startsWith("good night ")
    ) {

        return (
            "🌙 Good night, " +
            getProfileName() +
            "! Sleep well and have a peaceful night."
        );

    }


    // ======================================
    // THANK YOU
    // ======================================

    if (
        msg === "thanks" ||
        msg === "thank you" ||
        msg.includes("thanks a lot") ||
        msg.includes("thank you so much") ||
        msg.includes("thanks so much")
    ) {

        return (
            "❤️ You're very welcome! " +
            "I'm always happy to help."
        );

    }


    // ======================================
    // WHO ARE YOU
    // ======================================

    if (
        msg === "who are you" ||
        msg === "what are you" ||
        msg.includes("who are u")
    ) {

        return (
            "🤖 I'm AI Life Assistant, " +
            "your personal AI companion."
        );

    }


    // ======================================
    // WHAT CAN YOU DO
    // ======================================

    if (
        msg === "help" ||
        msg.includes("what can you do") ||
        msg.includes("what do you do") ||
        msg.includes("how can you help me")
    ) {

        return (
            "🤖 I can help you with:\n\n" +

            "💬 Conversation\n" +
            "🧠 Memory\n" +
            "📚 Learning and explanations\n" +
            "📝 Notes\n" +
            "✅ Tasks\n" +
            "🎯 Goals\n" +
            "📅 Events\n" +
            "🧮 Calculations\n" +
            "🌤️ Weather\n" +
            "📄 Files\n" +
            "🖼️ Images\n" +
            "❤️ Advice\n\n" +

            "Just tell me what you need."
        );

    }


    // ======================================
    // WHO CREATED YOU
    // ======================================

    if (
        msg.includes("who made you") ||
        msg.includes("who created you") ||
        msg.includes("who create you") ||
        msg.includes("who built you") ||
        msg.includes("who build you") ||
        msg.includes("who developed you")
    ) {

        return (
            "💙 I was built by Samuel " +
            "with the help of ChatGPT."
        );

    }


    // ======================================
    // BYE
    // ======================================

    if (
        msg === "bye" ||
        msg === "goodbye" ||
        msg === "bye bye" ||
        msg.includes("see you later")
    ) {

        return (
            "👋 Goodbye, " +
            getProfileName() +
            "! Have a wonderful day."
        );

    }


    // ======================================
    // LOVE / FRIENDLY
    // ======================================

    if (
        msg === "i love you" ||
        msg.includes("i really love you") ||
        msg.includes("love you")
    ) {

        return (
            "❤️ That's very kind of you! " +
            "I'm always here to support you."
        );

    }


    // ======================================
    // SAD
    // ======================================

    if (
        msg.includes("i am sad") ||
        msg.includes("i'm sad") ||
        msg.includes("i feel sad") ||
        msg.includes("feeling sad")
    ) {

        return (
            "💙 I'm sorry you're feeling this way. " +
            "I'm here to listen and support you. " +
            "You can tell me what's going on."
        );

    }


    // ======================================
    // BORED
    // ======================================

    if (
        msg.includes("i am bored") ||
        msg.includes("i'm bored") ||
        msg.includes("feeling bored")
    ) {

        return (
            "😄 Let's change that! " +
            "We could chat, learn something, " +
            "work on your goals, or try a quick quiz."
        );

    }


    // ======================================
    // HAPPY
    // ======================================

    if (
        msg.includes("i am happy") ||
        msg.includes("i'm happy") ||
        msg.includes("feeling happy")
    ) {

        return (
            "😊 That's wonderful to hear! " +
            "I'm glad you're having a good moment."
        );

    }


    // ======================================
    // FALL THROUGH
    // ======================================

    return null;

}


// ==========================================
// GLOBAL EXPORT
// ==========================================

window.conversationReply =
    conversationReply;


// ==========================================
// READY CHECK
// ==========================================

console.log(
    "🔎 conversationReply:",
    typeof window.conversationReply
);

console.log(
    "🔎 normalizeMessage:",
    typeof window.normalizeMessage
);

console.log(
    "🔎 getProfileName:",
    typeof window.getProfileName
);

console.log(
    "✅ conversation.js loaded successfully"
);
