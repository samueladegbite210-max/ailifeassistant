// ==========================================
// AI Life Assistant
// uploadBrain.js
// Version 1.1
// Upload Command Brain
// ==========================================

"use strict";

console.log("🧠 Upload Brain 1.1 Loaded");

// ==========================================
// UPLOAD REPLY
// ==========================================

function uploadReply(rawMsg) {

    const msg = String(rawMsg || "")
        .toLowerCase()
        .trim();

    if (!msg) {
        return null;
    }

    // Always access uploaded files through window
    const files = window.uploadedFiles || [];

    if (!files.length) {
        return null;
    }

    // chat.js uses unshift(), so newest file is index 0
    const lastFile = files[0];

    // ======================================
    // IMAGE COMMANDS
    // ======================================

    if (lastFile.type === "image") {

        if (msg.includes("describe")) {

            return "🖼️ I have your image. Image description is not connected yet.";
        }

        if (
            msg.includes("read text") ||
            msg.includes("extract text") ||
            msg.includes("text in")
        ) {

            return "📝 I can use OCR to read text from your uploaded image.";
        }

        if (msg.includes("analyze")) {

            return "🔍 I have your image ready for analysis.";
        }

        if (msg.includes("question")) {

            return "❓ Ask me a question about the uploaded image.";
        }
    }

    // ======================================
    // FILE COMMANDS
    // ======================================

    if (lastFile.type === "file") {

        if (msg.includes("summarize")) {

            return "📑 I have your file ready for summarization.";
        }

        if (msg.includes("explain")) {

            return "🧠 I have your file ready to explain.";
        }

        if (
            msg.includes("important") ||
            msg.includes("important information")
        ) {

            return "🔍 I can look for important information in your uploaded file.";
        }

        if (msg.includes("question")) {

            return "❓ Ask me a question about the uploaded file.";
        }
    }

    return null;
}

console.log("✅ Upload Brain ready");
