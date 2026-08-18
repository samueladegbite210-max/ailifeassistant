// ==========================================
// AI LIFE ASSISTANT
// smartAI.js
// Version 6.0
// AI Controller + Attachments
// ==========================================

"use strict";

console.log("🧠 smartAI.js loaded");


// ==========================================
// ATTACHMENT ACCESS
// ==========================================

function getCurrentAttachment() {

    return window.aiAttachment || null;

}


// ==========================================
// MAIN AI CONTROLLER
// ==========================================

async function smartAIReply(msg) {

    try {

        msg =
            String(msg || "")
                .trim()
                .toLowerCase();


        if (!msg) {

            return null;

        }


        // ==================================
        // IMAGE COMMANDS
        // ==================================

        if (isImageCommand(msg)) {

            return await handleImageCommand(msg);

        }


        // ==================================
        // FILE COMMANDS
        // ==================================

        if (isFileCommand(msg)) {

            return await handleFileCommand(msg);

        }


        // ==================================
        // UPLOAD LIST
        // ==================================

        if (
            msg.includes("what did i upload") ||
            msg.includes("what have i uploaded") ||
            msg.includes("show my uploads") ||
            msg.includes("my uploaded files")
        ) {

            return getUploadList();

        }


        // ==================================
        // NORMAL AI SYSTEM
        // ==================================

        let answer;


        if (
            typeof conversationReply === "function"
        ) {

            answer =
                conversationReply(msg);

            if (answer) return answer;

        }


        if (
            typeof memoryReply === "function"
        ) {

            answer =
                memoryReply(msg, msg);

            if (answer) return answer;

        }


        if (
            typeof profileReply === "function"
        ) {

            answer =
                profileReply(msg);

            if (answer) return answer;

        }


        if (
            typeof streakReply === "function"
        ) {

            answer =
                streakReply(msg);

            if (answer) return answer;

        }


        if (
            typeof learnUserReply === "function"
        ) {

            answer =
                learnUserReply(msg, msg);

            if (answer) return answer;

        }


        if (
            typeof knowledgeReply === "function"
        ) {

            answer =
                knowledgeReply(msg);

            if (answer) return answer;

        }


        if (
            typeof teacherReply === "function"
        ) {

            answer =
                teacherReply(msg);

            if (answer) return answer;

        }


        if (
            typeof quizReply === "function"
        ) {

            answer =
                quizReply(msg);

            if (answer) return answer;

        }


        if (
            typeof calculatorReply === "function"
        ) {

            answer =
                calculatorReply(msg);

            if (answer) return answer;

        }


        if (
            typeof dateTimeReply === "function"
        ) {

            answer =
                dateTimeReply(msg);

            if (answer) return answer;

        }


        if (
            typeof taskReply === "function"
        ) {

            answer =
                taskReply(msg, msg);

            if (answer) return answer;

        }


        if (
            typeof goalReply === "function"
        ) {

            answer =
                goalReply(msg, msg);

            if (answer) return answer;

        }


        if (
            typeof noteReply === "function"
        ) {

            answer =
                noteReply(msg, msg);

            if (answer) return answer;

        }


        if (
            typeof eventReply === "function"
        ) {

            answer =
                eventReply(msg, msg);

            if (answer) return answer;

        }


        if (
            typeof naturalReply === "function"
        ) {

            answer =
                naturalReply(msg);

            if (answer) return answer;

        }


        if (
            typeof foodReply === "function"
        ) {

            answer =
                foodReply(msg);

            if (answer) return answer;

        }


        if (
            typeof weatherReply === "function"
        ) {

            answer =
                weatherReply(msg);

            if (answer) return answer;

        }


        if (
            typeof aiBrainReply === "function"
        ) {

            answer =
                await aiBrainReply(msg);

            if (answer) return answer;

        }


        if (
            typeof adviceReply === "function"
        ) {

            answer =
                adviceReply(msg);

            if (answer) return answer;

        }


        if (
            typeof internetReply === "function"
        ) {

            answer =
                await internetReply(msg);

            if (answer) return answer;

        }


        return (
            "🤖 I couldn't find an answer yet. " +
            "Try asking another question."
        );

    }

    catch (error) {

        console.error(
            "❌ smartAIReply error:",
            error
        );


        return (
            "⚠️ I ran into a problem while processing that."
        );

    }

}


// ==========================================
// IMAGE COMMAND DETECTION
// ==========================================

function isImageCommand(msg) {

    return (

        msg.includes("describe the image") ||

        msg.includes("describe image") ||

        msg.includes("what is in the image") ||

        msg.includes("what's in the image") ||

        msg.includes("analyze the image") ||

        msg.includes("analyze image") ||

        msg.includes("read text from image") ||

        msg.includes("read the text from image") ||

        msg.includes("read the text") ||

        msg.includes("extract text from image") ||

        msg.includes("extract text") ||

        msg.includes("text in the image") ||

        msg.includes("what does the image say")

    );

}


// ==========================================
// FILE COMMAND DETECTION
// ==========================================

function isFileCommand(msg) {

    return (

        msg.includes("summarize the file") ||

        msg.includes("summarize file") ||

        msg.includes("summarize this") ||

        msg.includes("explain the file") ||

        msg.includes("explain the contents") ||

        msg.includes("read the file") ||

        msg.includes("read this file") ||

        msg.includes("read this") ||

        msg.includes("find important information") ||

        msg.includes("important information in the file") ||

        msg.includes("answer questions about the file")

    );

}


// ==========================================
// IMAGE HANDLER
// ==========================================

async function handleImageCommand(msg) {

    const attachment =
        getCurrentAttachment();


    if (!attachment) {

        return (
            "📷 I don't currently have an image attached.\n\n" +
            "Please upload an image first."
        );

    }


    if (
        attachment.type !== "image"
    ) {

        return (
            "📎 The current attachment isn't an image.\n\n" +
            "Please upload an image."
        );

    }


    // ==================================
    // OCR
    // ==================================

    if (
        msg.includes("read text") ||
        msg.includes("extract text") ||
        msg.includes("what does the image say") ||
        msg.includes("text in the image")
    ) {

        if (
            typeof readImageText === "function"
        ) {

            return await readImageText(
                attachment.data
            );

        }


        return (
            "📝 The image is attached, but the OCR engine isn't available."
        );

    }


    // ==================================
    // DESCRIPTION
    // ==================================

    if (
        msg.includes("describe") ||
        msg.includes("what is in") ||
        msg.includes("analyze")
    ) {

        if (
            typeof analyzeImage === "function"
        ) {

            return await analyzeImage(
                attachment.data
            );

        }


        return (
            "👀 I have the image, but the vision engine isn't connected yet.\n\n" +
            "I can still try to read text from it."
        );

    }


    return (
        "📷 I have your image ready.\n\n" +
        "Ask me:\n\n" +
        "📝 Read the text\n" +
        "👀 Describe the image\n" +
        "🔍 Analyze the image"
    );

}


// ==========================================
// FILE HANDLER
// ==========================================

async function handleFileCommand(msg) {

    const attachment =
        getCurrentAttachment();


    if (!attachment) {

        return (
            "📂 I don't currently have a file attached.\n\n" +
            "Please upload a file first."
        );

    }


    if (
        attachment.type !== "file"
    ) {

        return (
            "📎 The current attachment isn't a document.\n\n" +
            "Please upload a file."
        );

    }


    if (
        typeof analyzeFile === "function"
    ) {

        return await analyzeFile(
            attachment.file
        );

    }


    return (
        "📄 I have your file, but the document-reading engine isn't connected yet."
    );

}


// ==========================================
// UPLOAD LIST
// ==========================================

function getUploadList() {

    const files =
        window.uploadedFiles || [];


    if (!files.length) {

        return (
            "📂 You haven't uploaded any files yet."
        );

    }


    let reply =
        "📂 Uploaded files:\n\n";


    files.forEach(
        function (file, index) {

            reply +=
                `${index + 1}. ${file.name} ` +
                `(${file.type})\n`;

        }
    );


    return reply;

}
