// ==========================================
// AI LIFE ASSISTANT
// smartAI.js
// Version 6.1 (Fixed)
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

async function smartAIReply(rawMsg) {

    try {
        const original = String(rawMsg || "").trim();
        const msg = original.toLowerCase();

        if (!msg) return null;

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
            msg.includes("my uploaded files") ||
            msg.includes("list uploads")
        ) {
            return getUploadList();
        }

        // ==================================
        // NORMAL AI SYSTEM (priority order)
        // ==================================
        let answer;

        const modules = [
            () => typeof conversationReply === "function" && conversationReply(original),
            () => typeof memoryReply === "function" && memoryReply(original, msg),
            () => typeof profileReply === "function" && profileReply(original),
            () => typeof streakReply === "function" && streakReply(original),
            () => typeof learnUserReply === "function" && learnUserReply(original, msg),
            () => typeof knowledgeReply === "function" && knowledgeReply(original),
            () => typeof teacherReply === "function" && teacherReply(original),
            () => typeof quizReply === "function" && quizReply(original),
            () => typeof calculatorReply === "function" && calculatorReply(original),
            () => typeof dateTimeReply === "function" && dateTimeReply(original),
            () => typeof taskReply === "function" && taskReply(original, msg),
            () => typeof goalReply === "function" && goalReply(original, msg),
            () => typeof noteReply === "function" && noteReply(original, msg),
            () => typeof eventReply === "function" && eventReply(original, msg),
            () => typeof naturalReply === "function" && naturalReply(original),
            () => typeof foodReply === "function" && foodReply(original),
            () => typeof weatherReply === "function" && weatherReply(original),
            () => typeof aiBrainReply === "function" && aiBrainReply(original),
            () => typeof adviceReply === "function" && adviceReply(original),
            () => typeof internetReply === "function" && internetReply(original)
        ];

        for (const fn of modules) {
            answer = await fn();
            if (answer) return answer;
        }

        return "🤖 I couldn't find an answer yet. Try asking another question.";

    } catch (error) {
        console.error("❌ smartAIReply error:", error);
        return "⚠️ I ran into a problem while processing that.";
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
        msg.includes("read this") ||
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
    const attachment = getCurrentAttachment();

    if (!attachment) {
        return "📷 I don't currently have an image attached.\n\nPlease upload an image first.";
    }

    if (attachment.type !== "image") {
        return "📎 The current attachment isn't an image.\n\nPlease upload an image.";
    }

    // OCR
    if (
        msg.includes("read text") ||
        msg.includes("extract text") ||
        msg.includes("what does the image say") ||
        msg.includes("what does this say") ||
        msg.includes("text in the image")
    ) {
        if (typeof readImageText === "function") {
            return await readImageText(attachment.data);
        }
        return "📝 The image is attached, but the OCR engine isn't available.";
    }

    // Description / Analysis
    if (
        msg.includes("describe") ||
        msg.includes("what is in") ||
        msg.includes("analyze")
    ) {
        if (typeof analyzeImage === "function") {
            return await analyzeImage(attachment.data);
        }
        return "👀 I have the image, but the vision engine isn't connected yet.\n\nI can still try to read text from it.";
    }

    return "📷 I have your image ready.\n\nAsk me:\n\n📝 Read the text\n👀 Describe the image\n🔍 Analyze the image";
}

// ==========================================
// FILE HANDLER
// ==========================================

async function handleFileCommand(msg) {
    const attachment = getCurrentAttachment();

    if (!attachment) {
        return "📂 I don't currently have a file attached.\n\nPlease upload a file first.";
    }

    if (attachment.type !== "file") {
        return "📎 The current attachment isn't a document.\n\nPlease upload a file.";
    }

    if (typeof analyzeFile === "function") {
        return await analyzeFile(attachment.file);
    }

    return "📄 I have your file, but the document-reading engine isn't connected yet.";
}

// ==========================================
// UPLOAD LIST
// ==========================================

function getUploadList() {
    const files = window.uploadedFiles || [];

    if (!files.length) {
        return "📂 You haven't uploaded any files yet.";
    }

    let reply = "📂 Uploaded files:\n\n";

    files.forEach((file, index) => {
        reply += `${index + 1}. ${file.name} (${file.type})\n`;
    });

    return reply;
}
