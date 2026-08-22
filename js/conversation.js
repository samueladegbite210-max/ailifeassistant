
"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   conversation.js
   Version 1.0
   Basic Conversation Engine
========================================== */

console.log("💬 conversation.js loading...");


/* ==========================================
   CONVERSATION REPLY
========================================== */

function conversationReply(rawMsg) {

    const msg = normalizeMessage(rawMsg);

    if (!msg) {
        return null;
    }


    /* ======================================
       GREETINGS
    ====================================== */

    if (
        msg === "hi" ||
        msg === "hello" ||
        msg === "hey" ||
        msg === "hiya"
    ) {

        return (
            "👋 Hello " +
            getProfileName() +
            "! How can I help you today?"
        );

    }


    /* ======================================
       HOW ARE YOU
    ====================================== */

    if (
        msg.includes("how are you") ||
        msg.includes("how are u")
    ) {

        return (
            "😊 I'm doing great! " +
            "Thanks for asking. How are you?"
        );

    }


    /* ======================================
       GOOD MORNING
    ====================================== */

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


    /* ======================================
       GOOD AFTERNOON
    ====================================== */

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


    /* ======================================
       GOOD EVENING
    ====================================== */

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


    /* ======================================
       GOOD NIGHT
    ====================================== */

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


    /* ======================================
       THANK YOU
    ====================================== */

    if (
        msg === "thanks" ||
        msg === "thank you" ||
        msg.includes("thanks a lot") ||
        msg.includes("thank you so much")
    ) {

        return (
            "❤️ You're very welcome! " +
            "I'm always happy to help."
        );

    }


    /* ======================================
       WHO ARE YOU
    ====================================== */

    if (
        msg === "who are you" ||
        msg.includes("what are you")
    ) {

        return (
            "🤖 I'm AI Life Assistant, " +
            "your personal AI companion."
        );

    }


    /* ======================================
       WHAT CAN YOU DO
    ====================================== */

    if (
        msg.includes("what can you do") ||
        msg.includes("what do you do") ||
        msg === "help"
    ) {

        return (
            "🤖 I can help you with:\n\n" +
            "💬 Conversation\n" +
            "🧠 Remembering information\n" +
            "📚 Learning and explanations\n" +
            "📝 Notes\n" +
            "✅ Tasks\n" +
            "🎯 Goals\n" +
            "📅 Events\n" +
            "🧮 Calculations\n" +
            "🌤️ Weather\n" +
            "📄 Files\n" +
            "🖼️ Images\n" +
            "❤️ Advice and general assistance"
        );

    }


    /* ======================================
       WHO CREATED YOU
    ====================================== */

    if (
        msg.includes("who made you") ||
        msg.includes("who created you") ||
        msg.includes("who create you") ||
        msg.includes("who built you") ||
        msg.includes("who build you")
    ) {

        return (
            "💙 I was built by Samuel " +
            "with the help of ChatGPT."
        );

    }


    /* ======================================
       BYE
    ====================================== */

    if (
        msg === "bye" ||
        msg === "goodbye" ||
        msg.includes("see you later")
    ) {

        return (
            "👋 Goodbye, " +
            getProfileName() +
            "! Have a wonderful day."
        );

    }


    /* ======================================
       LOVE / FRIENDLY
    ====================================== */

    if (
        msg === "i love you" ||
        msg.includes("love you")
    ) {

        return (
            "❤️ That's very kind of you! " +
            "I'm always here to support you."
        );

    }


    /* ======================================
       LONELY / SAD
    ====================================== */

    if (
        msg.includes("i am sad") ||
        msg.includes("i'm sad") ||
        msg.includes("i feel sad")
    ) {

        return (
            "💙 I'm sorry you're feeling this way. " +
            "You don't have to handle everything alone. " +
            "I'm here to listen."
        );

    }


    /* ======================================
       BORED
    ====================================== */

    if (
        msg.includes("i am bored") ||
        msg.includes("i'm bored")
    ) {

        return (
            "😄 Let's change that! " +
            "We could chat, learn something, " +
            "work on your goals, or try a quick quiz."
        );

    }


    /* ======================================
       FALL THROUGH
    ====================================== */

    return null;

}


/* ==========================================
   GLOBAL EXPORT
========================================== */

window.conversationReply = conversationReply;


console.log(
    "✅ conversation.js loaded successfully"
);
