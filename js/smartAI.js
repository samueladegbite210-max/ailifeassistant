"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   smartAI.js
   Version 12.0

   CENTRAL AI CONTROLLER

   RESPONSIBILITIES:
   - AI module routing
   - Image command detection
   - OCR routing
   - Online Vision AI
   - File reading
   - File summarization
   - File question answering
   - Online AI fallback
========================================== */

console.log("🧠 smartAI.js Version 12.0 loading...");


/* ==========================================
   CONFIGURATION
========================================== */

const ONLINE_AI_ENDPOINT =
    "https://ai-life-assistant-backend.vercel.app/api/ai";


const MAX_FILE_CONTENT_LENGTH =
    12000;


/* ==========================================
   ATTACHMENT ACCESS
========================================== */

function getCurrentAttachment() {

    return window.aiAttachment || null;

}


/* ==========================================
   ATTACHMENT TYPE DETECTION
========================================== */

function getAttachmentType(attachment) {

    if (!attachment) {

        return null;

    }


    const type =
        String(
            attachment.type || ""
        )
        .toLowerCase()
        .trim();


    const mimeType =
        String(
            attachment.mimeType ||
            attachment.mime ||
            attachment.file?.type ||
            attachment.data?.type ||
            ""
        )
        .toLowerCase()
        .trim();


    /* ======================================
       IMAGE
    ====================================== */

    if (
        type === "image" ||
        type.startsWith("image/")
    ) {

        return "image";

    }


    if (
        mimeType.startsWith("image/")
    ) {

        return "image";

    }


    /* ======================================
       FILE / DOCUMENT
    ====================================== */

    if (
        type === "file" ||
        type === "document"
    ) {

        return "file";

    }


    /*
       Detect common document MIME types
    */

    if (

        mimeType.includes("pdf") ||

        mimeType.includes("word") ||

        mimeType.includes("document") ||

        mimeType.includes("text") ||

        mimeType.includes("json") ||

        mimeType.includes("csv") ||

        mimeType.includes("javascript") ||

        mimeType.includes("html") ||

        mimeType.includes("css")

    ) {

        return "file";

    }


    return type || null;

}


/* ==========================================
   SAFE MODULE RUNNER
========================================== */

async function runModule(
    name,
    callback
) {

    try {

        if (
            typeof callback !== "function"
        ) {

            return null;

        }


        const result =
            await callback();


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

    }

    catch (error) {

        console.error(
            "❌ AI module error:",
            name,
            error
        );

    }


    return null;

}


/* ==========================================
   FILE / IMAGE TO BASE64
========================================== */

function fileToBase64(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (!file) {

                reject(
                    new Error(
                        "No file provided"
                    )
                );

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
                            "Failed to read file"
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
   ONLINE AI BACKEND
   TEXT + IMAGE SUPPORT
========================================== */

async function askOnlineAI(
    message,
    attachment = null
) {

    try {

        console.log(
            "🌐 Sending request to online AI..."
        );


        let imageData =
            null;


        /* ======================================
           PREPARE IMAGE
        ====================================== */

        if (
            attachment &&
            getAttachmentType(
                attachment
            ) === "image"
        ) {

            const imageFile =

                attachment.file ||

                attachment.data ||

                null;


            if (
                imageFile instanceof Blob
            ) {

                console.log(
                    "🖼️ Preparing image for Vision AI..."
                );


                imageData =
                    await fileToBase64(
                        imageFile
                    );

            }

            else if (
                typeof imageFile === "string"
            ) {

                imageData =
                    imageFile;

            }

        }


        /* ======================================
           SEND REQUEST
        ====================================== */

        const response =
            await fetch(
                ONLINE_AI_ENDPOINT,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                String(
                                    message || ""
                                ).trim(),

                            image:
                                imageData

                        })

                }
            );


        let data =
            {};


        try {

            data =
                await response.json();

        }

        catch (error) {

            console.error(
                "❌ Invalid backend response:",
                error
            );

        }


        console.log(
            "🌐 Online AI status:",
            response.status
        );


        /* ======================================
           RATE LIMIT
        ====================================== */

        if (
            response.status === 429
        ) {

            return (
                "🟡 The online AI service has temporarily reached its usage limit.\n\n" +
                "Please try again later."
            );

        }


        /* ======================================
           UNAUTHORIZED
        ====================================== */

        if (
            response.status === 401
        ) {

            return (
                "🔐 The online AI service authentication needs attention."
            );

        }


        /* ======================================
           SERVER ERROR
        ====================================== */

        if (
            !response.ok
        ) {

            console.error(
                "❌ Online AI backend error:",
                response.status,
                data
            );


            return (
                "⚠️ Online AI Error\n\n" +
                "Status: " +
                response.status +
                "\n\nMessage: " +
                (
                    data?.error ||
                    data?.message ||
                    "Unknown backend error"
                )
            );

        }


        /* ======================================
           SUCCESS
        ====================================== */

        if (
            data &&
            data.success === true &&
            data.reply
        ) {

            console.log(
                "✅ Online AI responded"
            );


            return String(
                data.reply
            ).trim();

        }


        console.error(
            "❌ Online AI returned no reply:",
            data
        );


        return null;

    }

    catch (error) {

        console.error(
            "❌ Online AI connection error:",
            error
        );


        return (
            "⚠️ Connection Error\n\n" +
            error.message
        );

    }

}


/* ==========================================
   IMAGE COMMAND DETECTION
========================================== */

function isImageCommand(msg) {

    const attachment =
        getCurrentAttachment();


    const attachmentType =
        getAttachmentType(
            attachment
        );


    if (
        attachmentType !== "image"
    ) {

        return false;

    }


    if (!msg) {

        return true;

    }


    const text =
        String(msg)
        .toLowerCase()
        .trim();


    return (

        isOCRCommand(text) ||

        isImageAnalysisCommand(text)

    );

}


/* ==========================================
   OCR COMMAND DETECTION
========================================== */

function isOCRCommand(msg) {

    const text =
        String(msg || "")
        .toLowerCase()
        .trim();


    return (

        text.includes("read text") ||

        text.includes("read the text") ||

        text.includes("extract text") ||

        text.includes("extract the text") ||

        text.includes("text in the image") ||

        text.includes("text from the image") ||

        text.includes("what does the image say") ||

        text.includes("what does this image say") ||

        text.includes("what does this say") ||

        text.includes("read this image")

    );

}


/* ==========================================
   IMAGE ANALYSIS DETECTION
========================================== */

function isImageAnalysisCommand(msg) {

    const text =
        String(msg || "")
        .toLowerCase()
        .trim();


    return (

        text === "what is this" ||

        text === "what's this" ||

        text === "what is it" ||

        text === "what's it" ||

        text === "what is that" ||

        text === "what's that" ||

        text === "what am i looking at" ||

        text === "tell me about this" ||

        text === "tell me what this is" ||

        text.includes("describe") ||

        text.includes("what is in") ||

        text.includes("what's in") ||

        text.includes("what does the image show") ||

        text.includes("what does this image show") ||

        text.includes("analyze") ||

        text.includes("analyse") ||

        text.includes("explain this image") ||

        text.includes("tell me about the image")

    );

}


/* ==========================================
   IMAGE HANDLER
========================================== */

async function handleImageCommand(
    msg,
    providedAttachment = null
) {

    console.log(
        "🖼️ IMAGE COMMAND DETECTED:",
        msg
    );


    const attachment =
        providedAttachment ||
        getCurrentAttachment();


    /* ======================================
       NO ATTACHMENT
    ====================================== */

    if (!attachment) {

        return (
            "📷 I don't currently have an image attached.\n\n" +
            "Please upload an image first."
        );

    }


    /* ======================================
       WRONG TYPE
    ====================================== */

    if (
        getAttachmentType(
            attachment
        ) !== "image"
    ) {

        return (
            "📎 The current attachment isn't an image.\n\n" +
            "Please upload an image."
        );

    }


    /* ======================================
       GET IMAGE SOURCE
    ====================================== */

    const imageSource =

        attachment.file ||

        attachment.data ||

        attachment.url ||

        attachment.src ||

        null;


    if (!imageSource) {

        console.error(
            "❌ IMAGE DATA NOT FOUND:",
            attachment
        );


        return (
            "📷 I found the image attachment, " +
            "but I couldn't access the image data."
        );

    }


    console.log(
        "🖼️ Current image:",
        attachment.name ||
        "Unnamed image"
    );


    /* ======================================
       OCR
    ====================================== */

    if (
        isOCRCommand(msg)
    ) {

        console.log(
            "📝 Starting OCR..."
        );


        if (
            typeof window.readImageText ===
            "function"
        ) {

            try {

                const result =
                    await window.readImageText(
                        imageSource
                    );


                if (
                    result !== null &&
                    result !== undefined &&
                    String(result).trim() !== ""
                ) {

                    return String(result);

                }


                return (
                    "📝 I couldn't find any readable text in this image."
                );

            }

            catch (error) {

                console.error(
                    "❌ OCR ERROR:",
                    error
                );


                return (
                    "⚠️ Something went wrong while reading the text in this image."
                );

            }

        }


        return (
            "📝 Image text reading is not connected yet."
        );

    }


    /* ======================================
       ONLINE VISION AI
    ====================================== */

    console.log(
        "👀 Sending image to online Vision AI..."
    );


    const result =
        await askOnlineAI(
            msg,
            attachment
        );


    if (
        result &&
        String(result).trim() !== ""
    ) {

        return String(result);

    }


    return (
        "⚠️ I couldn't analyze this image right now.\n\n" +
        "Please check your internet connection and try again."
    );

}


/* ==========================================
   FILE COMMAND DETECTION
========================================== */

function isFileCommand(msg) {

    const text =
        String(msg || "")
        .toLowerCase()
        .trim();


    return (

        text.includes("summarize") ||

        text.includes("summarise") ||

        text.includes("analyze this file") ||

        text.includes("analyse this file") ||

        text.includes("analyze the file") ||

        text.includes("analyse the file") ||

        text.includes("analyze this document") ||

        text.includes("analyse this document") ||

        text.includes("analyze the document") ||

        text.includes("analyse the document") ||

        text.includes("read and summarize") ||

        text.includes("read the file") ||

        text.includes("read this file") ||

        text.includes("explain the file") ||

        text.includes("explain this file") ||

        text.includes("explain the contents") ||

        text.includes("important information") ||

        text.includes("find important information") ||

        text.includes("what does the file say") ||

        text.includes("answer questions about the file") ||

        text.includes("provide a concise summary")

    );

}


/* ==========================================
   DETECT FILE QUESTION
========================================== */

function hasFileContent() {

    return (
        typeof window.currentFileContent ===
        "string" &&

        window.currentFileContent.trim() !== ""
    );

}


/* ==========================================
   FILE QUESTION HANDLER
========================================== */

async function answerFileQuestion(msg) {

    if (!hasFileContent()) {

        return null;

    }


    const fileContent =
        window.currentFileContent;


    const fileName =
        window.currentFileName ||
        "the uploaded file";


    console.log(
        "📄 Answering question about:",
        fileName
    );


    const contentForAI =
        fileContent.length >
        MAX_FILE_CONTENT_LENGTH

            ? fileContent.substring(
                0,
                MAX_FILE_CONTENT_LENGTH
            )

            : fileContent;


    const prompt =
        `
You are answering a question about an uploaded document.

FILE NAME:
${fileName}

DOCUMENT CONTENT:
${contentForAI}

USER QUESTION:
${msg}

IMPORTANT:
- Answer only from the document content.
- Do not invent information.
- Be concise and helpful.
- Do not reproduce the entire document.
        `.trim();


    return await askOnlineAI(
        prompt
    );

}
/* ==========================================
   FILE CONTENT SUMMARIZER
========================================== */

async function summarizeFileContent(
    content,
    fileName
) {

    if (
        !content ||
        String(content).trim() === ""
    ) {

        return (
            "📄 I couldn't find readable content in this file."
        );

    }


    let text =
        String(content).trim();


    /*
       Prevent extremely large files
       from overwhelming the AI request.
    */

    const maxLength =
        12000;


    if (
        text.length > maxLength
    ) {

        text =
            text.substring(
                0,
                maxLength
            );

    }


    console.log(
        "🧠 Sending extracted file content for summarization..."
    );


    const prompt =
        `You are analyzing a file named "${fileName || "Unknown file"}".

Summarize the file clearly for the user.

IMPORTANT RULES:

- Do NOT reproduce the entire file.
- Do NOT list every line.
- Give a short overview first.
- Identify the main topics.
- Extract important information.
- Use bullet points where helpful.
- Keep the response concise and easy to understand.
- If the file is code, explain what the code does instead of reproducing it.

FILE CONTENT:

${text}`;


    const response =
        await askOnlineAI(
            prompt
        );


    if (
        response &&
        String(response).trim() !== ""
    ) {

        return String(
            response
        ).trim();

    }


    /*
       FALLBACK SUMMARY
    */

    const lines =
        text
        .split("\n")
        .filter(
            line =>
                line.trim() !== ""
        );


    return (
        `📄 **${fileName || "File"}**\n\n` +
        `I successfully read the file.\n\n` +
        `• File contains approximately ${lines.length} lines.\n` +
        `• The file was processed successfully.\n\n` +
        `You can now ask me specific questions about it, such as:\n` +
        `• What is this file about?\n` +
        `• Explain the important parts\n` +
        `• Find specific information\n` +
        `• Explain a section of the file`
    );

}

/* ==========================================
   FILE HANDLER
========================================== */

async function handleFileCommand(
    msg
) {

    console.log(
        "📄 FILE COMMAND DETECTED:",
        msg
    );


    const attachment =
        getCurrentAttachment();


    /* ======================================
       NO ATTACHMENT
    ====================================== */

    if (!attachment) {

        return (
            "📂 I don't currently have a file attached.\n\n" +
            "Please upload a file first."
        );

    }


    /* ======================================
       WRONG TYPE
    ====================================== */

    if (
        getAttachmentType(
            attachment
        ) !== "file"
    ) {

        return (
            "📎 The current attachment isn't a document.\n\n" +
            "Please upload a file."
        );

    }


    console.log(
        "📄 Current file:",
        attachment.name ||
        "Unnamed file"
    );


    console.log(
        "🔎 analyzeFile:",
        typeof window.analyzeFile
    );


    /* ======================================
       FILE ENGINE CHECK
    ====================================== */

    if (
        typeof window.analyzeFile !==
        "function"
    ) {

        return (
            "📄 I have your file, but the file-reading engine is not connected yet."
        );

    }


    try {

        console.log(
            "📖 Reading file..."
        );


        /*
           STEP 1:
           Extract file content
        */

        const fileContent =
            await window.analyzeFile(
                attachment
            );


        console.log(
            "📖 File content received:",
            typeof fileContent,
            String(
                fileContent || ""
            ).length,
            "characters"
        );


        if (
            fileContent === null ||
            fileContent === undefined ||
            String(fileContent).trim() === ""
        ) {

            return (
                "📄 I read the file, but no readable content was found."
            );

        }


        /*
           STEP 2:
           Determine user request
        */

        const request =
            String(
                msg || ""
            )
            .toLowerCase()
            .trim();


        /*
           DEFAULT:
           Summarize the file
        */

        if (

            request.includes("summarize") ||

            request.includes("summary") ||

            request.includes("read the file") ||

            request.includes("read this file") ||

            request.includes("what does the file say") ||

            request.includes("important information") ||

            request.includes("explain the file") ||

            request.includes("explain this file") ||

            request.includes("explain the contents") ||

            request === ""

        ) {

            console.log(
                "🧠 Creating file summary..."
            );


            return await summarizeFileContent(
                fileContent,
                attachment.name
            );

        }


        /*
           SPECIFIC QUESTION ABOUT FILE
        */

        let content =
            String(fileContent);


        const maxLength =
            12000;


        if (
            content.length > maxLength
        ) {

            content =
                content.substring(
                    0,
                    maxLength
                );

        }


        const prompt =
            `The user uploaded a file named "${attachment.name || "Unknown file"}".

Answer the user's question using the file content.

USER QUESTION:
${msg}

FILE CONTENT:
${content}

IMPORTANT:
Answer clearly and directly.
Do not reproduce the entire file unless absolutely necessary.`;


        const response =
            await askOnlineAI(
                prompt
            );


        if (
            response &&
            String(response).trim() !== ""
        ) {

            return String(
                response
            ).trim();

        }


        return (
            "📄 I read the file successfully, but I couldn't answer that question right now."
        );

    }

    catch (error) {

        console.error(
            "❌ FILE ANALYSIS ERROR:",
            error
        );


        return (
            "⚠️ Something went wrong while reading the file.\n\n" +
            error.message
        );

    }

} 

/* ==========================================
   UPLOAD LIST
========================================== */

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
        function (
            file,
            index
        ) {

            const name =
                file.name ||
                "Unnamed file";


            const type =
                file.type ||
                "Unknown type";


            reply +=
                `${index + 1}. ${name} (${type})\n`;

        }
    );


    return reply;

}


/* ==========================================
   UPLOAD LIST DETECTION
========================================== */

function isUploadListCommand(msg) {

    const text =
        String(msg || "")
        .toLowerCase()
        .trim();


    return (

        text.includes("what did i upload") ||

        text.includes("what have i uploaded") ||

        text.includes("show my uploads") ||

        text.includes("my uploaded files") ||

        text.includes("list my uploads")

    );

}


/* ==========================================
   AI MODULE LIST
========================================== */

function getAIModules(
    original,
    msg
) {

    return [

        [
            "conversationReply",

            () =>
                typeof window.conversationReply ===
                "function"

                    ? window.conversationReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "memoryReply",

            () =>
                typeof window.memoryReply ===
                "function"

                    ? window.memoryReply(
                        msg,
                        original
                    )

                    : null
        ],


        [
            "knowledgeReply",

            () =>
                typeof window.knowledgeReply ===
                "function"

                    ? window.knowledgeReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "profileReply",

            () =>
                typeof window.profileReply ===
                "function"

                    ? window.profileReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "learnUserReply",

            () =>
                typeof window.learnUserReply ===
                "function"

                    ? window.learnUserReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "teacherReply",

            () =>
                typeof window.teacherReply ===
                "function"

                    ? window.teacherReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "quizReply",

            () =>
                typeof window.quizReply ===
                "function"

                    ? window.quizReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "calculatorReply",

            () =>
                typeof window.calculatorReply ===
                "function"

                    ? window.calculatorReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "dateTimeReply",

            () =>
                typeof window.dateTimeReply ===
                "function"

                    ? window.dateTimeReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "taskReply",

            () =>
                typeof window.taskReply ===
                "function"

                    ? window.taskReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "goalReply",

            () =>
                typeof window.goalReply ===
                "function"

                    ? window.goalReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "noteReply",

            () =>
                typeof window.noteReply ===
                "function"

                    ? window.noteReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "eventReply",

            () =>
                typeof window.eventReply ===
                "function"

                    ? window.eventReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "naturalReply",

            () =>
                typeof window.naturalReply ===
                "function"

                    ? window.naturalReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "foodReply",

            () =>
                typeof window.foodReply ===
                "function"

                    ? window.foodReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "weatherReply",

            () =>
                typeof window.weatherReply ===
                "function"

                    ? window.weatherReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "adviceReply",

            () =>
                typeof window.adviceReply ===
                "function"

                    ? window.adviceReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "internetReply",

            () =>
                typeof window.internetReply ===
                "function"

                    ? window.internetReply(
                        original,
                        msg
                    )

                    : null
        ],


        [
            "aiBrainReply",

            () =>
                typeof window.aiBrainReply ===
                "function"

                    ? window.aiBrainReply(
                        original,
                        msg
                    )

                    : null
        ]

    ];

}


/* ==========================================
   MAIN AI CONTROLLER
========================================== */

async function smartAIReply(
    rawMessage,
    providedAttachment = null
) {

    const original =
        String(
            rawMessage || ""
        ).trim();


    if (!original) {

        return null;

    }


    const msg =
        original
        .toLowerCase()
        .trim();


    console.log(
        "========================================"
    );

    console.log(
        "🧠 Processing:",
        original
    );


    /* ======================================
       GET ATTACHMENT
    ====================================== */

    const attachment =
        providedAttachment ||
        getCurrentAttachment();


    const attachmentType =
        getAttachmentType(
            attachment
        );


    console.log(
        "📎 ATTACHMENT:",
        attachment
    );


    console.log(
        "📎 NORMALIZED TYPE:",
        attachmentType
    );


    /* ======================================
       UPLOAD LIST
    ====================================== */

    if (
        isUploadListCommand(msg)
    ) {

        return getUploadList();

    }


    /* ======================================
       IMAGE ATTACHMENT
    ====================================== */

    if (
        attachmentType === "image"
    ) {

        console.log(
            "🖼️ IMAGE ATTACHMENT FOUND"
        );


        return await handleImageCommand(
            original,
            attachment
        );

    }


    /* ======================================
       FILE ATTACHMENT COMMAND
    ====================================== */

    if (
        attachmentType === "file" &&
        isFileCommand(msg)
    ) {

        console.log(
            "📄 FILE ATTACHMENT FOUND"
        );


        return await handleFileCommand(
            original,
            attachment
        );

    }


    /* ======================================
       FILE QUESTION MODE

       If a file has already been read,
       allow normal questions about it.
    ====================================== */

    if (
        attachmentType === "file" &&
        hasFileContent()
    ) {

        console.log(
            "📄 FILE QUESTION MODE"
        );


        const fileAnswer =
            await answerFileQuestion(
                original
            );


        if (
            fileAnswer &&
            String(fileAnswer).trim() !== ""
        ) {

            return String(
                fileAnswer
            ).trim();

        }

    }


    /* ======================================
       LOCAL AI MODULES
    ====================================== */

    const modules =
        getAIModules(
            original,
            msg
        );


    for (
        const [
            name,
            callback
        ]
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


    /* ======================================
       ONLINE AI FALLBACK
    ====================================== */

    console.log(
        "🌐 No local AI module answered."
    );


    console.log(
        "🌐 Trying online AI..."
    );


    const onlineReply =
        await askOnlineAI(
            original
        );


    if (
        onlineReply &&
        String(onlineReply).trim() !== ""
    ) {

        return onlineReply;

    }


    /* ======================================
       FINAL FALLBACK
    ====================================== */

    return (
        "🤖 I'm currently unable to connect to my online AI service.\n\n" +
        "Please check your internet connection and try again."
    );

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.smartAIReply =
    smartAIReply;

window.askOnlineAI =
    askOnlineAI;

window.fileToBase64 =
    fileToBase64;

window.getCurrentAttachment =
    getCurrentAttachment;

window.getAttachmentType =
    getAttachmentType;

window.isImageCommand =
    isImageCommand;

window.isOCRCommand =
    isOCRCommand;

window.isImageAnalysisCommand =
    isImageAnalysisCommand;

window.isFileCommand =
    isFileCommand;

window.hasFileContent =
    hasFileContent;

window.answerFileQuestion =
    answerFileQuestion;

window.handleImageCommand =
    handleImageCommand;

window.handleFileCommand =
    handleFileCommand;

window.getUploadList =
    getUploadList;

window.getAIModules =
    getAIModules;
window.summarizeFileContent =
    summarizeFileContent;

/* ==========================================
   READY CHECK
========================================== */

console.log(
    "========================================"
);

console.log(
    "✅ smartAI.js Version 12.0 ready"
);

console.log(
    "🔎 smartAIReply:",
    typeof window.smartAIReply
);

console.log(
    "🔎 askOnlineAI:",
    typeof window.askOnlineAI
);

console.log(
    "🔎 handleImageCommand:",
    typeof window.handleImageCommand
);

console.log(
    "🔎 handleFileCommand:",
    typeof window.handleFileCommand
);

console.log(
    "🔎 readImageText:",
    typeof window.readImageText
);

console.log(
    "🔎 analyzeFile:",
    typeof window.analyzeFile
);

console.log(
    "========================================"
);
