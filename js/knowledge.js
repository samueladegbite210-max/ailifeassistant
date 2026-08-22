"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   knowledge.js
   Version 1.0
   Basic Knowledge Engine
========================================== */

console.log("📚 knowledge.js loading...");


/* ==========================================
   KNOWLEDGE DATABASE
========================================== */

const aiKnowledge = {

    /* --------------------------------------
       AI
    -------------------------------------- */

    ai: {
        keywords: [
            "artificial intelligence",
            "what is ai",
            "define ai"
        ],

        answer:
            "🤖 Artificial Intelligence (AI) is technology that allows computers to perform tasks that normally require human intelligence, such as understanding language, recognizing images, learning patterns, and solving problems."
    },


    /* --------------------------------------
       MACHINE LEARNING
    -------------------------------------- */

    machineLearning: {
        keywords: [
            "machine learning",
            "what is machine learning"
        ],

        answer:
            "🧠 Machine learning is a branch of AI where computers learn patterns from data and use those patterns to make predictions or decisions."
    },


    /* --------------------------------------
       INTERNET
    -------------------------------------- */

    internet: {
        keywords: [
            "what is internet",
            "internet"
        ],

        answer:
            "🌐 The Internet is a worldwide network that connects computers and devices so they can communicate and share information."
    },


    /* --------------------------------------
       WEBSITE
    -------------------------------------- */

    website: {
        keywords: [
            "what is a website",
            "what is website"
        ],

        answer:
            "🌍 A website is a collection of web pages that can be accessed through the Internet using a web browser."
    },


    /* --------------------------------------
       HTML
    -------------------------------------- */

    html: {
        keywords: [
            "what is html",
            "html"
        ],

        answer:
            "🌐 HTML stands for HyperText Markup Language. It is used to structure content on web pages."
    },


    /* --------------------------------------
       CSS
    -------------------------------------- */

    css: {
        keywords: [
            "what is css",
            "css"
        ],

        answer:
            "🎨 CSS stands for Cascading Style Sheets. It controls the appearance and layout of HTML elements on a website."
    },


    /* --------------------------------------
       JAVASCRIPT
    -------------------------------------- */

    javascript: {
        keywords: [
            "what is javascript",
            "javascript",
            "js"
        ],

        answer:
            "⚙️ JavaScript is a programming language commonly used to make websites interactive and dynamic."
    },


    /* --------------------------------------
       DATABASE
    -------------------------------------- */

    database: {
        keywords: [
            "what is a database",
            "what is database",
            "database"
        ],

        answer:
            "🗄️ A database is an organized system for storing, managing, and retrieving information."
    },


    /* --------------------------------------
       API
    -------------------------------------- */

    api: {
        keywords: [
            "what is an api",
            "what is api",
            "api"
        ],

        answer:
            "🔌 An API (Application Programming Interface) allows different software systems to communicate and exchange information."
    },


    /* --------------------------------------
       PROGRAMMING
    -------------------------------------- */

    programming: {
        keywords: [
            "what is programming",
            "programming",
            "coding"
        ],

        answer:
            "💻 Programming is the process of writing instructions that tell a computer how to perform tasks."
    },


    /* --------------------------------------
       APP
    -------------------------------------- */

    application: {
        keywords: [
            "what is an app",
            "what is application"
        ],

        answer:
            "📱 An app is a software program designed to perform specific tasks for users."
    }

};


/* ==========================================
   KNOWLEDGE SEARCH
========================================== */

function knowledgeReply(rawMsg) {

    const msg =
        normalizeMessage(rawMsg);

    if (!msg) {

        return null;

    }


    /* ======================================
       EXACT / KEYWORD MATCH
    ====================================== */

    for (
        const key in aiKnowledge
    ) {

        const item =
            aiKnowledge[key];


        if (!item || !item.keywords) {

            continue;

        }


        for (
            const keyword of item.keywords
        ) {

            if (
                msg === keyword ||
                msg.includes(keyword)
            ) {

                return item.answer;

            }

        }

    }


    /* ======================================
       SIMPLE FACTS
    ====================================== */

    if (
        msg.includes("capital of nigeria")
    ) {

        return "🇳🇬 The capital of Nigeria is Abuja.";

    }


    if (
        msg.includes("largest continent")
    ) {

        return "🌍 Asia is the largest continent by land area.";

    }


    if (
        msg.includes("largest ocean")
    ) {

        return "🌊 The Pacific Ocean is the largest ocean on Earth.";

    }


    if (
        msg.includes("highest mountain in africa")
    ) {

        return (
            "🏔️ Mount Kilimanjaro in Tanzania " +
            "is the highest mountain in Africa."
        );

    }


    if (
        msg.includes("longest river in africa")
    ) {

        return (
            "🌊 The Nile is generally recognized " +
            "as the longest river in Africa."
        );

    }


    /* ======================================
       NO ANSWER
    ====================================== */

    return null;

}


/* ==========================================
   GLOBAL EXPORT
========================================== */

window.knowledgeReply =
    knowledgeReply;


console.log(
    "✅ knowledge.js loaded successfully"
);
