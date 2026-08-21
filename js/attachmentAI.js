// ==========================================
// AI LIFE ASSISTANT
// attachmentAI.js
// Version 3.0
// Image OCR + File Processing
// ==========================================

"use strict";

console.log("📎 attachmentAI.js loaded");


// ==========================================
// OCR WORKER
// ==========================================

let ocrWorker = null;


// ==========================================
// IMAGE OCR
// ==========================================
// ==========================================
// DOCX
// ==========================================

async function readDOCXFile(file) {
    try {
        if (typeof mammoth === "undefined") {
            return "⚠️ DOCX reader library (Mammoth.js) is not loaded.";
        }

        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        
        const text = result && result.value ? result.value.trim() : "";

        if (!text) {
            return "📄 The Word document appears to be empty.";
        }

        return "📄 Word Document contents:\n\n" + text;

    } catch (error) {
        console.error("❌ DOCX error:", error);
        return "⚠️ I couldn't read this Word document.";
    }
}


// ==========================================
// HANDLE UPLOADS FROM INPUT FIELDS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const imagePicker = document.getElementById("imagePicker");
    const cameraPicker = document.getElementById("cameraPicker");
    const filePicker = document.getElementById("filePicker");

    async function processSelectedFile(file) {
        if (!file) return;

        console.log("📎 Processing upload:", file.name);
        
        // Save globally so smartAI.js can access it
        window.aiAttachment = file;
        window.uploadedFiles = window.uploadedFiles || [];
        window.uploadedFiles.push(file);

        // Alert user within the UI chat stream
        if (typeof window.sendMessage === "function") {
            // Automatically prompt the AI with a helper parsing statement
            const resultMsg = await analyzeFile(file);
            if (typeof window.addMessage === "function") {
                window.addMessage("ai", resultMsg);
            }
        }
    }

    if (imagePicker) {
        imagePicker.addEventListener("change", (e) => processSelectedFile(e.target.files[0]));
    }
    if (cameraPicker) {
        cameraPicker.addEventListener("change", (e) => processSelectedFile(e.target.files[0]));
    }
    if (filePicker) {
        filePicker.addEventListener("change", (e) => processSelectedFile(e.target.files[0]));
    }
});

// Export globally
window.analyzeFile = analyzeFile;
window.analyzeImage = analyzeImage;
window.readImageText = readImageText;
