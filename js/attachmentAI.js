"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   attachmentAI.js
   Version 5.0
   Attachment Processing Engine

   RESPONSIBILITIES:
   - Image OCR
   - Online image analysis
   - TXT extraction
   - PDF extraction
   - DOCX extraction
   - CSV extraction
   - JSON extraction
   - Code/text extraction
   - Safe attachment processing

   IMPORTANT:
   This file does NOT control:
   - sendBtn
   - userInput
   - file pickers
   - chat message sending

   chat.js controls those.
========================================== */

console.log("📎 attachmentAI.js Version 5.0 loading...");


/* ==========================================
   GET ATTACHMENT FILE
========================================== */

function getAttachmentFile(attachment) {

    if (!attachment) {

        return null;

    }


    /* Attachment object */

    if (
        typeof File !== "undefined" &&
        attachment.file instanceof File
    ) {

        return attachment.file;

    }


    /* Raw File object */

    if (
        typeof File !== "undefined" &&
        attachment instanceof File
    ) {

        return attachment;

    }


    return null;

}


/* ==========================================
   GET FILE EXTENSION
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
   IMAGE OCR
========================================== */

async function readImageText(imageSource) {

    try {

        if (
            typeof Tesseract === "undefined"
        ) {

            return null;

        }


        if (!imageSource) {

            return null;

        }


        console.log(
            "📝 Starting image OCR..."
        );


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
            result?.data?.text
                ? result.data.text.trim()
                : "";


        return text || null;

    }

    catch (error) {

        console.error(
            "❌ Image OCR error:",
            error
        );


        return null;

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


            /* Already Base64 */

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
   ONLINE IMAGE ANALYSIS
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


        const response =
            await fetch(
                endpoint,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                question ||
                                "Describe this image clearly.",

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
            data?.success === true &&
            data?.reply
        ) {

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

            return null;

        }


        return await analyzeImageOnline(
            imageSource,
            question ||
            "Describe this image clearly."
        );

    }

    catch (error) {

        console.error(
            "❌ Image analysis error:",
            error
        );


        return null;

    }

}


/* ==========================================
   READ TEXT FILE
========================================== */

async function readTextFile(file) {

    try {

        const text =
            await file.text();


        return text.trim() || null;

    }

    catch (error) {

        console.error(
            "❌ Text file error:",
            error
        );


        return null;

    }

}


/* ==========================================
   READ JSON FILE
========================================== */

async function readJSONFile(file) {

    try {

        const text =
            await file.text();


        if (!text.trim()) {

            return null;

        }


        const data =
            JSON.parse(text);


        return JSON.stringify(
            data,
            null,
            2
        );

    }

    catch (error) {

        console.error(
            "❌ JSON file error:",
            error
        );


        return null;

    }

}


/* ==========================================
   READ CSV FILE
========================================== */

async function readCSVFile(file) {

    try {

        const text =
            await file.text();


        return text.trim() || null;

    }

    catch (error) {

        console.error(
            "❌ CSV file error:",
            error
        );


        return null;

    }

}


/* ==========================================
   READ DOCX FILE
========================================== */

async function readDOCXFile(file) {

    try {

        if (
            typeof mammoth === "undefined"
        ) {

            console.error(
                "❌ Mammoth.js not loaded"
            );


            return null;

        }


        const buffer =
            await file.arrayBuffer();


        const result =
            await mammoth.extractRawText({

                arrayBuffer:
                    buffer

            });


        const text =
            result?.value
                ? result.value.trim()
                : "";


        return text || null;

    }

    catch (error) {

        console.error(
            "❌ DOCX error:",
            error
        );


        return null;

    }

}


/* ==========================================
   READ PDF FILE

   Supports:

   1. Normal text PDFs
   2. Scanned PDFs
   3. Image-based PDFs

   If normal text extraction fails,
   OCR is used automatically.
========================================== */

async function readPDFFile(file) {

    try {

        const pdfjs =
            window.pdfjsLib ||
            window.pdfjs ||
            null;


        if (!pdfjs) {

            console.error(
                "❌ PDF.js not available"
            );

            return null;

        }


        console.log(
            "📄 Reading PDF:",
            file.name
        );


        const buffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjs.getDocument({
                data: buffer
            }).promise;


        console.log(
            "📖 PDF pages:",
            pdf.numPages
        );


        let fullText = "";


        /* ======================================
           STEP 1
           TRY NORMAL PDF TEXT EXTRACTION
        ====================================== */

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


            if (
                pageText.trim()
            ) {

                fullText +=
                    "\n\n" +
                    pageText.trim();

            }

        }


        fullText =
            fullText.trim();


        /* ======================================
           NORMAL PDF TEXT FOUND
        ====================================== */

        if (
            fullText.length > 20
        ) {

            console.log(
                "✅ Normal PDF text extracted"
            );


            return fullText;

        }


        console.log(
            "🔎 No normal PDF text found."
        );

        console.log(
            "📝 Trying OCR on PDF pages..."
        );


        /* ======================================
           STEP 2
           OCR FALLBACK FOR SCANNED PDFs
        ====================================== */

        if (
            typeof Tesseract ===
            "undefined"
        ) {

            console.error(
                "❌ Tesseract OCR not available"
            );


            return null;

        }


        let ocrText = "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            console.log(
                "📝 OCR reading PDF page:",
                pageNumber
            );


            const page =
                await pdf.getPage(
                    pageNumber
                );


            /*
               Render page larger
               for better OCR accuracy
            */

            const viewport =
                page.getViewport({

                    scale: 2

                });


            const canvas =
                document.createElement(
                    "canvas"
                );


            const context =
                canvas.getContext(
                    "2d"
                );


            canvas.width =
                viewport.width;


            canvas.height =
                viewport.height;


            await page.render({

                canvasContext:
                    context,

                viewport:
                    viewport

            }).promise;


            /*
               OCR the rendered PDF page
            */

            const result =
                await Tesseract.recognize(
                    canvas,
                    "eng",
                    {

                        logger:
                            function (info) {

                                console.log(
                                    "PDF OCR:",
                                    pageNumber,
                                    info.status,
                                    info.progress
                                );

                            }

                    }
                );


            const pageOCRText =
                result?.data?.text
                    ? result.data.text.trim()
                    : "";


            if (
                pageOCRText
            ) {

                ocrText +=
                    "\n\n--- Page " +
                    pageNumber +
                    " ---\n\n" +
                    pageOCRText;

            }


            /*
               Clean memory
            */

            canvas.width = 1;
            canvas.height = 1;

        }


        ocrText =
            ocrText.trim();


        if (
            ocrText
        ) {

            console.log(
                "✅ PDF OCR completed successfully"
            );


            return ocrText;

        }


        console.warn(
            "⚠️ No readable text found in PDF"
        );


        return null;

    }

    catch (error) {

        console.error(
            "❌ PDF reading error:",
            error
        );


        return null;

    }

}


/* ==========================================
   EXTRACT FILE TEXT
   MAIN FILE READING FUNCTION

   Returns ONLY the extracted text.

   It does NOT add:
   "File contents:"
   "PDF contents:"
   etc.

   This prevents the AI from automatically
   dumping the entire document into chat.
========================================== */

async function extractFileText(attachment) {

    try {

        const file =
            getAttachmentFile(
                attachment
            );


        if (!file) {

            console.error(
                "❌ Could not access file"
            );


            return null;

        }


        console.log(
            "📄 Extracting file text:",
            file.name
        );


        const extension =
            getFileExtension(
                file
            );


        const mime =
            String(
                file.type || ""
            ).toLowerCase();


        /* TXT / MARKDOWN / CODE */

        if (

            extension === "txt" ||
            extension === "md" ||
            extension === "js" ||
            extension === "css" ||
            extension === "html" ||
            extension === "htm" ||
            extension === "xml" ||
            extension === "py" ||
            extension === "java" ||
            extension === "php" ||
            extension === "ts"

        ) {

            return await readTextFile(
                file
            );

        }


        /* JSON */

        if (

            extension === "json" ||
            mime.includes("json")

        ) {

            return await readJSONFile(
                file
            );

        }


        /* CSV */

        if (

            extension === "csv" ||
            mime.includes("csv")

        ) {

            return await readCSVFile(
                file
            );

        }


        /* DOCX */

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


        /* PDF */

        if (

            extension === "pdf" ||
            mime.includes("pdf")

        ) {

            return await readPDFFile(
                file
            );

        }


        console.warn(
            "⚠️ Unsupported file:",
            file.name
        );


        return null;

    }

    catch (error) {

        console.error(
            "❌ File extraction error:",
            error
        );


        return null;

    }

}

/* ==========================================
   DOCUMENT MEMORY
========================================== */

window.currentDocumentText =
    window.currentDocumentText || "";

window.currentDocumentName =
    window.currentDocumentName || "";
/* ==========================================
   ANALYZE FILE

   Compatibility function for smartAI.js.
   Extracts the document and stores it
   temporarily for follow-up questions.
========================================== */

async function analyzeFile(attachment) {

    try {

        const file =
            getAttachmentFile(
                attachment
            );


        if (!file) {

            console.error(
                "❌ Could not access file for analysis"
            );


            return null;

        }


        console.log(
            "📄 Analyzing file:",
            file.name
        );


        /*
           Extract document text
        */

        const text =
            await extractFileText(
                attachment
            );


        if (!text) {

            console.warn(
                "⚠️ No readable text extracted"
            );


            return null;

        }


        /*
           Store document in memory
        */

        window.currentDocumentText =
            text;


        window.currentDocumentName =
            file.name;


        console.log(
            "🧠 Document stored in memory:",
            file.name
        );


        console.log(
            "📄 Document characters:",
            text.length
        );


        return text;

    }

    catch (error) {

        console.error(
            "❌ File analysis error:",
            error
        );


        return null;

    }

}

/* ==========================================
   GET FILE INFORMATION
========================================== */

function getFileInfo(attachment) {

    const file =
        getAttachmentFile(
            attachment
        );


    if (!file) {

        return null;

    }


    return {

        name:
            file.name || "Unnamed file",

        size:
            file.size || 0,

        type:
            file.type || "Unknown",

        extension:
            getFileExtension(file)

    };

}


/* ==========================================
   PROCESS CURRENT ATTACHMENT
========================================== */

async function analyzeCurrentAttachment() {

    const attachment =
        window.aiAttachment;


    if (!attachment) {

        return null;

    }


    /* Image */

    if (
        attachment.type === "image"
    ) {

        return {

            type: "image",

            text: null

        };

    }


    /* File */

    if (
        attachment.type === "file"
    ) {

        const text =
            await extractFileText(
                attachment
            );


        return {

            type: "file",

            text:
                text

        };

    }


    /* Raw File */

    if (
        typeof File !== "undefined" &&
        attachment instanceof File
    ) {

        const text =
            await extractFileText(
                attachment
            );


        return {

            type: "file",

            text:
                text

        };

    }


    return null;

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.getAttachmentFile =
    getAttachmentFile;

window.getFileExtension =
    getFileExtension;

window.getFileInfo =
    getFileInfo;

window.readImageText =
    readImageText;

window.imageToBase64 =
    imageToBase64;

window.analyzeImageOnline =
    analyzeImageOnline;

window.analyzeImage =
    analyzeImage;

window.readTextFile =
    readTextFile;

window.readJSONFile =
    readJSONFile;

window.readCSVFile =
    readCSVFile;

window.readDOCXFile =
    readDOCXFile;

window.readPDFFile =
    readPDFFile;

window.extractFileText =
    extractFileText;

window.currentDocumentText =
    window.currentDocumentText;

window.currentDocumentName =
    window.currentDocumentName;

window.analyzeFile =
    analyzeFile;

window.analyzeCurrentAttachment =
    analyzeCurrentAttachment;


/* ==========================================
   READY
========================================== */

console.log(
    "========================================"
);

console.log(
    "✅ attachmentAI.js Version 5.0 ready"
);

console.log(
    "🔎 OCR:",
    typeof window.readImageText
);

console.log(
    "🔎 Image Analysis:",
    typeof window.analyzeImage
);

console.log(
    "🔎 File Extraction:",
    typeof window.extractFileText
);

console.log(
    "🔎 File Analysis:",
    typeof window.analyzeFile
);

console.log(
    "🔎 PDF Reader:",
    typeof window.readPDFFile
);

console.log(
    "🔎 DOCX Reader:",
    typeof window.readDOCXFile
);

console.log(
    "========================================"
);
