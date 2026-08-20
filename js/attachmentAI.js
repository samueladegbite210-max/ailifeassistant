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

async function readImageText(imageData) {

    try {

        if (!imageData) {

            return "⚠️ No image was provided.";

        }


        if (
            typeof Tesseract ===
            "undefined"
        ) {

            console.error(
                "❌ Tesseract.js is not available."
            );


            return (
                "⚠️ OCR is not loaded.\n\n" +
                "Please make sure Tesseract.js is loaded."
            );

        }


        if (!ocrWorker) {

            console.log(
                "🧠 Creating OCR worker..."
            );


            ocrWorker =
                await Tesseract.createWorker(
                    "eng"
                );

        }


        console.log(
            "📝 Starting image OCR..."
        );


        const result =
            await ocrWorker.recognize(
                imageData
            );


        const text =
            result &&
            result.data &&
            result.data.text
                ? result.data.text.trim()
                : "";


        if (!text) {

            return (
                "📝 I couldn't find readable text in this image.\n\n" +
                "Try uploading a clearer image."
            );

        }


        return (
            "📝 Text found in the image:\n\n" +
            text
        );


    } catch (error) {

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

async function analyzeImage(
    imageData
) {

    if (!imageData) {

        return (
            "⚠️ No image data was provided."
        );

    }


    return (
        "👀 I have your image.\n\n" +
        "Image analysis is not connected yet.\n\n" +
        "However, I can already read text from the image using OCR."
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


        const name =
            file.name.toLowerCase();


        // ==================================
        // TXT
        // ==================================

        if (

            file.type ===
                "text/plain" ||

            name.endsWith(".txt") ||

            name.endsWith(".csv") ||

            name.endsWith(".json") ||

            name.endsWith(".js") ||

            name.endsWith(".css") ||

            name.endsWith(".html") ||

            name.endsWith(".md")

        ) {

            const text =
                await readTextFile(file);


            if (!text.trim()) {

                return (
                    "📄 The file appears to be empty."
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

            file.type ===
                "application/pdf" ||

            name.endsWith(".pdf")

        ) {

            return await readPDFFile(
                file
            );

        }


        // ==================================
        // DOCX
        // ==================================

        if (

            file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||

            name.endsWith(".docx")

        ) {

            return await readDOCXFile(
                file
            );

        }


        // ==================================
        // IMAGE
        // ==================================

        if (
            file.type &&
            file.type.startsWith("image/")
        ) {

            const imageData =
                await fileToDataURL(
                    file
                );


            return await readImageText(
                imageData
            );

        }


        return (
            `📄 I received "${file.name}" successfully.\n\n` +
            "I don't currently support reading this file type."
        );


    } catch (error) {

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
// READ TEXT
// ==========================================

function readTextFile(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    resolve(
                        event.target.result || ""
                    );

                };


            reader.onerror =
                error => {

                    reject(error);

                };


            reader.readAsText(file);

        }
    );

}


// ==========================================
// FILE TO DATA URL
// ==========================================

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    resolve(
                        event.target.result
                    );

                };


            reader.onerror =
                error => {

                    reject(error);

                };


            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// PDF
// ==========================================

async function readPDFFile(file) {

    try {

        if (
            typeof pdfjsLib ===
            "undefined"
        ) {

            return (
                "⚠️ PDF reader is not loaded yet."
            );

        }


        const buffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjsLib
                .getDocument({
                    data: buffer
                })
                .promise;


        let fullText = "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(
                    pageNumber
                );


            const content =
                await page.getTextContent();


            const pageText =
                content.items
                    .map(
                        item =>
                            item.str
                    )
                    .join(" ");


            fullText +=
                `\n\n--- Page ${pageNumber} ---\n\n${pageText}`;

        }


        fullText =
            fullText.trim();


        if (!fullText) {

            return (
                "📄 I opened the PDF, but couldn't find selectable text.\n\n" +
                "Scanned PDFs will need OCR."
            );

        }


        return (
            "📄 PDF contents:\n\n" +
            fullText
        );


    } catch (error) {

        console.error(
            "❌ PDF error:",
            error
        );


        return (
            "⚠️ I couldn't read this PDF."
        );

    }

}


// ==========================================
// DOCX
// ==========================================

async function readDOCXFile(file) {

    try {

        if (
            typeof mammoth ===
            "undefined"
        ) {

            return (
                "⚠️ DOCX reader is not loaded."
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
                "📄 The Word document contains no readable text."
            );

        }


        return (
            "📄 Word document contents:\n\n" +
            text
        );


    } catch (error) {

        console.error(
            "❌ DOCX error:",
            error
        );


        return (
            "⚠️ I couldn't read this Word document."
        );

    }

}


// ==========================================
// FILE SIZE
// ==========================================

function formatAttachmentSize(
    bytes
) {

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
            typeof readImageText ===
            "function",

        imageAnalysis:
            typeof analyzeImage ===
            "function",

        fileAnalysis:
            typeof analyzeFile ===
            "function",

        pdfReader:
            typeof pdfjsLib !==
            "undefined",

        docxReader:
            typeof mammoth !==
            "undefined"

    };

}


// ==========================================
// DEBUG
// ==========================================

console.log(
    "📊 Attachment status:",
    attachmentAIStatus()
);

console.log(
    "✅ Attachment AI ready."
);
