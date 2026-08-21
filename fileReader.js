// ==========================================
// AI LIFE ASSISTANT
// fileReader.js
// Document + OCR Reader
// ==========================================

"use strict";

console.log("📚 fileReader.js loaded");


// ==========================================
// READ IMAGE TEXT
// ==========================================

async function readImageText(imageData) {

    try {

        if (
            typeof Tesseract === "undefined"
        ) {

            return (
                "📝 OCR is not connected.\n\n" +
                "Please connect Tesseract.js to enable image text recognition."
            );

        }


        const result =
            await Tesseract.recognize(
                imageData,
                "eng"
            );


        const text =
            result.data.text.trim();


        if (!text) {

            return (
                "📝 I couldn't find readable text in this image."
            );

        }


        return (
            "📝 Text found in the image:\n\n" +
            text
        );

    }

    catch (error) {

        console.error(
            "OCR error:",
            error
        );


        return (
            "⚠️ I couldn't extract the text from this image."
        );

    }

}


// ==========================================
// ANALYZE IMAGE
// ==========================================

async function analyzeImage(imageData) {

    // For now, use OCR as the browser-side
    // image analysis fallback.

    const text =
        await readImageText(imageData);


    return (
        "👀 I checked the image.\n\n" +
        text
    );

}


// ==========================================
// ANALYZE FILE
// ==========================================

async function analyzeFile(file) {

    if (!file) {

        return (
            "📂 No file was provided."
        );

    }


    const name =
        file.name.toLowerCase();


    // ==================================
    // TEXT
    // ==================================

    if (
        file.type === "text/plain" ||
        name.endsWith(".txt") ||
        name.endsWith(".csv") ||
        name.endsWith(".json")
    ) {

        return await readTextFile(file);

    }


    // ==================================
    // PDF
    // ==================================

    if (
        file.type === "application/pdf" ||
        name.endsWith(".pdf")
    ) {

        return await readPDF(file);

    }


    // ==================================
    // DOCX
    // ==================================

    if (
        file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        name.endsWith(".docx")
    ) {

        return await readDOCX(file);

    }


    return (
        `📄 I received "${file.name}".\n\n` +
        "I currently support TXT, CSV, JSON, PDF and DOCX files."
    );

}


// ==========================================
// READ TEXT FILE
// ==========================================

async function readTextFile(file) {

    try {

        const text =
            await file.text();


        if (!text.trim()) {

            return (
                "📄 The file appears to be empty."
            );

        }


        return (
            `📄 Contents of ${file.name}:\n\n` +
            text
        );

    }

    catch (error) {

        console.error(
            "Text file error:",
            error
        );


        return (
            "⚠️ I couldn't read this text file."
        );

    }

}


// ==========================================
// READ PDF
// ==========================================

async function readPDF(file) {

    try {

        if (
            typeof pdfjsLib === "undefined"
        ) {

            return (
                "📕 PDF reader is not connected yet."
            );

        }


        const buffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjsLib.getDocument({
                data: buffer
            }).promise;


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
                        item => item.str
                    )
                    .join(" ");


            fullText +=
                `\n\n--- Page ${pageNumber} ---\n\n` +
                pageText;

        }


        fullText =
            fullText.trim();


        if (!fullText) {

            return (
                "📕 I opened the PDF, but I couldn't find selectable text in it.\n\n" +
                "It may be a scanned/image-only PDF."
            );

        }


        return (
            `📕 Contents of ${file.name}:\n\n` +
            fullText
        );

    }

    catch (error) {

        console.error(
            "PDF error:",
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

async function readDOCX(file) {

    try {

        if (
            typeof mammoth === "undefined"
        ) {

            return (
                "📘 DOCX reader is not connected yet."
            );

        }


        const buffer =
            await file.arrayBuffer();


        const result =
            await mammoth.extractRawText({
                arrayBuffer: buffer
            });


        const text =
            result.value.trim();


        if (!text) {

            return (
                "📘 The Word document appears to contain no readable text."
            );

        }


        return (
            `📘 Contents of ${file.name}:\n\n` +
            text
        );

    }

    catch (error) {

        console.error(
            "DOCX error:",
            error
        );


        return (
            "⚠️ I couldn't read this Word document."
        );

    }

}
