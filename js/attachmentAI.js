"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   attachmentAI.js
   Version 4.0
   Attachment Processing Engine

   RESPONSIBILITIES:
   - Image OCR
   - Image analysis
   - TXT reading
   - PDF reading
   - DOCX reading
   - CSV reading
   - JSON reading
   - Code/text files
   - Safe attachment processing

   IMPORTANT:
   This file does NOT control:
   - sendBtn
   - userInput
   - file pickers
   - chat message sending

   chat.js controls those.
========================================== */

console.log("📎 attachmentAI.js loading...");


/* ==========================================
   OCR STATE
========================================== */

let ocrWorker = null;


/* ==========================================
   GET ATTACHMENT DATA
========================================== */

function getAttachmentFile(attachment) {

    if (!attachment) {
        return null;
    }


    /*
       New chat.js format:

       {
           type: "file",
           name: "...",
           mimeType: "...",
           size: ...,
           file: File
       }
    */

    if (
    typeof File !== "undefined" &&
    attachment.file instanceof File
) {
    return attachment.file;
}

if (
    typeof File !== "undefined" &&
    attachment instanceof File
) {
    return attachment;
}


    return null;

}


/* ==========================================
   IMAGE OCR
========================================== */

async function readImageText(imageSource) {

    try {

        if (
            typeof Tesseract ===
            "undefined"
        ) {

            return (
                "⚠️ OCR engine is not available.\n\n" +
                "Please make sure Tesseract.js is loaded."
            );

        }


        if (!imageSource) {

            return (
                "📷 I couldn't find an image to read."
            );

        }


        console.log(
            "📝 Starting image OCR..."
        );


        /*
           Use the browser's global
           Tesseract.recognize() API.

           This avoids creating a second
           worker manually.
        */

        const result =
            await Tesseract.recognize(
                imageSource,
                "eng",
                {
                    logger: function (info) {

                        console.log(
                            "OCR:",
                            info
                        );

                    }
                }
            );


        const text =
            result &&
            result.data &&
            result.data.text
                ? result.data.text.trim()
                : "";


        if (!text) {

            return (
                "📝 I couldn't find readable text in this image."
            );

        }


        return (
            "📝 Text extracted from the image:\n\n" +
            text
        );

    }

    catch (error) {

        console.error(
            "❌ Image OCR error:",
            error
        );


        return (
            "⚠️ I couldn't extract text from this image."
        );

    }

}

/* ==========================================
   IMAGE TO BASE64
========================================== */

function imageToBase64(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (!file) {

                reject(
                    new Error(
                        "No image file provided"
                    )
                );

                return;

            }


            /*
               If already a data URL
            */

            if (
                typeof file === "string" &&
                file.startsWith("data:image/")
            ) {

                resolve(file);

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Failed to read image"
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* ==========================================
   SEND IMAGE TO ONLINE AI
========================================== */

async function analyzeImageOnline(
    imageSource,
    question
) {

    const endpoint =
        "https://ai-life-assistant-backend.vercel.app/api/ai";


    try {

        console.log(
            "🌐 Preparing image for Vision AI..."
        );


        const imageData =
            await imageToBase64(
                imageSource
            );


        console.log(
            "🖼️ Image converted successfully"
        );


        const response =
            await fetch(
                endpoint,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:
                        JSON.stringify({

                            message:
                                question ||
                                "Describe this image.",

                            image:
                                imageData

                        })

                }
            );


        let data = {};


        try {

            data =
                await response.json();

        }

        catch (error) {

            console.error(
                "❌ Invalid Vision response:",
                error
            );

        }


        if (!response.ok) {

            console.error(
                "❌ Vision backend error:",
                response.status,
                data
            );


            return null;

        }


        if (
            data &&
            data.success === true &&
            data.reply
        ) {

            console.log(
                "✅ Vision AI responded"
            );


            return String(
                data.reply
            ).trim();

        }


        return null;

    }

    catch (error) {

        console.error(
            "❌ Vision AI error:",
            error
        );


        return null;

    }

}
/* ==========================================
   IMAGE ANALYSIS
========================================== */

async function analyzeImage(
    imageSource,
    question
) {

    try {

        if (!imageSource) {

            return (
                "📷 I couldn't find an image to analyze."
            );

        }


        console.log(
            "👀 Sending image to Vision AI..."
        );


        const result =
            await analyzeImageOnline(
                imageSource,
                question ||
                "Describe this image."
            );


        if (result) {

            return result;

        }


        return (
            "⚠️ I couldn't analyze this image right now.\n\n" +
            "Please check your internet connection and try again."
        );

    }

    catch (error) {

        console.error(
            "❌ Image analysis error:",
            error
        );


        return (
            "⚠️ Something went wrong while analyzing this image."
        );

    }

}

/* ==========================================
   TEXT FILE
========================================== */

async function readTextFile(file) {

    try {

        const text =
            await file.text();


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

    catch (error) {

        console.error(
            "❌ Text file error:",
            error
        );


        return (
            "⚠️ I couldn't read this text file."
        );

    }

}


/* ==========================================
   JSON FILE
========================================== */

async function readJSONFile(file) {

    try {

        const text =
            await file.text();


        if (!text.trim()) {

            return (
                "📄 The JSON file appears to be empty."
            );

        }


        const data =
            JSON.parse(text);


        return (
            "📄 JSON file contents:\n\n" +
            JSON.stringify(
                data,
                null,
                2
            )
        );

    }

    catch (error) {

        console.error(
            "❌ JSON file error:",
            error
        );


        return (
            "⚠️ I couldn't read this JSON file. " +
            "It may contain invalid JSON."
        );

    }

}


/* ==========================================
   CSV FILE
========================================== */

async function readCSVFile(file) {

    try {

        const text =
            await file.text();


        if (!text.trim()) {

            return (
                "📄 The CSV file appears to be empty."
            );

        }


        return (
            "📊 CSV file contents:\n\n" +
            text
        );

    }

    catch (error) {

        console.error(
            "❌ CSV file error:",
            error
        );


        return (
            "⚠️ I couldn't read this CSV file."
        );

    }

}


/* ==========================================
   DOCX FILE
========================================== */

async function readDOCXFile(file) {

    try {

        if (
            typeof mammoth ===
            "undefined"
        ) {

            return (
                "⚠️ DOCX reader library is not loaded."
            );

        }


        const buffer =
            await file.arrayBuffer();


        const result =
            await mammoth.extractRawText({
                arrayBuffer: buffer
            });


        const text =
            result &&
            result.value
                ? result.value.trim()
                : "";


        if (!text) {

            return (
                "📄 The Word document appears to be empty."
            );

        }


        return (
            "📄 Word Document contents:\n\n" +
            text
        );

    }

    catch (error) {

        console.error(
            "❌ DOCX error:",
            error
        );


        return (
            "⚠️ I couldn't read this Word document."
        );

    }

}


/* ==========================================
   PDF FILE
========================================== */

async function readPDFFile(file) {

    try {

        /*
           pdf.js 4.x is loaded as an ES module
           in your HTML.

           Because the module is not automatically
           exposed as window.pdfjsLib, we check for
           a globally available PDF library first.
        */

        const pdfjs =
            window.pdfjsLib ||
            window.pdfjs;


        if (!pdfjs) {

            return (
                "⚠️ PDF reader is not connected yet.\n\n" +
                "Please make sure PDF.js is loaded correctly."
            );

        }


        const buffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjs.getDocument({
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
                        item =>
                            item.str || ""
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
                "📄 I couldn't find readable text in this PDF."
            );

        }


        return (
            "📄 PDF contents:\n\n" +
            fullText
        );

    }

    catch (error) {

        console.error(
            "❌ PDF error:",
            error
        );


        return (
            "⚠️ I couldn't read this PDF."
        );

    }

}


/* ==========================================
   FILE TYPE DETECTION
========================================== */

function getFileExtension(file) {

    if (
        !file ||
        !file.name
    ) {

        return "";

    }


    const parts =
        file.name
            .toLowerCase()
            .split(".");


    return parts.length > 1
        ? parts.pop()
        : "";

}


/* ==========================================
   ANALYZE FILE
========================================== */

async function analyzeFile(attachment) {

    try {

        const file =
            getAttachmentFile(
                attachment
            );


        if (!file) {

            return (
                "📄 I couldn't access the attached file."
            );

        }


        console.log(
            "📄 Analyzing file:",
            file.name
        );


        const extension =
            getFileExtension(file);


        const mime =
            String(
                file.type || ""
            ).toLowerCase();


        /* ======================================
           TXT / MARKDOWN / CODE
        ====================================== */

        if (
            extension === "txt" ||
            extension === "md" ||
            extension === "js" ||
            extension === "css" ||
            extension === "html" ||
            extension === "htm"
        ) {

            return await readTextFile(
                file
            );

        }


        /* ======================================
           JSON
        ====================================== */

        if (
            extension === "json" ||
            mime.includes("json")
        ) {

            return await readJSONFile(
                file
            );

        }


        /* ======================================
           CSV
        ====================================== */

        if (
            extension === "csv" ||
            mime.includes("csv")
        ) {

            return await readCSVFile(
                file
            );

        }


        /* ======================================
           DOCX
        ====================================== */

        if (
            extension === "docx" ||
            mime.includes(
                "wordprocessingml"
            )
        ) {

            return await readDOCXFile(
                file
            );

        }


        /* ======================================
           PDF
        ====================================== */

        if (
            extension === "pdf" ||
            mime.includes("pdf")
        ) {

            return await readPDFFile(
                file
            );

        }


        /* ======================================
           IMAGE
        ====================================== */

        if (
            mime.startsWith("image/")
        ) {

            return (
                "🖼️ This is an image file.\n\n" +
                "Ask me to read the text from the image."
            );

        }


        /* ======================================
           UNKNOWN
        ====================================== */

        return (
            "📎 I received " +
            file.name +
            ", but I don't currently support reading this file type."
        );

    }

    catch (error) {

        console.error(
            "❌ File analysis error:",
            error
        );


        return (
            "⚠️ Something went wrong while reading the file."
        );

    }

}


/* ==========================================
   PROCESS CURRENT ATTACHMENT
========================================== */

async function analyzeCurrentAttachment() {

    const attachment =
        window.aiAttachment;


    if (!attachment) {

        return (
            "📎 There is no attachment available."
        );

    }


    if (
        attachment.type === "image"
    ) {

        return (
            "🖼️ I have your image.\n\n" +
            "You can ask me to read the text from it."
        );

    }


    if (
        attachment.type === "file"
    ) {

        return await analyzeFile(
            attachment
        );

    }


    /*
       Support raw File objects
       from older versions.
    */

    if (
        attachment instanceof File
    ) {

        return await analyzeFile(
            attachment
        );

    }


    return (
        "📎 I don't recognize the current attachment."
    );

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.readImageText =
    readImageText;

window.analyzeImage =
    analyzeImage;
window.imageToBase64 =
    imageToBase64;

window.analyzeImageOnline =
    analyzeImageOnline;
window.analyzeFile =
    analyzeFile;

window.readDOCXFile =
    readDOCXFile;

window.readPDFFile =
    readPDFFile;

window.readTextFile =
    readTextFile;

window.readJSONFile =
    readJSONFile;

window.readCSVFile =
    readCSVFile;

window.analyzeCurrentAttachment =
    analyzeCurrentAttachment;

window.getFileExtension =
    getFileExtension;


/* ==========================================
   READY
========================================== */

console.log(
    "✅ attachmentAI.js loaded successfully"
);
