
// ==========================================
// AI LIFE ASSISTANT
// smartAI.js
// Version 8.0
// Stable AI Controller
// ==========================================

"use strict";

console.log("🧠 smartAI.js loading...");


// ==========================================
// ATTACHMENT ACCESS
// ==========================================

function getCurrentAttachment() {

    return window.aiAttachment || null;

}

window.getCurrentAttachment = getCurrentAttachment;


// ==========================================
// SAFE MODULE EXECUTION
// ==========================================

async function runAIModule(name, fn) {

    try {

        if (typeof fn !== "function") {
            return null;
        }

        const result = await fn();

        if (
            result !== undefined &&
            result !== null &&
            String(result).trim() !== ""
        ) {

            console.log(
                "✅ AI module responded:",
                name
            );

            return result;
        }

    }

    catch (error) {

        console.error(
            "❌ AI module failed:",
            name,
            error
        );

    }

    return null;
}


// ==========================================
// MAIN AI CONTROLLER
// ==========================================

async function smartAIReply(rawMsg) {

    console.log(
        "🤖 smartAIReply received:",
        rawMsg
    );

    try {

        const original =
            String(rawMsg || "").trim();

        const msg =
            original.toLowerCase();


        if (!original) {

            return null;

        }


        // ==================================
        // IMAGE COMMANDS
        // ==================================

        if (isImageCommand(msg)) {

            console.log(
                "🖼️ Image command detected"
            );

            return await handleImageCommand(msg);

        }


        // ==================================
        // FILE COMMANDS
        // ==================================

        if (isFileCommand(msg)) {

            console.log(
                "📄 File command detected"
            );

            return await handleFileCommand(msg);

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
        // AI MODULES
        // ==========================================

        const modules = [

            [
                "conversationReply",
                () =>
                    typeof window.conversationReply === "function"
                        ? window.conversationReply(original, msg)
                        : null
            ],

            [
                "memoryReply",
                () =>
                    typeof window.memoryReply === "function"
                        ? window.memoryReply(original, msg)
                        : null
            ],

            [
                "profileReply",
                () =>
                    typeof window.profileReply === "function"
                        ? window.profileReply(original, msg)
                        : null
            ],

            [
                "streakReply",
                () =>
                    typeof window.streakReply === "function"
                        ? window.streakReply(original, msg)
                        : null
            ],

            [
                "learnUserReply",
                () =>
                    typeof window.learnUserReply === "function"
                        ? window.learnUserReply(original, msg)
                        : null
            ],

            [
                "knowledgeReply",
                () =>
                    typeof window.knowledgeReply === "function"
                        ? window.knowledgeReply(original, msg)
                        : null
            ],

            [
                "teacherReply",
                () =>
                    typeof window.teacherReply === "function"
                        ? window.teacherReply(original, msg)
                        : null
            ],

            [
                "quizReply",
                () =>
                    typeof window.quizReply === "function"
                        ? window.quizReply(original, msg)
                        : null
            ],

            [
                "calculatorReply",
                () =>
                    typeof window.calculatorReply === "function"
                        ? window.calculatorReply(original, msg)
                        : null
            ],

            [
                "dateTimeReply",
                () =>
                    typeof window.dateTimeReply === "function"
                        ? window.dateTimeReply(original, msg)
                        : null
            ],

            [
                "taskReply",
                () =>
                    typeof window.taskReply === "function"
                        ? window.taskReply(original, msg)
                        : null
            ],

            [
                "goalReply",
                () =>
                    typeof window.goalReply === "function"
                        ? window.goalReply(original, msg)
                        : null
            ],

            [
                "noteReply",
                () =>
                    typeof window.noteReply === "function"
                        ? window.noteReply(original, msg)
                        : null
            ],

            [
                "eventReply",
                () =>
                    typeof window.eventReply === "function"
                        ? window.eventReply(original, msg)
                        : null
            ],

            [
                "naturalReply",
                () =>
                    typeof window.naturalReply === "function"
                        ? window.naturalReply(original, msg)
                        : null
            ],

            [
                "foodReply",
                () =>
                    typeof window.foodReply === "function"
                        ? window.foodReply(original, msg)
                        : null
            ],

            [
                "weatherReply",
                () =>
                    typeof window.weatherReply === "function"
                        ? window.weatherReply(original, msg)
                        : null
            ],

            [
                "aiBrainReply",
                () =>
                    typeof window.aiBrainReply === "function"
                        ? window.aiBrainReply(original, msg)
                        : null
            ],

            [
                "adviceReply",
                () =>
                    typeof window.adviceReply === "function"
                        ? window.adviceReply(original, msg)
                        : null
            ],

            [
                "internetReply",
                () =>
                    typeof window.internetReply === "function"
                        ? window.internetReply(original, msg)
                        : null
            ]

        ];


               // ==================================
        // RUN MODULES
        // ==================================

        for (const [name, fn] of modules) {

            const answer = await runAIModule(name, fn);

            if (
                answer !== null &&
                answer !== undefined &&
                String(answer).trim() !== ""
            ) {

                console.log("🤖 Final response from:", name);
                return String(answer);
            }
        }

        // Fallback response if no module handles the text
        return "🤖 I hear you, but I'm not sure how to handle that request yet.";

    } catch (error) {
        console.error("❌ High-level smartAIReply error:", error);
        return "⚠️ An internal error occurred in the AI controller.";
    }
}

// Make the main controller available globally
window.smartAIReply = smartAIReply;


// ==========================================
// COMPLEMENTARY HELPER FUNCTIONS
// ==========================================

function isImageCommand(msg) {
    return msg.includes("image") || msg.includes("picture") || msg.includes("photo") || msg.includes("ocr");
}

function isFileCommand(msg) {
    return msg.includes("file") || msg.includes("document") || msg.includes("pdf") || msg.includes("docx");
}

async function handleImageCommand(msg) {
    const attachment = getCurrentAttachment();
    if (!attachment) return "🖼️ You mentioned an image command, but I don't see an image attached.";
    return `🖼️ Analyzing your attached image. (File: ${attachment.name || "Unknown"})`;
}

async function handleFileCommand(msg) {
    const attachment = getCurrentAttachment();
    if (!attachment) return "📄 You mentioned a file command, but no file is currently attached.";
    return `📄 Processing your file document. (File: ${attachment.name || "Unknown"})`;
}

function getUploadList() {
    const files = window.uploadedFiles || [];
    if (files.length === 0) {
        return "📁 You haven't uploaded any files during this chat session.";
    }
    
    let response = "📁 Here are your uploaded files:\n";
    files.forEach((file, index) => {
        response += `${index + 1}. ${file.name || "Unnamed File"} (${file.type || "unknown style"})\n`;
    });
    return response;
}



        // ==================================
        // FALLBACK
        // ==================================

        console.log(
            "ℹ️ No AI module responded."
        );


        return (
            "🤖 I couldn't find an answer yet.\n\n" +
            "Try asking me another question."
        );


    }

    catch (error) {

        console.error(
            "❌ smartAIReply ERROR:",
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


    if (attachment.type !== "image") {

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
        msg.includes("what does this say") ||
        msg.includes("text in the image")

    ) {

        if (
            typeof window.readImageText ===
            "function"
        ) {

            console.log(
                "📝 Sending image to OCR..."
            );

            return await window.readImageText(
                attachment.data
            );

        }


        return (
            "📝 The image is attached, but the OCR engine isn't available."
        );

    }


    // ==================================
    // IMAGE ANALYSIS
    // ==================================

    if (

        msg.includes("describe") ||
        msg.includes("what is in") ||
        msg.includes("analyze")

    ) {

        if (
            typeof window.analyzeImage ===
            "function"
        ) {

            return await window.analyzeImage(
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


    if (attachment.type !== "file") {

        return (
            "📎 The current attachment isn't a document.\n\n" +
            "Please upload a file."
        );

    }


    if (
        typeof window.analyzeFile ===
        "function"
    ) {

        console.log(
            "📄 Sending file to document reader..."
        );

        return await window.analyzeFile(
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
        function(file, index) {

            reply +=
                `${index + 1}. ${file.name} (${file.type})\n`;

        }
    );


    return reply;

}


// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.smartAIReply =
    smartAIReply;

window.isImageCommand =
    isImageCommand;

window.isFileCommand =
    isFileCommand;

window.handleImageCommand =
    handleImageCommand;

window.handleFileCommand =
    handleFileCommand;

window.getUploadList =
    getUploadList;


// ==========================================
// DEBUG STATUS
// ==========================================

console.log(
    "===================================="
);

console.log(
    "✅ smartAI.js ready"
);

console.log(
    "📌 smartAIReply:",
    typeof window.smartAIReply
);

console.log(
    "📌 handleImageCommand:",
    typeof window.handleImageCommand
);

console.log(
    "📌 handleFileCommand:",
    typeof window.handleFileCommand
);

console.log(
    "===================================="
);
