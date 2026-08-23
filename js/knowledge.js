"use strict";

// ==========================================
// AI LIFE ASSISTANT
// knowledge.js
// Version 7.0
// Stable Knowledge Engine
// ==========================================

console.log("📚 knowledge.js loading...");


// ==========================================
// KNOWLEDGE DATABASE
// ==========================================

const aiKnowledge = {

    // --------------------------------------
    // ARTIFICIAL INTELLIGENCE
    // --------------------------------------

    ai: {

        keywords: [
            "artificial intelligence",
            "what is ai",
            "define ai"
        ],

        answer:
            "🤖 Artificial Intelligence (AI) is technology that allows computers to perform tasks that normally require human intelligence, such as understanding language, recognizing images, learning patterns, and solving problems."

    },


    // --------------------------------------
    // MACHINE LEARNING
    // --------------------------------------

    machineLearning: {

        keywords: [
            "machine learning",
            "what is machine learning",
            "define machine learning"
        ],

        answer:
            "🧠 Machine learning is a branch of AI where computers learn patterns from data and use those patterns to make predictions or decisions."

    },


    // --------------------------------------
    // INTERNET
    // --------------------------------------

    internet: {

        keywords: [
            "what is the internet",
            "what is internet",
            "define internet"
        ],

        answer:
            "🌐 The Internet is a worldwide network that connects computers, phones, servers, and other devices so they can communicate and share information."

    },


    // --------------------------------------
    // WEBSITE
    // --------------------------------------

    website: {

        keywords: [
            "what is a website",
            "what is website",
            "define website"
        ],

        answer:
            "🌍 A website is a collection of web pages and related content that can be accessed through the Internet using a web browser."

    },


    // --------------------------------------
    // HTML
    // --------------------------------------

    html: {

        keywords: [
            "what is html",
            "define html",
            "html"
        ],

        answer:
            "🌐 HTML stands for HyperText Markup Language. It is used to structure the content and elements of web pages."

    },


    // --------------------------------------
    // CSS
    // --------------------------------------

    css: {

        keywords: [
            "what is css",
            "define css",
            "css"
        ],

        answer:
            "🎨 CSS stands for Cascading Style Sheets. It controls the appearance, layout, spacing, colors, fonts, and visual design of HTML elements."

    },


    // --------------------------------------
    // JAVASCRIPT
    // --------------------------------------

    javascript: {

        keywords: [
            "what is javascript",
            "define javascript",
            "what is js",
            "javascript",
            "js"
        ],

        answer:
            "⚙️ JavaScript is a programming language commonly used to make websites and applications interactive and dynamic."

    },


    // --------------------------------------
    // DATABASE
    // --------------------------------------

    database: {

        keywords: [
            "what is a database",
            "what is database",
            "define database",
            "database"
        ],

        answer:
            "🗄️ A database is an organized system for storing, managing, searching, and retrieving information."

    },


    // --------------------------------------
    // API
    // --------------------------------------

    api: {

        keywords: [
            "what is an api",
            "what is api",
            "define api",
            "api"
        ],

        answer:
            "🔌 An API (Application Programming Interface) allows different software programs or systems to communicate and exchange information."

    },


    // --------------------------------------
    // PROGRAMMING
    // --------------------------------------

    programming: {

        keywords: [
            "what is programming",
            "define programming",
            "what is coding",
            "programming",
            "coding"
        ],

        answer:
            "💻 Programming is the process of writing instructions that tell a computer or application how to perform specific tasks."

    },


    // --------------------------------------
    // APPLICATION
    // --------------------------------------

    application: {

        keywords: [
            "what is an app",
            "what is app",
            "what is an application",
            "define application"
        ],

        answer:
            "📱 An app, or application, is software designed to perform specific tasks or provide services for users."

    },


    // --------------------------------------
    // BROWSER
    // --------------------------------------

    browser: {

        keywords: [
            "what is a browser",
            "what is web browser",
            "define browser"
        ],

        answer:
            "🌐 A web browser is software used to access and view websites and web applications on the Internet."

    },


    // --------------------------------------
    // SERVER
    // --------------------------------------

    server: {

        keywords: [
            "what is a server",
            "define server"
        ],

        answer:
            "🖥️ A server is a computer or software system that provides data, services, or resources to other computers and applications over a network."

    },


    // --------------------------------------
    // FRONTEND
    // --------------------------------------

    frontend: {

        keywords: [
            "what is frontend",
            "what is front end",
            "define frontend"
        ],

        answer:
            "🎨 Frontend is the part of an application or website that users see and interact with. HTML, CSS, and JavaScript are commonly used to build it."

    },


    // --------------------------------------
    // BACKEND
    // --------------------------------------

    backend: {

        keywords: [
            "what is backend",
            "what is back end",
            "define backend"
        ],

        answer:
            "⚙️ Backend is the part of an application that runs behind the scenes. It can handle databases, authentication, business logic, APIs, and server operations."

    }

};


// ==========================================
// SAFE MESSAGE NORMALIZATION
// ==========================================

function knowledgeNormalize(value) {

    if (
        typeof normalizeMessage ===
        "function"
    ) {

        return normalizeMessage(value);

    }

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

}


// ==========================================
// KNOWLEDGE SEARCH
// ==========================================

function knowledgeReply(rawMsg) {

    const msg =
        knowledgeNormalize(rawMsg);


    if (!msg) {

        return null;

    }


    // ======================================
    // SEARCH KNOWLEDGE DATABASE
    // ======================================

    for (
        const key in aiKnowledge
    ) {

        const item =
            aiKnowledge[key];


        if (
            !item ||
            !Array.isArray(item.keywords)
        ) {

            continue;

        }


        for (
            const keyword of item.keywords
        ) {

            const cleanKeyword =
                knowledgeNormalize(keyword);


            if (
                !cleanKeyword
            ) {

                continue;

            }


            const escapedKeyword =
    cleanKeyword.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

const keywordRegex =
    new RegExp(
        "\\b" +
        escapedKeyword +
        "\\b",
        "i"
    );

if (
    keywordRegex.test(msg)
) {

    return item.answer;

          }  
        }

    }


    // ======================================
    // SIMPLE GENERAL FACTS
    // ======================================

    if (
        msg.includes("capital of nigeria")
    ) {

        return (
            "🇳🇬 The capital of Nigeria is Abuja."
        );

    }


    if (
        msg.includes("largest continent")
    ) {

        return (
            "🌍 Asia is the largest continent by land area."
        );

    }


    if (
        msg.includes("largest ocean")
    ) {

        return (
            "🌊 The Pacific Ocean is the largest ocean on Earth."
        );

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


    // ======================================
    // NO ANSWER
    // ======================================

    return null;

}


// ==========================================
// GLOBAL EXPORT
// ==========================================

window.aiKnowledge =
    aiKnowledge;

window.knowledgeReply =
    knowledgeReply;


// ==========================================
// READY CHECK
// ==========================================

console.log(
    "🔎 knowledgeReply:",
    typeof window.knowledgeReply
);

console.log(
    "🔎 normalizeMessage:",
    typeof window.normalizeMessage
);

console.log(
    "✅ knowledge.js loaded successfully"
);
