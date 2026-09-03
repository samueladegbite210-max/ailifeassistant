// ==========================================
// AI LIFE ASSISTANT
// smartAI.js
// Version 10.0
// Stable Central AI Controller
// ==========================================

"use strict";

console.log("🧠 smartAI.js loading...");

// ==========================================
// ATTACHMENT ACCESS
// ==========================================

function getCurrentAttachment() {

    return window.aiAttachment || null;

}

// ==========================================
// ATTACHMENT TYPE CHECK
// ==========================================

function getAttachmentType(attachment) {

    if (!attachment) {
        return null;
    }

    const type =
        String(
            attachment.type || ""
        ).toLowerCase();

    const mimeType =
        String(
            attachment.mimeType ||
            attachment.mime ||
            attachment.file?.type ||
            ""
        ).toLowerCase();

    // Image
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

    // File
    if (
        type === "file" ||
        type === "document"
    ) {

        return "file";

    }

    return type || null;

}

// ==========================================
// SAFE MODULE RUNNER
// ==========================================

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

// ==========================================
// ONLINE AI BACKEND
// TEXT + IMAGE SUPPORT
// ==========================================

async function askOnlineAI(
    message,
    attachment = null
) {

    const endpoint =
        "https://ai-life-assistant-backend.vercel.app/api/ai";

    try {

        console.log(
            "🌐 Sending request to online AI..."
        );

        let imageData = null;


        // ======================================
        // PREPARE IMAGE
        // ======================================

        if (
            attachment &&
            getAttachmentType(attachment) ===
            "image"
        ) {

            const file =
                attachment.file ||
                attachment.data ||
                null;


            if (
                file instanceof Blob
            ) {

                console.log(
                    "🖼️ Preparing image for online AI..."
                );

                imageData =
                    await fileToBase64(
                        file
                    );

            }

        }


        // ======================================
        // SEND REQUEST
        // ======================================

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
                                String(
                                    message || ""
                                ).trim(),

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
                "❌ Invalid backend response:",
                error
            );

        }


        console.log(
            "🌐 Online AI status:",
            response.status
        );


        // ======================================
        // ERROR HANDLING
        // ======================================

        if (
            !response.ok
        ) {

            console.error(
                "❌ Online AI backend error:",
                response.status,
                data
            );

            return null;

        }


        // ======================================
        // SUCCESS
        // ======================================

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

        return null;

    }

}
// ==========================================
// FILE TO BASE64
// ==========================================

function fileToBase64(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

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


        // ======================================
        // NO API CREDITS
        // ======================================

        if (
            response.status === 429
        ) {

            console.warn(
                "⚠️ Online AI has no available API credits."
            );

            return (
                "🟡 Online AI is temporarily unavailable because the AI service has reached its current usage limit.\n\n" +
                "Your AI Life Assistant is still working, and the built-in AI features remain available.\n\n" +
                "Please try the message again later."
            );

        }


        // ======================================
        // UNAUTHORIZED / BAD API KEY
        // ======================================

        if (
            response.status === 401
        ) {

            console.error(
                "❌ Online AI API key rejected."
            );

            return (
                "🔐 The online AI service is currently unavailable because its server authentication needs attention."
            );

        }


        // ======================================
        // OTHER SERVER ERRORS
        // ======================================

        if (
            !response.ok
        ) {

            console.error(
                "❌ Online AI backend error:",
                response.status,
                data
            );

            return (
                "⚠️ The online AI service is temporarily unavailable.\n\n" +
                "Your built-in AI features are still available."
            );

        }


        // ======================================
        // SUCCESS
        // ======================================

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


        return (
            "⚠️ The online AI service returned an empty response."
        );

    }

    catch (error) {

        console.error(
            "❌ Online AI connection error:",
            error
        );

        return (
            "🌐 I couldn't reach the online AI service right now.\n\n" +
            "Please check your internet connection and try again."
        );

    }

}
// ==========================================
// IMAGE COMMAND DETECTION
// ==========================================

function isImageCommand(msg) {

    const attachment =
        getCurrentAttachment();

    const attachmentType =
        getAttachmentType(
            attachment
        );

    console.log(
        "📎 CURRENT ATTACHMENT:",
        attachment
    );

    console.log(
        "📎 ATTACHMENT TYPE:",
        attachmentType
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

        // Vague image questions

        text === "what is this" ||
        text === "what's this" ||

        text === "what is it" ||
        text === "what's it" ||

        text === "what is that" ||
        text === "what's that" ||

        text === "what am i looking at" ||

        text === "tell me about this" ||
        text === "tell me what this is" ||

        // Describe

        text.includes("describe") ||

        text.includes("what is in") ||

        text.includes("what's in") ||

        text.includes("what does the image show") ||

        text.includes("what does this image show") ||

        text.includes("analyze") ||

        text.includes("analyse") ||

        // OCR

        text.includes("read text") ||

        text.includes("read the text") ||

        text.includes("extract text") ||

        text.includes("text in the image") ||

        text.includes("text from the image") ||

        text.includes("what does the image say") ||

        text.includes("what does this image say") ||

        text.includes("what does this say") ||

        text.includes("read this image")

    );

}

// ==========================================
// FILE COMMAND DETECTION
// ==========================================

function isFileCommand(msg) {

    if (!msg) {

        return false;

    }

    const text =
        String(msg)
        .toLowerCase()
        .trim();

    return (

        text.includes(
            "summarize the file"
        ) ||

        text.includes(
            "summarize file"
        ) ||

        text.includes(
            "summarize this file"
        ) ||

        text.includes(
            "summarize this"
        ) ||

        text.includes(
            "summarize it"
        ) ||

        text.includes(
            "explain the file"
        ) ||

        text.includes(
            "explain this file"
        ) ||

        text.includes(
            "explain the contents"
        ) ||

        text.includes(
            "read the file"
        ) ||

        text.includes(
            "read this file"
        ) ||

        text.includes(
            "find important information"
        ) ||

        text.includes(
            "important information"
        ) ||

        text.includes(
            "answer questions about the file"
        ) ||

        text.includes(
            "what does the file say"
        )

    );

}

// ==========================================
// IMAGE OCR DETECTION
// ==========================================

function isOCRCommand(msg) {

    const text =
        String(msg || "")
        .toLowerCase()
        .trim();

    return (

        text.includes("read text") ||

        text.includes("read the text") ||

        text.includes("extract text") ||

        text.includes("text in the image") ||

        text.includes("text from the image") ||

        text.includes("what does the image say") ||

        text.includes("what does this image say") ||

        text.includes("what does this say") ||

        text.includes("read this image")

    );

}

// ======================================
// ONLINE IMAGE ANALYSIS
// ======================================

if (
    isImageAnalysisCommand(msg)
) {

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

// ==========================================
// FILE HANDLER
// ==========================================

async function handleFileCommand(msg) {

    console.log(
        "📄 FILE COMMAND DETECTED:",
        msg
    );

    const attachment =
        getCurrentAttachment();

    if (!attachment) {

        return (
            "📂 I don't currently have a file attached.\n\n" +
            "Please upload a file first."
        );

    }

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

    if (
        typeof window.analyzeFile ===
        "function"
    ) {

        try {

            const result =
                await window.analyzeFile(
                    attachment
                );

            if (
                result !== null &&
                result !== undefined &&
                String(result).trim() !== ""
            ) {

                return String(result);

            }

            return (
                "📄 I read the file, " +
                "but no readable content was returned."
            );

        }

        catch (error) {

            console.error(
                "❌ FILE ANALYSIS ERROR:",
                error
            );

            return (
                "⚠️ Something went wrong while reading the file."
            );

        }

    }

    return (
        "📄 I have your file, " +
        "but the file-reading engine is not connected yet."
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
        function (
            file,
            index
        ) {

            const name =
                file.name ||
                "Unnamed file";

            const type =
                getAttachmentType(
                    file
                ) ||
                "Unknown type";

            reply +=
                `${index + 1}. ${name} (${type})\n`;

        }
    );

    return reply;

}

// ==========================================
// AI MODULE LIST
// ==========================================

function getAIModules(
    original,
    msg
) {

    return [

        [
            "conversationReply",

            () =>
                typeof window.conversationReply === "function"
                    ? window.conversationReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "memoryReply",

            () =>
                typeof window.memoryReply === "function"
                    ? window.memoryReply(
                        msg,
                        original
                    )
                    : null
        ],

        [
            "knowledgeReply",

            () =>
                typeof window.knowledgeReply === "function"
                    ? window.knowledgeReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "profileReply",

            () =>
                typeof window.profileReply === "function"
                    ? window.profileReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "learnUserReply",

            () =>
                typeof window.learnUserReply === "function"
                    ? window.learnUserReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "teacherReply",

            () =>
                typeof window.teacherReply === "function"
                    ? window.teacherReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "quizReply",

            () =>
                typeof window.quizReply === "function"
                    ? window.quizReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "calculatorReply",

            () =>
                typeof window.calculatorReply === "function"
                    ? window.calculatorReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "dateTimeReply",

            () =>
                typeof window.dateTimeReply === "function"
                    ? window.dateTimeReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "taskReply",

            () =>
                typeof window.taskReply === "function"
                    ? window.taskReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "goalReply",

            () =>
                typeof window.goalReply === "function"
                    ? window.goalReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "noteReply",

            () =>
                typeof window.noteReply === "function"
                    ? window.noteReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "eventReply",

            () =>
                typeof window.eventReply === "function"
                    ? window.eventReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "naturalReply",

            () =>
                typeof window.naturalReply === "function"
                    ? window.naturalReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "foodReply",

            () =>
                typeof window.foodReply === "function"
                    ? window.foodReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "weatherReply",

            () =>
                typeof window.weatherReply === "function"
                    ? window.weatherReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "adviceReply",

            () =>
                typeof window.adviceReply === "function"
                    ? window.adviceReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "internetReply",

            () =>
                typeof window.internetReply === "function"
                    ? window.internetReply(
                        original,
                        msg
                    )
                    : null
        ],

        [
            "aiBrainReply",

            () =>
                typeof window.aiBrainReply === "function"
                    ? window.aiBrainReply(
                        original,
                        msg
                    )
                    : null
        ]

    ];

}

// ==========================================
// MAIN AI
// ==========================================

async function smartAIReply(
    rawMessage
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
        "🧠 Processing:",
        original
    );

    // ======================================
    // GET CURRENT ATTACHMENT
    // ======================================

    const attachment =
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

    // ======================================
    // IMAGE ATTACHMENT
    // ======================================

    if (
        attachmentType === "image"
    ) {

        console.log(
            "🖼️ IMAGE ATTACHMENT FOUND"
        );

        console.log(
            "🖼️ IMAGE COMMAND:",
            isImageCommand(msg)
        );

        /*
           Always send image-related messages
           to the image handler while an image
           remains attached.

           The image handler decides whether
           to analyze, OCR, or show help.
        */

        return await handleImageCommand(
            msg
        );

    }

    // ======================================
    // FILE ATTACHMENT
    // ======================================

    if (
        attachmentType === "file" &&
        isFileCommand(msg)
    ) {

        console.log(
            "📄 FILE ATTACHMENT FOUND"
        );

        return await handleFileCommand(
            msg
        );

    }

    // ======================================
    // UPLOAD LIST
    // ======================================

    if (

        msg.includes(
            "what did i upload"
        ) ||

        msg.includes(
            "what have i uploaded"
        ) ||

        msg.includes(
            "show my uploads"
        ) ||

        msg.includes(
            "my uploaded files"
        ) ||

        msg.includes(
            "list my uploads"
        )

    ) {

        return getUploadList();

    }

    // ======================================
    // AI MODULES
    // ======================================

    const modules =
        getAIModules(
            original,
            msg
        );

    // ======================================
    // RUN MODULES IN ORDER
    // ======================================

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
// ======================================
    // ONLINE AI FALLBACK
    // ======================================

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


    if (onlineReply) {

        return onlineReply;

    }


    // ======================================
    // FINAL OFFLINE FALLBACK
    // ======================================

    return (
        "🤖 I'm currently unable to connect to my online AI service.\n\n" +
        "Please check your internet connection and try again."
    );
   }
// ==========================================
// GLOBAL ACCESS
// ==========================================

window.smartAIReply =
    smartAIReply;

window.askOnlineAI =
    askOnlineAI;

window.getCurrentAttachment =
    getCurrentAttachment;

window.getAttachmentType =
    getAttachmentType;

window.isImageCommand =
    isImageCommand;

window.isFileCommand =
    isFileCommand;

window.isOCRCommand =
    isOCRCommand;

window.isImageAnalysisCommand =
    isImageAnalysisCommand;

window.handleImageCommand =
    handleImageCommand;

window.handleFileCommand =
    handleFileCommand;

window.getUploadList =
    getUploadList;

window.getAIModules =
    getAIModules;

// ==========================================
// READY
// ==========================================

console.log(
    "========================================"
);

console.log(
    "✅ smartAI.js Version 10.0 ready"
);

console.log(
    "🔎 window.smartAIReply:",
    typeof window.smartAIReply
);

console.log(
    "🔎 window.askOnlineAI:",
    typeof window.askOnlineAI
);
console.log(
    "🔎 window.analyzeImage:",
    typeof window.analyzeImage
);

console.log(
    "🔎 window.readImageText:",
    typeof window.readImageText
);

console.log(
    "🔎 window.analyzeFile:",
    typeof window.analyzeFile
);

console.log(
    "========================================"
);
