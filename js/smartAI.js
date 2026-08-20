// ==========================================
// AI LIFE ASSISTANT
// smartAI.js
// Version 7.0
// Stable AI Controller
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
// SAFE MODULE EXECUTION
// ==========================================

async function runAIModule(
    name,
    fn
) {

    try {

        const result =
            await fn();

        if (
            result !== undefined &&
            result !== null &&
            String(result).trim() !== ""
        ) {

            console.log(
                `✅ AI module responded: ${name}`
            );

            return result;

        }

    } catch (error) {

        console.error(
            `❌ AI module failed: ${name}`,
            error
        );

    }


    return null;

}


// ==========================================
// MAIN AI CONTROLLER
// ==========================================

async function smartAIReply(
    rawMsg
) {

    try {

        const original =
            String(rawMsg || "").trim();


        const msg =
            original.toLowerCase();


        if (!msg) {

            return null;

        }


        // ==================================
        // IMAGE COMMANDS
        // ==================================

        if (isImageCommand(msg)) {

            return await handleImageCommand(
                msg
            );

        }


        // ==================================
        // FILE COMMANDS
        // ==================================

        if (isFileCommand(msg)) {

            return await handleFileCommand(
                msg
            );

        }


        // ==================================
        // UPLOAD LIST
        // ==================================

        if (

            msg.includes("what did i upload") ||

            msg.includes("what have i uploaded") ||

            msg.includes("show my uploads") ||

            msg.includes("my uploaded files") ||

            msg.includes("list uploads")

        ) {

            return getUploadList();

        }


        // ==================================
        // NORMAL AI MODULES
        // ==================================

        const modules = [

            [
                "conversationReply",
                () =>
                    typeof conversationReply ===
                    "function"
                        ? conversationReply(original)
                        : null
            ],

            [
                "memoryReply",
                () =>
                    typeof memoryReply ===
                    "function"
                        ? memoryReply(
                            original,
                            msg
                        )
                        : null
            ],

            [
                "profileReply",
                () =>
                    typeof profileReply ===
                    "function"
                        ? profileReply(original)
                        : null
            ],

            [
                "streakReply",
                () =>
                    typeof streakReply ===
                    "function"
                        ? streakReply(original)
                        : null
            ],

            [
                "learnUserReply",
                () =>
                    typeof learnUserReply ===
                    "function"
                        ? learnUserReply(
                            original,
                            msg
                        )
                        : null
            ],

            [
                "knowledgeReply",
                () =>
                    typeof knowledgeReply ===
                    "function"
                        ? knowledgeReply(original)
                        : null
            ],

            [
                "teacherReply",
                () =>
                    typeof teacherReply ===
                    "function"
                        ? teacherReply(original)
                        : null
            ],

            [
                "quizReply",
                () =>
                    typeof quizReply ===
                    "function"
                        ? quizReply(original)
                        : null
            ],

            [
                "calculatorReply",
                () =>
                    typeof calculatorReply ===
                    "function"
                        ? calculatorReply(original)
                        : null
            ],

            [
                "dateTimeReply",
                () =>
                    typeof dateTimeReply ===
                    "function"
                        ? dateTimeReply(original)
                        : null
            ],

            [
                "taskReply",
                () =>
                    typeof taskReply ===
                    "function"
                        ? taskReply(
                            original,
                            msg
                        )
                        : null
            ],

            [
                "goalReply",
                () =>
                    typeof goalReply ===
                    "function"
                        ? goalReply(
                            original,
                            msg
                        )
                        : null
            ],

            [
                "noteReply",
                () =>
                    typeof noteReply ===
                    "function"
                        ? noteReply(
                            original,
                            msg
                        )
                        : null
            ],

            [
                "eventReply",
                () =>
                    typeof eventReply ===
                    "function"
                        ? eventReply(
                            original,
                            msg
                        )
                        : null
            ],

            [
                "naturalReply",
                () =>
                    typeof naturalReply ===
                    "function"
                        ? naturalReply(original)
                        : null
            ],

            [
                "foodReply",
                () =>
                    typeof foodReply ===
                    "function"
                        ? foodReply(original)
                        : null
            ],

            [
                "weatherReply",
                () =>
                    typeof weatherReply ===
                    "function"
                        ? weatherReply(original)
                        : null
            ],

            [
                "aiBrainReply",
                () =>
                    typeof aiBrainReply ===
                    "function"
                        ? aiBrainReply(original)
                        : null
            ],

            [
                "adviceReply",
                () =>
                    typeof adviceReply ===
                    "function"
                        ? adviceReply(original)
                        : null
            ],

            [
                "internetReply",
                () =>
                    typeof internetReply ===
                    "function"
                        ? internetReply(original)
                        : null
            ]

        ];


        // ==================================
        // RUN MODULES SAFELY
        // ==================================

        for (
            const [name, fn] of modules
        ) {

            const answer =
                await runAIModule(
                    name,
                    fn
                );


            if (answer) {

                return String(answer);

            }

        }


        // ==================================
        // FALLBACK
        // ==================================

        return (
            "🤖 I couldn't find an answer yet.\n\n" +
            "Try asking me another question."
        );


    } catch (error) {

        console.error(
            "❌ smartAIReply error:",
            error
        );


        return (
            "⚠️ I ran into a problem while processing that message."
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

        msg.includes("what does the image show") ||

        msg.includes("analyze the image") ||

        msg.includes("analyze image") ||

        msg.includes("read text from image") ||

        msg.includes("read the text from image") ||

        msg.includes("read the text") ||

        msg.includes("extract text from image") ||

        msg.includes("extract text") ||

        msg.includes("text in the image") ||

        msg.includes("what does the image say") ||

        msg.includes("what does this say") ||

        msg.includes("read this image")

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

        msg.includes("summarize it") ||

        msg.includes("explain the file") ||

        msg.includes("explain the contents") ||

        msg.includes("explain this") ||

        msg.includes("read the file") ||

        msg.includes("read this file") ||

        msg.includes("find important information") ||

        msg.includes("important information in the file") ||

        msg.includes("answer questions about the file") ||

        msg.includes("what does the file say")

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


    // OCR

    if (

        msg.includes("read text") ||

        msg.includes("extract text") ||

        msg.includes("what does the image say") ||

        msg.includes("what does this say") ||

        msg.includes("text in the image")

    ) {

        if (
            typeof readImageText ===
            "function"
        ) {

            return await readImageText(
                attachment.data
            );

        }


        return (
            "📝 The image is attached, but the OCR engine isn't available."
        );

    }


    // Image analysis

    if (

        msg.includes("describe") ||

        msg.includes("what is in") ||

        msg.includes("analyze")

    ) {

        if (
            typeof analyzeImage ===
            "function"
        ) {

            return await analyzeImage(
                attachment.data
            );

        }


        return (
            "👀 I have the image, but the vision engine isn't connected yet."
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
        typeof analyzeFile ===
        "function"
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
        (file, index) => {

            reply +=
                `${index + 1}. ${file.name} (${file.type})\n`;

        }
    );


    return reply;

}


console.log(
    "✅ smartAI.js ready"
);
