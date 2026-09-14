"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   smartAI.js
   Version 13.0

   CENTRAL AI CONTROLLER

   RESPONSIBILITIES:
   - AI module routing
   - Conversation memory
   - Image command detection
   - Persistent image context
   - OCR routing
   - Online Vision AI
   - File reading
   - File summarization
   - File question answering
   - Online AI fallback
========================================== */

console.log("🧠 smartAI.js Version 13.0 loading...");

/* ==========================================
   CONFIGURATION
========================================== */

const ONLINE_AI_ENDPOINT =
    "https://ai-life-assistant-backend.vercel.app/api/ai";

const MAX_FILE_CONTENT_LENGTH =
    12000;


/* ==========================================
   CONVERSATION CONTEXT SYSTEM
========================================== */

const CONVERSATION_MAX_MESSAGES = 30;

const CONVERSATION_MAX_AGE =
    30 * 60 * 1000; // 30 minutes

window.conversationHistory =
    window.conversationHistory || [];

window.activeVisionContext =
    window.activeVisionContext || null;


/* ==========================================
   CLEAN OLD CONVERSATION
========================================== */

function cleanConversationHistory() {

    const now = Date.now();

    window.conversationHistory =
        (
            window.conversationHistory || []
        ).filter(function (item) {

            return (
                item &&
                item.timestamp &&
                now - item.timestamp <
                    CONVERSATION_MAX_AGE
            );

        });

    if (
        window.conversationHistory.length >
        CONVERSATION_MAX_MESSAGES
    ) {

        window.conversationHistory =
            window.conversationHistory.slice(
                -CONVERSATION_MAX_MESSAGES
            );

    }

}


/* ==========================================
   ADD CONVERSATION MESSAGE
========================================== */

function addConversationMessage(
    role,
    content
) {

    if (
        !content ||
        !String(content).trim()
    ) {

        return;

    }

    cleanConversationHistory();

    window.conversationHistory.push({

        role:
            role === "assistant"
                ? "assistant"
                : "user",

        content:
            String(content).trim(),

        timestamp:
            Date.now()

    });

    if (
        window.conversationHistory.length >
        CONVERSATION_MAX_MESSAGES
    ) {

        window.conversationHistory =
            window.conversationHistory.slice(
                -CONVERSATION_MAX_MESSAGES
            );

    }

    console.log(
        "💬 Conversation message saved:",
        role
    );

}


/* ==========================================
   GET CONVERSATION HISTORY
========================================== */

function getConversationHistory() {

    cleanConversationHistory();

    return (
        window.conversationHistory || []
    )
    .map(function (item) {

        return {

            role:
                item.role,

            content:
                item.content

        };

    });

}


/* ==========================================
   CLEAR CONVERSATION
========================================== */

function clearConversationHistory() {

    window.conversationHistory = [];

    window.activeVisionContext = null;

    console.log(
        "🧹 Conversation context cleared"
    );

}


/* ==========================================
   SAVE ACTIVE IMAGE CONTEXT
========================================== */

async function saveActiveVisionContext(
    attachment
) {

    if (
        !attachment ||
        getAttachmentType(
            attachment
        ) !== "image"
    ) {

        return false;

    }

    try {

        const imageSource =

            attachment.file ||

            attachment.data ||

            attachment.url ||

            attachment.src ||

            null;

        if (!imageSource) {

            return false;

        }

        let imageData = null;

        if (
            imageSource instanceof Blob
        ) {

            imageData =
                await fileToBase64(
                    imageSource
                );

        }

        else if (
            typeof imageSource === "string"
        ) {

            imageData =
                imageSource;

        }

        if (!imageData) {

            return false;

        }

        window.activeVisionContext = {

            image:
                imageData,

            name:
                attachment.name ||
                "Current image",

            mimeType:
                attachment.mimeType ||
                attachment.file?.type ||
                "image/jpeg",

            createdAt:
                Date.now()

        };

        console.log(
            "🖼️ Active image context saved"
        );

        return true;

    }

    catch (error) {

        console.error(
            "❌ Could not save image context:",
            error
        );

        return false;

    }

}


/* ==========================================
   GET ACTIVE IMAGE CONTEXT
========================================== */

function getActiveVisionContext() {

    const context =
        window.activeVisionContext;

    if (!context) {

        return null;

    }

    if (
        Date.now() -
        context.createdAt >
        CONVERSATION_MAX_AGE
    ) {

        console.log(
            "🕐 Active image context expired"
        );

        window.activeVisionContext =
            null;

        return null;

    }

    return context;

}


/* ==========================================
   CHECK IF RECENT CONVERSATION WAS IMAGE RELATED
========================================== */

function recentConversationWasImageRelated() {

    const history =
        getConversationHistory();

    if (!history.length) {

        return false;

    }

    const recent =
        history.slice(-6);

    const imagePattern =
        /image|picture|photo|pic|screenshot|visual|shown|visible|wearing|shirt|dress|color|colour|text from|read the image|what does.*say|look at/i;

    return recent.some(function (item) {

        return (
            item &&
            typeof item.content === "string" &&
            imagePattern.test(
                item.content
            )
        );

    });

}


/* ==========================================
   DOCUMENT MEMORY SYSTEM
========================================== */

window.currentDocument =
    window.currentDocument || null;


/* ==========================================
   SAVE CURRENT DOCUMENT
========================================== */

function saveCurrentDocument(
    name,
    text
) {

    if (
        !text ||
        !String(text).trim()
    ) {

        return false;

    }

    window.currentDocument = {

        name:
            name ||
            "Uploaded document",

        text:
            String(text).trim(),

        savedAt:
            new Date().toISOString()

    };

    console.log(
        "📚 Document saved to memory:",
        window.currentDocument.name
    );

    return true;

}


/* ==========================================
   GET CURRENT DOCUMENT
========================================== */

function getCurrentDocument() {

    return (
        window.currentDocument ||
        null
    );

}


/* ==========================================
   CHECK CURRENT DOCUMENT
========================================== */

function hasCurrentDocument() {

    return !!(

        window.currentDocument &&

        window.currentDocument.text &&

        String(
            window.currentDocument.text
        ).trim() !== ""

    );

}


/* ==========================================
   CLEAR CURRENT DOCUMENT
========================================== */

function clearCurrentDocument() {

    window.currentDocument =
        null;

    console.log(
        "🗑️ Current document cleared"
    );

}


/* ==========================================
   ATTACHMENT ACCESS
========================================== */

function getCurrentAttachment() {

    return window.aiAttachment || null;

}


/* ==========================================
   ATTACHMENT TYPE DETECTION
========================================== */

function getAttachmentType(
    attachment
) {

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
   IMAGE → ONLINE VISION AI

   IMPORTANT VERSION 13 FIX:
   Vision requests now receive the same
   conversation history as normal AI.
========================================== */

async function analyzeImageWithAI(
    imageSource,
    prompt =
        "Describe and analyze this image clearly."
) {

    try {

        if (!imageSource) {

            return (
                "📷 I couldn't access the image."
            );

        }

        let imageData = null;


        /* ======================================
           FILE / BLOB
        ====================================== */

        if (
            imageSource instanceof Blob
        ) {

            console.log(
                "🖼️ Converting image to Base64..."
            );

            imageData =
                await fileToBase64(
                    imageSource
                );

        }


        /* ======================================
           ALREADY BASE64 / URL
        ====================================== */

        else if (
            typeof imageSource === "string"
        ) {

            imageData =
                imageSource;

        }


        if (!imageData) {

            return (
                "📷 I couldn't access the image data."
            );

        }

        console.log(
            "👀 Sending image + conversation history to Vision AI..."
        );


        /*
           IMPORTANT:

           Do NOT directly fetch here.

           Use askOnlineAI() so the image request
           receives the same conversation history
           as every other online request.
        */

        const imageAttachment = {

            type:
                "image",

            name:
                "Current image",

            mimeType:
                "image/jpeg",

            data:
                imageData

        };

        const result =
            await askOnlineAI(
                String(
                    prompt ||
                    "Describe this image."
                ).trim(),

                imageAttachment,

                true,

                false
            );

        if (
            result &&
            String(result).trim()
        ) {

            return String(
                result
            ).trim();

        }

        return (
            "⚠️ Vision AI returned no answer."
        );

    }

    catch (error) {

        console.error(
            "❌ Vision AI connection error:",
            error
        );

        return (
            "⚠️ Vision AI connection error.\n\n" +
            error.message
        );

    }

}


/* ==========================================
   ONLINE AI BACKEND
   TEXT + IMAGE SUPPORT

   VERSION 13 FIX:

   useActiveImageContext controls whether
   the saved image should be attached.

   This prevents unrelated questions from
   accidentally being sent to Vision AI.
========================================== */

async function askOnlineAI(
    message,
    attachment = null,
    useConversationContext = true,
    useActiveImageContext = false
) {

    try {

        console.log(
            "🌐 Sending request to online AI..."
        );

        let imageData =
            null;


        /* ======================================
           PREPARE EXPLICIT IMAGE
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

                attachment.url ||

                attachment.src ||

                null;

            if (
                imageFile instanceof Blob
            ) {

                console.log(
                    "🖼️ Preparing explicit image for Vision AI..."
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
           CONVERSATION HISTORY
        ====================================== */

        let conversationHistory = [];

        if (
            useConversationContext
        ) {

            conversationHistory =
                getConversationHistory();

        }


        /* ======================================
           ACTIVE IMAGE CONTEXT

           ONLY when explicitly requested.
        ====================================== */

        if (
            !imageData &&
            useActiveImageContext
        ) {

            const visionContext =
                getActiveVisionContext();

            if (visionContext) {

                imageData =
                    visionContext.image;

                console.log(
                    "🖼️ Reusing active image context"
                );

            }

        }


        /* ======================================
           SEND CONVERSATION CONTEXT
        ====================================== */

        console.log(
            "💬 Conversation history:",
            conversationHistory.length,
            "messages"
        );

        console.log(
            "🖼️ Image included:",
            !!imageData
        );


        /* ======================================
           SEND REQUEST
        ====================================== */

        const response =
            await fetch(
                ONLINE_AI_ENDPOINT,
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
                                String(
                                    message || ""
                                ).trim(),

                            image:
                                imageData,

                            history:
                                conversationHistory

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
   IMAGE CONTEXT FOLLOW-UP DETECTION
========================================== */

function shouldUseVisionContext(
    msg
) {

    const context =
        getActiveVisionContext();

    if (!context) {

        return false;

    }

    const text =
        String(msg || "")
        .toLowerCase()
        .trim();

    if (!text) {

        return false;

    }


    /* ======================================
       EXPLICIT IMAGE REFERENCES
    ====================================== */

    const imageWords = [

        "image",
        "picture",
        "photo",
        "pic",
        "screenshot",

        "image says",
        "picture says",
        "photo says",

        "in the image",
        "in this image",

        "in the picture",
        "in this picture",

        "in the photo",
        "in this photo",

        "from the image",
        "from this image",

        "about the image",
        "about this image",

        "about the picture",
        "about this picture",

        "look at",
        "looking at",

        "shown",
        "visible",

        "see in it",
        "see here",

        "this post",
        "the post",
        "that post",

        "this person",
        "that person",
        "the person",

        "this text",
        "that text",
        "the text",

        "this screenshot",
        "that screenshot"

    ];


    if (
        imageWords.some(
            word =>
                text.includes(word)
        )
    ) {

        return true;

    }


    /* ======================================
       COMMON IMAGE QUESTIONS
    ====================================== */

    const imageQuestionPatterns = [

        "what color",
        "what colour",

        "what is he wearing",
        "what is she wearing",

        "what's he wearing",
        "what's she wearing",

        "what are they wearing",

        "who is he",
        "who is she",
        "who are they",

        "where is he",
        "where is she",
        "where are they",

        "what is he doing",
        "what is she doing",
        "what are they doing",

        "what's he doing",
        "what's she doing",

        "how many",

        "can you see",

        "do you see",

        "does he",
        "does she",

        "is he",
        "is she",

        "what does he",
        "what does she",
        "what do they",

        "main point",
        "main idea",

        "what does it say",

        "what did it say",

        "read it",

        "read this",

        "explain the image",

        "explain the picture",

        "describe the picture",

        "describe the photo",

        "describe the image"

    ];


    if (
        imageQuestionPatterns.some(
            pattern =>
                text.includes(pattern)
        )
    ) {

        return true;

    }


    /* ======================================
       SHORT PRONOUN FOLLOW-UPS

       IMPORTANT VERSION 13 FIX:

       We no longer assume that every
       "it", "this", "that", "he", etc.
       means the image.

       It must also be connected to a
       recent image-related conversation.
    ====================================== */

    const followUpWords = [

        "this",
        "that",
        "it",
        "he",
        "she",
        "they",
        "him",
        "her",
        "them",
        "here",
        "there"

    ];

    const words =
        text.split(/\s+/);


    if (
        words.length <= 12 &&

        followUpWords.some(
            word =>
                words.includes(word)
        ) &&

        recentConversationWasImageRelated()

    ) {

        return true;

    }


    return false;

}


/* ==========================================
   IMAGE COMMAND DETECTION
========================================== */

function isImageCommand(
    msg,
    providedAttachment = null
) {

    const attachment =
        providedAttachment ||
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

        isImageAnalysisCommand(text) ||

        isImageQuestion(text)

    );

}


/* ==========================================
   GENERAL IMAGE QUESTION DETECTION
========================================== */

function isImageQuestion(
    msg
) {

    const text =
        String(msg || "")
        .toLowerCase()
        .trim();

    if (!text) {

        return false;

    }

    const patterns = [

        "what color",
        "what colour",

        "wearing",
        "shirt",
        "dress",
        "clothes",
        "clothing",

        "who is this",
        "who is that",

        "what is this",
        "what's this",

        "what is that",
        "what's that",

        "what is it",
        "what's it",

        "what is he",
        "what is she",

        "what's he",
        "what's she",

        "what are they",

        "where is he",
        "where is she",

        "what is he doing",
        "what is she doing",

        "what are they doing",

        "how many",

        "can you see",
        "do you see",

        "what does he",
        "what does she",
        "what do they",

        "does he",
        "does she",

        "is he",
        "is she"

    ];

    return patterns.some(
        pattern =>
            text.includes(pattern)
    );

}


/* ==========================================
   OCR COMMAND DETECTION
========================================== */

function isOCRCommand(
    msg
) {

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

        text.includes("what does it say") ||

        text.includes("what did it say") ||

        text.includes("read this image") ||

        text.includes("read the image") ||

        text === "read it"

    );

}


/* ==========================================
   IMAGE ANALYSIS DETECTION
========================================== */

function isImageAnalysisCommand(
    msg
) {

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

        text.includes("tell me about the image") ||

        text.includes("describe the image") ||

        text.includes("describe the picture") ||

        text.includes("describe the photo")

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
       GET IMAGE
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
        "🖼️ Image:",
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
            "📝 OCR command detected"
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

                    return String(
                        result
                    ).trim();

                }

            }

            catch (error) {

                console.error(
                    "❌ OCR ERROR:",
                    error
                );

            }

        }


        /* ==================================
           GROQ VISION OCR FALLBACK
        ================================== */

        return await analyzeImageWithAI(

            imageSource,

            `
Extract the readable text and important text elements from this image.

The goal is to give the user a clean, human-readable transcription of the image.

Follow these rules:

1. Carefully inspect the entire image before answering.
2. Read the main content accurately.
3. Preserve names, usernames, @mentions, numbers, headings, and the original wording.
4. Do not invent text.
5. If a word or line is genuinely unreadable, write [unclear].
6. Ignore phone status bars, battery percentage, signal icons, browser controls, and other device interface elements unless they are part of the content being requested.
7. Do not include random OCR characters or symbols caused by image artifacts.
8. Understand the layout of the image and organize the extracted information logically.
9. If the image is a social-media post, identify useful sections such as:
   - Platform or page
   - Story/feed names
   - Post author
   - Time
   - Shared post information
   - Username
   - Main post text
10. Use simple headings and bullet points when they make the extracted text easier to understand.
11. Preserve the actual post/message text as a continuous passage where appropriate.
12. Do not summarize or change the meaning of the original text.
13. Do not describe objects or people unless their text/name is part of the visible content.
14. Return the result in a clean format beginning with:

Here’s the text from the image:

Then organize the extracted content clearly.

Before finalizing, compare the extracted text against the image and correct obvious OCR mistakes.
            `.trim()

        );

    }


    /* ======================================
       VISION ANALYSIS
    ====================================== */

    console.log(
        "👀 Sending image to Groq Vision AI..."
    );

    const result =
        await analyzeImageWithAI(

            imageSource,

            msg ||
            "Describe and analyze this image clearly."

        );

    if (
        result &&
        String(result).trim() !== ""
    ) {

        return String(
            result
        ).trim();

    }

    return (
        "⚠️ I couldn't analyze this image right now."
    );

}


/* ==========================================
   FILE COMMAND DETECTION
========================================== */

function isFileCommand(
    msg
) {

    const attachment =
        getCurrentAttachment();

    const attachmentType =
        getAttachmentType(
            attachment
        );

    if (
        attachmentType !== "file"
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

        text.includes("summarize") ||
        text.includes("summary") ||

        text.includes("read the file") ||
        text.includes("read this file") ||
        text.includes("read document") ||

        text.includes("explain") ||
        text.includes("analyze") ||
        text.includes("analyse") ||

        text.includes("important") ||
        text.includes("key points") ||
        text.includes("main points") ||

        text.includes("what does") ||
        text.includes("what is") ||
        text.includes("who is") ||
        text.includes("when") ||
        text.includes("where") ||
        text.includes("why") ||
        text.includes("how") ||

        text.includes("file") ||
        text.includes("document") ||

        text.includes("this")

    );

}


/* ==========================================
   DETECT FILE CONTENT
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

async function answerFileQuestion(
    msg
) {

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
   FILE TEXT LIMITER
========================================== */

function limitFileText(
    text,
    maxLength = 20000
) {

    if (!text) {

        return "";

    }

    const cleanText =
        String(text).trim();

    if (
        cleanText.length <= maxLength
    ) {

        return cleanText;

    }

    console.warn(
        "⚠️ File is very large. Truncating text for AI."
    );

    return (
        cleanText.slice(
            0,
            maxLength
        ) +

        "\n\n[Document truncated because it is very large.]"
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
        attachment.file?.name ||
        "Unnamed file"
    );


    /* ======================================
       CHECK FILE EXTRACTION ENGINE
    ====================================== */

    if (
        typeof window.extractFileText !==
        "function"
    ) {

        console.error(
            "❌ extractFileText not available"
        );

        return (
            "📄 The file-reading engine is not connected yet."
        );

    }


    try {

        console.log(
            "📖 Extracting document text..."
        );


        const extractedText =
            await window.extractFileText(
                attachment
            );


        if (
            !extractedText ||
            !String(extractedText).trim()
        ) {

            return (
                "📄 I couldn't extract readable text from this file.\n\n" +
                "The file may be empty, scanned as an image, or in an unsupported format."
            );

        }


        console.log(
            "✅ File text extracted:",
            extractedText.length,
            "characters"
        );


        /* ==================================
           SAVE DOCUMENT TO MEMORY
        ================================== */

        const currentFileName =
            attachment.name ||
            attachment.file?.name ||
            "Uploaded document";

        saveCurrentDocument(
            currentFileName,
            extractedText
        );


        /* ==================================
           LIMIT LARGE DOCUMENTS
        ================================== */

        const documentText =
            limitFileText(
                extractedText
            );

        const userRequest =
            String(msg || "").trim();

        const fileName =
            attachment.name ||
            attachment.file?.name ||
            "this document";


        /* ==================================
           BUILD AI PROMPT
        ================================== */

        const aiPrompt =
            "You are analyzing an uploaded document.\n\n" +

            "File name: " +
            fileName +
            "\n\n" +

            "User request: " +
            userRequest +
            "\n\n" +

            "DOCUMENT CONTENT:\n" +
            documentText +
            "\n\n" +

            "INSTRUCTIONS:\n" +

            "1. Answer the user's request based only on the document content.\n" +

            "2. Do not reproduce or list the entire document.\n" +

            "3. Give a clear and useful response.\n" +

            "4. Focus on the most important information.\n" +

            "5. If summarizing, provide a concise summary with key points.\n" +

            "6. If information requested by the user is not in the document, clearly say so.";


        console.log(
            "🤖 Sending document analysis to Online AI..."
        );


        const result =
            await askOnlineAI(
                aiPrompt
            );


        if (
            result &&
            String(result).trim()
        ) {

            console.log(
                "✅ Document AI analysis complete"
            );

            return String(
                result
            ).trim();

        }


        return (
            "⚠️ I successfully read the file, but I couldn't complete the AI analysis right now.\n\n" +
            "Please check your internet connection and try again."
        );

    }

    catch (error) {

        console.error(
            "❌ FILE ANALYSIS ERROR:",
            error
        );

        return (
            "⚠️ Something went wrong while analyzing the file."
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

function isUploadListCommand(
    msg
) {

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
   DOCUMENT QUESTION DETECTION
========================================== */

function isDocumentQuestion(
    msg
) {

    if (!msg) {

        return false;

    }

    if (
        typeof window.hasCurrentDocument !==
        "function"
    ) {

        return false;

    }

    if (
        !window.hasCurrentDocument()
    ) {

        return false;

    }

    const text =
        String(msg)
        .toLowerCase()
        .trim();


    const documentWords = [

        "document",
        "file",
        "pdf",
        "this document",
        "this file",
        "uploaded file",
        "uploaded document",
        "the document",
        "the file"

    ];


    const questionPatterns = [

        "what is this about",
        "what is it about",
        "summarize",
        "summary",
        "explain",
        "important points",
        "key points",
        "main points",
        "main idea",
        "tell me about",
        "what does",
        "who is",
        "when is",
        "where is",
        "why",
        "how",
        "section",
        "chapter",
        "page",
        "according to",
        "mentioned",
        "information"

    ];


    const hasDocumentWord =
        documentWords.some(
            word =>
                text.includes(word)
        );


    const hasQuestionPattern =
        questionPatterns.some(
            pattern =>
                text.includes(pattern)
        );


    return (
        hasDocumentWord ||
        hasQuestionPattern
    );

}


/* ==========================================
   DOCUMENT QUESTION HANDLER
========================================== */

async function handleDocumentQuestion(
    msg
) {

    try {

        if (
            typeof window.getCurrentDocument !==
            "function"
        ) {

            return null;

        }

        const document =
            window.getCurrentDocument();

        if (!document) {

            return null;

        }

        console.log(
            "📚 Document question detected"
        );

        console.log(
            "📄 Document:",
            document.name
        );


        const documentText =
            String(
                document.text || ""
            ).slice(
                0,
                12000
            );


        if (!documentText.trim()) {

            return null;

        }


        const prompt =
            "Answer the user's question using the uploaded document below.\n\n" +

            "Document: " +
            document.name +

            "\n\nDOCUMENT CONTENT:\n" +

            documentText +

            "\n\nUSER QUESTION:\n" +

            msg +

            "\n\nINSTRUCTIONS:\n" +

            "- Answer based only on the uploaded document.\n" +
            "- Do not invent information.\n" +
            "- Give a clear and helpful answer.\n" +
            "- Keep the answer concise.\n" +
            "- Do not reproduce the entire document unless specifically asked.";


        console.log(
            "🧠 Sending document question to Online AI..."
        );


        const response =
            await askOnlineAI(
                prompt
            );


        if (
            response &&
            String(response).trim()
        ) {

            return String(
                response
            ).trim();

        }

        return null;

    }

    catch (error) {

        console.error(
            "❌ Document question error:",
            error
        );

        return null;

    }

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

async function processSmartAIReply(
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
       
       VERSION 13 FIX:

       Save the image context, but DO NOT
       automatically force every message
       into Vision AI.
    ====================================== */

    if (
        attachmentType === "image"
    ) {

        console.log(
            "🖼️ IMAGE ATTACHMENT FOUND"
        );


        await saveActiveVisionContext(
            attachment
        );


        /*
           Only use Vision immediately if
           the user's message is actually
           about the image.
        */

        if (
            isImageCommand(
                original,
                attachment
            )
        ) {

            console.log(
                "🖼️ User request is image-related"
            );

            return await handleImageCommand(
                original,
                attachment
            );

        }


        /*
           IMPORTANT:

           If the user says something unrelated
           while an image is attached, continue
           through the normal AI modules.

           Example:

           Image attached
           User: "What's the weather today?"

           This will NOT automatically become
           a Vision request.
        */

        console.log(
            "💬 Image attached but request is not image-related."
        );

    }


    /* ======================================
       IMAGE FOLLOW-UP FROM SAVED CONTEXT
    ====================================== */

    if (
        shouldUseVisionContext(
            original
        )
    ) {

        console.log(
            "🖼️ IMAGE CONTEXT FOLLOW-UP"
        );

        const visionContext =
            getActiveVisionContext();


        if (visionContext) {

            const visionAttachment = {

                type:
                    "image",

                name:
                    visionContext.name,

                mimeType:
                    visionContext.mimeType,

                data:
                    visionContext.image

            };


            return await handleImageCommand(

                original,

                visionAttachment

            );

        }

    }


    /* ======================================
       FILE ATTACHMENT
    ====================================== */

    if (
        attachmentType === "file"
    ) {

        console.log(
            "📄 FILE ATTACHMENT FOUND"
        );

        const fileReply =
            await handleFileCommand(
                original
            );

        return fileReply;

    }


    /* ======================================
       DOCUMENT MEMORY QUESTIONS
    ====================================== */

    if (
        isDocumentQuestion(
            original
        )
    ) {

        console.log(
            "📚 CURRENT DOCUMENT QUESTION FOUND"
        );

        const documentReply =
            await handleDocumentQuestion(
                original
            );

        if (documentReply) {

            return documentReply;

        }

    }


    /* ======================================
       FILE QUESTION MODE
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

       IMPORTANT:

       No active image is automatically
       attached here.

       Normal questions remain normal
       text conversations.
    ====================================== */

    console.log(
        "🌐 No local AI module answered."
    );

    console.log(
        "🌐 Trying online AI..."
    );


    const onlineReply =
        await askOnlineAI(
            original,
            null,
            true,
            false
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
   PUBLIC CONVERSATION-AWARE AI
========================================== */

async function smartAIReply(
    rawMessage,
    providedAttachment = null
) {

    const message =
        String(
            rawMessage || ""
        ).trim();

    if (!message) {

        return null;

    }


    /* ======================================
       SAVE NEW IMAGE CONTEXT
    ====================================== */

    if (
        providedAttachment &&
        getAttachmentType(
            providedAttachment
        ) === "image"
    ) {

        await saveActiveVisionContext(
            providedAttachment
        );

    }


    /* ======================================
       PROCESS AI REQUEST
    ====================================== */

    const response =
        await processSmartAIReply(
            message,
            providedAttachment
        );


    /* ======================================
       SAVE CONVERSATION
    ====================================== */

    addConversationMessage(
        "user",
        message
    );


    if (
        response &&
        String(response).trim()
    ) {

        addConversationMessage(
            "assistant",
            String(response).trim()
        );

    }


    return response;

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.smartAIReply =
    smartAIReply;

window.addConversationMessage =
    addConversationMessage;

window.getConversationHistory =
    getConversationHistory;

window.clearConversationHistory =
    clearConversationHistory;

window.saveActiveVisionContext =
    saveActiveVisionContext;

window.getActiveVisionContext =
    getActiveVisionContext;

window.shouldUseVisionContext =
    shouldUseVisionContext;

window.recentConversationWasImageRelated =
    recentConversationWasImageRelated;

window.askOnlineAI =
    askOnlineAI;

window.fileToBase64 =
    fileToBase64;

window.limitFileText =
    limitFileText;

window.getCurrentAttachment =
    getCurrentAttachment;

window.getAttachmentType =
    getAttachmentType;

window.isImageCommand =
    isImageCommand;

window.isImageQuestion =
    isImageQuestion;

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

window.summarizeFileContent =
    summarizeFileContent;

window.handleImageCommand =
    handleImageCommand;

window.analyzeImageWithAI =
    analyzeImageWithAI;

window.analyzeImage =
    async function (
        imageSource,
        prompt
    ) {

        return await analyzeImageWithAI(
            imageSource,
            prompt
        );

    };

window.handleFileCommand =
    handleFileCommand;

window.getUploadList =
    getUploadList;

window.getAIModules =
    getAIModules;

window.isDocumentQuestion =
    isDocumentQuestion;

window.handleDocumentQuestion =
    handleDocumentQuestion;

window.saveCurrentDocument =
    saveCurrentDocument;

window.getCurrentDocument =
    getCurrentDocument;

window.hasCurrentDocument =
    hasCurrentDocument;

window.clearCurrentDocument =
    clearCurrentDocument;


/* ==========================================
   READY CHECK
========================================== */

console.log(
    "========================================"
);

console.log(
    "✅ smartAI.js Version 13.0 ready"
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
    "🔎 Active vision context:",
    !!window.activeVisionContext
);

console.log(
    "🔎 Conversation messages:",
    (
        window.conversationHistory || []
    ).length
);

console.log(
    "========================================"
);
