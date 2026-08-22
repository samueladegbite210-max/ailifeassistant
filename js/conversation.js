"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   conversation.js
   Version 2.0
   Stable Conversation Engine
========================================== */

console.log("💬 conversation.js loading...");


/* ==========================================
   CONVERSATION REPLY
========================================== */

function conversationReply(rawMsg) {

    const msg =
        typeof normalizeMessage === "function"
            ? normalizeMessage(rawMsg)
            : String(rawMsg || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");

    if (!msg) {
        return null;
    }


    const name =
        typeof getProfileName === "function"
            ? getProfileName()
            : "Samuel";


    /* ======================================
       GREETINGS
    ====================================== */

    if (
        msg === "hi" ||
        msg === "hello" ||
        msg === "hey" ||
        msg === "hiya" ||
        msg === "hey there" ||
        msg === "hello there"
    ) {

        return (
            "👋 Hello " +
            name +
            "! How can I help you today?"
        );

    }


    /* ======================================
       HOW ARE YOU
    ====================================== */

    if (
        msg === "how are you" ||
        msg === "how are u" ||
        msg.includes("how are you doing")
    ) {

        return (
            "😊 I'm doing great! Thanks for asking. " +
            "How are you?"
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
            name +
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
            name +
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
            name +
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
            name +
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
        msg.includes("thank you so much") ||
        msg.includes("thanks so much")
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
        msg === "what are you" ||
        msg.includes("tell me about yourself")
    ) {

        return (
            "🤖 I'm AI Life Assistant, " +
            "your personal AI companion. " +
            "I can help you manage tasks, goals, notes, " +
            "events, information, files, and everyday questions."
        );

    }


    /* ======================================
       WHAT CAN YOU DO
    ====================================== */

    if (
        msg === "help" ||
        msg.includes("what can you do") ||
        msg.includes("what do you do") ||
        msg.includes("how can you help me")
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
        msg === "see you" ||
        msg.includes("see you later")
    ) {

        return (
            "👋 Goodbye, " +
            name +
            "! Have a wonderful day."
        );

    }


    /* ======================================
       LOVE / FRIENDLY
    ====================================== */

    if (
        msg === "i love you" ||
        msg === "love you" ||
        msg.includes("i love you")
    ) {

        return (
            "❤️ That's very kind of you! " +
            "I'm always here to support you."
        );

    }


    /* ======================================
       SAD
    ====================================== */

    if (
        msg.includes("i am sad") ||
        msg.includes("i'm sad") ||
        msg.includes("i feel sad") ||
        msg.includes("feeling sad")
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
        msg.includes("i'm bored") ||
        msg.includes("feeling bored")
    ) {

        return (
            "😄 Let's change that! We could chat, " +
            "learn something, work on your goals, " +
            "or try a quick quiz."
        );

    }


    /* ======================================
       HAPPY
    ====================================== */

    if (
        msg.includes("i am happy") ||
        msg.includes("i'm happy") ||
        msg.includes("i feel happy")
    ) {

        return (
            "😊 That's wonderful to hear! " +
            "Keep that positive energy going."
        );

    }


    /* ======================================
       GOOD JOB / PRAISE
    ====================================== */

    if (
        msg.includes("good job") ||
        msg.includes("well done") ||
        msg.includes("you are amazing") ||
        msg.includes("you're amazing")
    ) {

        return (
            "😊 Thank you! I appreciate that. " +
            "I'm here to help you."
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

window.conversationReply =
    conversationReply;


console.log(
    "✅ conversation.js loaded successfully"
);
