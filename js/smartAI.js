// ==========================================
// AI LIFE ASSISTANT
// smartAI.js
// Version 8.0
// Stable Central AI Controller
// ==========================================

"use strict";

console.log("🧠 smartAI.js loading...");


// ==========================================
// ATTACHMENT ACCESS
// ==========================================

function getCurrentAttachment() {

    return window.aiAttachment || null;

}


// ==========================================
// SAFE MODULE RUNNER
// ==========================================

async function runModule(name, callback) {

    try {

        if (typeof callback !== "function") {
            return null;
        }

        const result = await callback();

        if (
            result !== null &&
            result !== undefined &&
            String(result).trim() !== ""
        ) {

            console.log(
                "✅ AI module responded:",
                name
            );

            return String(result);

        }

    } catch (error) {

        console.error(
            "❌ AI module error:",
            name,
            error
        );

    }

    return null;

}


// ==========================================
// MAIN AI
// ==========================================

async function smartAIReply(rawMessage) {

    const original =
        String(rawMessage || "").trim();

    if (!original) {
        return null;
    }

    const msg =
        original.toLowerCase().trim();


    console.log(
        "🧠 Processing:",
        original
    );


    // ======================================
    // ATTACHMENT COMMANDS
    // ======================================

    if (isImageCommand(msg)) {

        return await handleImageCommand(msg);

    }


    if (isFileCommand(msg)) {

        return await handleFileCommand(msg);

    }


    // ======================================
    // UPLOAD LIST
    // ======================================

    if (
        msg.includes("what did i upload") ||
        msg.includes("what have i uploaded") ||
        msg.includes("show my uploads") ||
        msg.includes("my uploaded files") ||
        msg.includes("list my uploads")
    ) {

        return getUploadList();

    }


    // ======================================
    // AI MODULES
    // ======================================

    const modules = [

        // Conversation
        [
            "conversationReply",
            () => {

                if (
                    typeof conversationReply ===
                    "function"
                ) {

                    return conversationReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Memory
        [
            "memoryReply",
            () => {

                if (
                    typeof memoryReply ===
                    "function"
                ) {

                    return memoryReply(
                        msg,
                        original
                    );

                }

                return null;

            }
        ],


        // Knowledge
        [
            "knowledgeReply",
            () => {

                if (
                    typeof knowledgeReply ===
                    "function"
                ) {

                    return knowledgeReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Profile
        [
            "profileReply",
            () => {

                if (
                    typeof profileReply ===
                    "function"
                ) {

                    return profileReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Learning
        [
            "learnUserReply",
            () => {

                if (
                    typeof learnUserReply ===
                    "function"
                ) {

                    return learnUserReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Teacher
        [
            "teacherReply",
            () => {

                if (
                    typeof teacherReply ===
                    "function"
                ) {

                    return teacherReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Quiz
        [
            "quizReply",
            () => {

                if (
                    typeof quizReply ===
                    "function"
                ) {

                    return quizReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Calculator
        [
            "calculatorReply",
            () => {

                if (
                    typeof calculatorReply ===
                    "function"
                ) {

                    return calculatorReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Date / Time
        [
            "dateTimeReply",
            () => {

                if (
                    typeof dateTimeReply ===
                    "function"
                ) {

                    return dateTimeReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Tasks
        [
            "taskReply",
            () => {

                if (
                    typeof taskReply ===
                    "function"
                ) {

                    return taskReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Goals
        [
            "goalReply",
            () => {

                if (
                    typeof goalReply ===
                    "function"
                ) {

                    return goalReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Notes
        [
            "noteReply",
            () => {

                if (
                    typeof noteReply ===
                    "function"
                ) {

                    return noteReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Events
        [
            "eventReply",
            () => {

                if (
                    typeof eventReply ===
                    "function"
                ) {

                    return eventReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Natural language
        [
            "naturalReply",
            () => {

                if (
                    typeof naturalReply ===
                    "function"
                ) {

                    return naturalReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Food
        [
            "foodReply",
            () => {

                if (
                    typeof foodReply ===
                    "function"
                ) {

                    return foodReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Weather
        [
            "weatherReply",
            () => {

                if (
                    typeof weatherReply ===
                    "function"
                ) {

                    return weatherReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Advice
        [
            "adviceReply",
            () => {

                if (
                    typeof adviceReply ===
                    "function"
                ) {

                    return adviceReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Internet
        [
            "internetReply",
            () => {

                if (
                    typeof internetReply ===
                    "function"
                ) {

                    return internetReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ],


        // Main Brain
        [
            "aiBrainReply",
            () => {

                if (
                    typeof aiBrainReply ===
                    "function"
                ) {

                    return aiBrainReply(
                        original,
                        msg
                    );

                }

                return null;

            }
        ]

    ];


    // ======================================
    // RUN MODULES IN ORDER
    // ======================================

    for (
        const [name, callback]
        of modules
    ) {

        const response =
            await runModule(
                name,
                callback
            );


        if (response) {

            return response;

        }

    }


    // ======================================
    // FALLBACK
    // ======================================

    return (
        "🤖 I'm still learning.\n\n" +
        "I couldn't find a good answer to that yet."
    );

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

        msg.includes("summarize this file") ||
        msg.includes("summarize this") ||
        msg.includes("summarize it") ||

        msg.includes("explain the file") ||
        msg.includes("explain this file") ||
        msg.includes("explain the contents") ||

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

    console.log(
        "🖼️ IMAGE COMMAND DETECTED:",
        msg
    );


    const attachment =
        getCurrentAttachment();


    if (!attachment) {

        return (
            "📷 I don't currently have an image attached.\n\n" +
            "Please upload an image first."
        );

    }


    if (attachment.type !== "image") {

        return (
            "📎 The current attachment isn't an image."
        );

    }


    console.log(
        "🖼️ Current image:",
        attachment.name
    );


    console.log(
        "🖼️ Image file:",
        attachment.file
    );


    /*
    ======================================
    OCR
    ======================================
    */

    if (
        msg.includes("read text") ||
        msg.includes("extract text") ||
        msg.includes("what does the image say") ||
        msg.includes("what does this say") ||
        msg.includes("text in the image")
    ) {

        if (
            typeof window.readImageText ===
            "function"
        ) {

            try {

                const result =
                    await window.readImageText(
                        attachment.file ||
                        attachment.data
                    );


                if (
                    result &&
                    String(result).trim()
                ) {

                    return result;

                }

            }

            catch (error) {

                console.error(
                    "❌ OCR ERROR:",
                    error
                );

            }

        }


        return (
            "📝 I couldn't read text from this image."
        );

    }


    /*
    ======================================
    IMAGE ANALYSIS
    ======================================
    */

    if (
        msg.includes("describe") ||
        msg.includes("what is in") ||
        msg.includes("analyze")
    ) {

        console.log(
            "👀 Starting image analysis..."
        );


        if (
            typeof window.analyzeImage ===
            "function"
        ) {

            try {

                const result =
                    await window.analyzeImage(
                        attachment.file ||
                        attachment.data
                    );


                console.log(
                    "👀 Image analysis result:",
                    result
                );


                if (
                    result &&
                    String(result).trim()
                ) {

                    return String(result);

                }


                return (
                    "👀 I received the image, but the image analysis engine did not return a description."
                );

            }

            catch (error) {

                console.error(
                    "❌ IMAGE ANALYSIS ERROR:",
                    error
                );


                return (
                    "⚠️ I received your image, but something went wrong while analyzing it."
                );

            }

        }


        console.error(
            "❌ analyzeImage is not a function"
        );


        return (
            "👀 I received your image, but the image analysis function is not connected yet."
        );

    }


    return (
        "📷 I have your image ready.\n\n" +
        "You can ask me:\n" +
        "• Describe the image\n" +
        "• Read the text\n" +
        "• Analyze the image"
    );

}


    // ======================================
    // OCR
    // ======================================

    if (
        msg.includes("read text") ||
        msg.includes("extract text") ||
        msg.includes("what does the image say") ||
        msg.includes("what does this say") ||
        msg.includes("text in the image")
    ) {

        if (
            typeof window.readImageText === "function"
        ) {

            return await readImageText(
                attachment.data
            );

        }

        return (
            "📝 The image is attached, but OCR is not connected."
        );

    }


    // ======================================
    // IMAGE ANALYSIS
    // ======================================

    if (
        msg.includes("describe") ||
        msg.includes("what is in") ||
        msg.includes("analyze")
    ) {

        if (
            typeof window.analyzeImage === "function"
        ) {

            return await analyzeImage(
                attachment.data
            );

        }

        return (
            "👀 I have the image, but image analysis is not connected yet."
        );

    }


    return (
        "📷 I have your image ready.\n\n" +
        "You can ask me:\n\n" +
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


    if (attachment.type !== "file") {

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
        "📄 I have your file, but the file-reading engine is not connected yet."
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
        function(file, index) {

            reply +=
                `${index + 1}. ${file.name} (${file.type})\n`;

        }
    );


    return reply;

}


// ==========================================
// GLOBAL ACCESS
// ==========================================

window.smartAIReply =
    smartAIReply;

window.getCurrentAttachment =
    getCurrentAttachment;

window.handleImageCommand =
    handleImageCommand;

window.handleFileCommand =
    handleFileCommand;

window.getUploadList =
    getUploadList;


// ==========================================
// READY
// ==========================================

console.log(
    "✅ smartAI.js ready"
);
