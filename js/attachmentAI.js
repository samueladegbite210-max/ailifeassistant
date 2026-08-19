// ==========================================
// AI LIFE ASSISTANT
// attachmentAI.js
// Version 2.0
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

async function readImageText(imageData) {

    try {

        if (!imageData) {

            return "⚠️ No image was provided.";

        }


        // Check Tesseract

        if (typeof Tesseract === "undefined") {

            console.error(
                "❌ Tesseract.js is not available."
            );

            return (
                "⚠️ OCR is not loaded.\n\n" +
                "Please make sure Tesseract.js is loaded."
            );

        }


        // Create worker once

        if (!ocrWorker) {

            console.log("🧠 Creating OCR worker...");

            ocrWorker =
                await Tesseract.createWorker("eng");

        }


        console.log(
            "📝 Starting image OCR..."
        );


        // Recognize image

        const result =
            await ocrWorker.recognize(imageData);


        const text =
            result &&
            result.data &&
            result.data.text
                ? result.data.text.trim()
                : "";


        console.log(
            "📝 OCR result:",
            text
        );


        // No text found

        if (!text) {

            return (
                "📝 I couldn't find readable text " +
                "in this image.\n\n" +
                "Try uploading a clearer image with " +
                "better lighting."
            );

        }


        // Return extracted text

        return (
            "📝 Text found in the image:\n\n" +
            text
        );

    }

    catch (error) {

        console.error(
            "❌ OCR Error:",
            error
        );


        return (
            "⚠️ I couldn't read the text from that image.\n\n" +
            "Please try a clearer image."
        );

    }

}


// ==========================================
// IMAGE ANALYSIS
// ==========================================

async function analyzeImage(imageData) {

    if (!imageData) {

        return "⚠️ No image data was provided.";

    }


    /*
     * This function currently confirms that
     * the image exists.
     *
     * Real AI vision analysis can be connected
     * here later.
     */

    return (
        "👀 I have your image.\n\n" +
        "Image analysis is not connected yet.\n\n" +
        "However, I can already read text from " +
        "the image using OCR."
    );

}


// ==========================================
// FILE ANALYSIS
// ==========================================

async function analyzeFile(file) {

    try {

        if (!file) {

            return "⚠️ No file was provided.";

        }


        console.log(
            "📄 Reading file:",
            file.name
        );


        // ==================================
        // TEXT FILE
        // ==================================

        if (
            file.type === "text/plain" ||
            file.name.toLowerCase().endsWith(".txt")
        ) {

            const text =
                await readTextFile(file);


            if (!text.trim()) {

                return (
                    "📄 The text file appears to be empty."
                );

            }


            return (
                "📄 File contents:\n\n" +
                text
            );

        }


        // ==================================
        // PDF
        // ==================================

        if (
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        ) {

            return await readPDFFile(file);

        }


        // ==================================
        // DOCX
        // ==================================

        if (
            file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.name.toLowerCase().endsWith(".docx")
        ) {

            return await readDOCXFile(file);

        }


        // ==================================
        // IMAGE
        // ==================================

        if (file.type.startsWith("image/")) {

            const imageData =
                await fileToDataURL(file);


            return await readImageText(
                imageData
            );

        }


        // ==================================
        // UNSUPPORTED FILE
        // ==================================

        return (
            "📄 I received **" +
            file.name +
            "** successfully.\n\n" +
            "I don't currently support reading this " +
            "file type."
        );

    }

    catch (error) {

        console.error(
            "❌ File analysis error:",
            error
        );


        return (
            "⚠️ I couldn't read that file.\n\n" +
            "Please check the file and try again."
        );

    }

}


// ==========================================
// READ TEXT FILE
// ==========================================

async function readTextFile(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    resolve(
                        event.target.result || ""
                    );

                };


            reader.onerror =
                function(error) {

                    reject(error);

                };


            reader.readAsText(file);

        }
    );

}


// ==========================================
// FILE → DATA URL
// ==========================================

async function fileToDataURL(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    resolve(
                        event.target.result
                    );

                };


            reader.onerror =
                function(error) {

                    reject(error);

                };


            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// READ PDF
// ==========================================

async function readPDFFile(file) {

    try {

        if (
            typeof pdfjsLib === "undefined"
        ) {

            return (
                "⚠️ PDF reader is not loaded.\n\n" +
                "Please make sure PDF.js is loaded."
            );

        }


        const buffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjsLib.getDocument({
                data: buffer
            }).promise;


        let fullText = "";


        console.log(
            "📄 PDF pages:",
            pdf.numPages
        );


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(pageNumber);


            const content =
                await page.getTextContent();


            const pageText =
                content.items
                    .map(
                        function(item) {
                            return item.str;
                        }
                    )
                    .join(" ");


            fullText +=
                "\n\n--- Page " +
                pageNumber +
                " ---\n\n" +
                pageText;

        }


        fullText =
            fullText.trim();


        if (!fullText) {

            return (
                "📄 I opened the PDF, but I couldn't " +
                "find selectable text in it.\n\n" +
                "If the PDF contains scanned images, " +
                "OCR will be needed."
            );

        }


        return (
            "📄 PDF contents:\n\n" +
            fullText
        );

    }

    catch (error) {

        console.error(
            "❌ PDF reading error:",
            error
        );


        return (
            "⚠️ I couldn't read this PDF."
        );

    }

}


// ==========================================
// READ DOCX
// ==========================================

async function readDOCXFile(file) {

    try {

        if (
            typeof mammoth === "undefined"
        ) {

            return (
                "⚠️ DOCX reader is not loaded.\n\n" +
                "Please make sure Mammoth.js is loaded."
            );

        }


        const buffer =
            await file.arrayBuffer();


        const result =
            await mammoth.extractRawText({
                arrayBuffer: buffer
            });


        const text =
            result.value
                ? result.value.trim()
                : "";


        if (!text) {

            return (
                "📄 The Word document appears " +
                "to contain no readable text."
            );

        }


        return (
            "📄 Word document contents:\n\n" +
            text
        );

    }

    catch (error) {

        console.error(
            "❌ DOCX reading error:",
            error
        );


        return (
            "⚠️ I couldn't read this Word document."
        );

    }

}


// ==========================================
// FORMAT FILE SIZE
// ==========================================

function formatAttachmentSize(bytes) {

    if (
        !bytes ||
        bytes <= 0
    ) {

        return "0 Bytes";

    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );


    const size =
        bytes /
        Math.pow(
            1024,
            index
        );


    return (
        size.toFixed(
            index === 0 ? 0 : 1
        ) +
        " " +
        units[index]
    );

}


// ==========================================
// STATUS
// ==========================================

function attachmentAIStatus() {

    return {

        loaded: true,

        imageOCR:
            typeof readImageText === "function",

        imageAnalysis:
            typeof analyzeImage === "function",

        fileAnalysis:
            typeof analyzeFile === "function",

        pdfReader:
            typeof pdfjsLib !== "undefined",

        docxReader:
            typeof mammoth !== "undefined"

    };

}


// ==========================================
// DEBUG
// ==========================================

console.log(
    "✅ Attachment AI ready."
);

console.log(
    "📊 Attachment status:",
    attachmentAIStatus()
);
