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
   FILE CREATION
========================================== */

function isFileCreationCommand(message) {

    if (!message) return false;

    const text =
        String(message)
            .trim()
            .toLowerCase();

    return (
        /\b(create|make|generate|write|prepare)\b/.test(text) &&
        /\b(file|document|text file|markdown|csv|txt)\b/.test(text)
    );
}


function detectFileCreationType(message) {

    const text =
        String(message || "")
            .toLowerCase();

    if (
        /\b(csv|spreadsheet|comma[- ]separated)\b/.test(text)
    ) {
        return {
            extension: "csv",
            mimeType: "text/csv"
        };
    }

    if (
        /\b(markdown|\.md)\b/.test(text)
    ) {
        return {
            extension: "md",
            mimeType: "text/markdown"
        };
    }

    return {
        extension: "txt",
        mimeType: "text/plain"
    };
}


function detectRequestedFilename(message, extension) {

    const text =
        String(message || "")
            .trim();


    /*
     * Look for:
     *
     * "called notes.txt"
     * "named report.md"
     * "filename data.csv"
     */

    const filenameMatch =
        text.match(
            /\b(?:called|named|filename|file\s+name)\s+["']?([^"'\n]+?)["']?(?:\s|$)/i
        );


    if (
        filenameMatch &&
        filenameMatch[1]
    ) {

        let filename =
            filenameMatch[1]
                .trim()
                .replace(
                    /[?.!,]+$/,
                    ""
                );


        if (
            !/\.[a-z0-9]+$/i.test(
                filename
            )
        ) {

            filename +=
                "." + extension;

        }


        return filename;

    }


    return (
        "AI-Life-Assistant-" +
        Date.now() +
        "." +
        extension
    );

}


function isFileEditingCommand(message) {

    if (!message) return false;

    const text =
        String(message)
            .trim()
            .toLowerCase();

    return (
        /\b(edit|modify|update|change|rewrite|revise|correct|fix|remove|delete|add)\b/.test(text) &&
        /\b(file|document|text|markdown|csv|txt|docx|word|pdf)\b/.test(text)
    );
}

/* ==========================================
   AI FILE EDITOR
========================================== */

async function editAIFile(message) {

    console.log(
        "✏️ AI FILE EDITOR STARTED:",
        message
    );


    const attachment =
        getCurrentAttachment();


    /* ======================================
       CHECK ATTACHMENT
    ====================================== */

    if (!attachment) {

        throw new Error(
            "No file is currently attached."
        );

    }


    if (
        getAttachmentType(
            attachment
        ) !== "file"
    ) {

        throw new Error(
            "The current attachment is not a file."
        );

    }


    /* ======================================
       CHECK FILE READER
    ====================================== */

    if (
        typeof window.extractFileText !==
        "function"
    ) {

        throw new Error(
            "File-reading engine is unavailable."
        );

    }


    /* ======================================
       READ ORIGINAL FILE
    ====================================== */

    console.log(
        "📖 Reading original file..."
    );


    const extractedText =
        await window.extractFileText(
            attachment
        );


    if (
        !extractedText ||
        !String(extractedText).trim()
    ) {

        throw new Error(
            "I couldn't extract readable text from this file."
        );

    }


    console.log(
        "✅ Original file extracted:",
        extractedText.length,
        "characters"
    );


    /* ======================================
       ORIGINAL FILENAME
    ====================================== */

    const originalFilename =
        attachment.file?.name ||
        attachment.name ||
        "document.txt";


    saveCurrentDocument(
        originalFilename,
        extractedText
    );


    /* ======================================
       LIMIT CONTENT
    ====================================== */

    const documentText =
        limitFileText(
            extractedText,
            12000
        );


    /* ======================================
       FIND EXPLICIT OUTPUT FILENAME
    ====================================== */

    const explicitNameMatch =
        String(message || "").match(
            /\b(?:change|rename|save|call|name|make)\b[\s\S]{0,40}?\b(?:to|as|named|called)\b\s*["'`]?([A-Za-z0-9_.-]+\.(?:txt|md|csv|json|js|css|html?|xml|py|java|php|ts|docx|pdf))["'`]?/i
        );


    let editedFilename = null;


    if (
        explicitNameMatch &&
        explicitNameMatch[1]
    ) {

        editedFilename =
            explicitNameMatch[1].trim();

    }


    /* ======================================
       IF NO EXPLICIT NAME:
       CREATE ORIGINAL-NAME-EDITED.EXT
    ====================================== */

    if (
        !editedFilename
    ) {

        const lastDot =
            originalFilename.lastIndexOf(
                "."
            );


        if (
            lastDot > 0
        ) {

            editedFilename =
                originalFilename.slice(
                    0,
                    lastDot
                ) +
                "-edited" +
                originalFilename.slice(
                    lastDot
                );

        }

        else {

            editedFilename =
                originalFilename +
                "-edited.txt";

        }

    }


    /* ======================================
       DETERMINE MIME TYPE FROM OUTPUT NAME
    ====================================== */

    const extensionMatch =
        editedFilename.match(
            /\.([a-z0-9]+)$/i
        );


    const extension =
        extensionMatch
            ? extensionMatch[1].toLowerCase()
            : "txt";


    const mimeMap = {

        txt: "text/plain",
        md: "text/markdown",
        csv: "text/csv",
        json: "application/json",
        js: "application/javascript",
        css: "text/css",
        html: "text/html",
        htm: "text/html",
        xml: "application/xml",
        py: "text/x-python",
        java: "text/x-java-source",
        php: "application/x-httpd-php",
        ts: "application/typescript",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        pdf: "application/pdf"

    };


    const mimeType =
        mimeMap[extension] ||
        "text/plain";


    /* ======================================
       SEND ONE FILE-EDIT REQUEST
    ====================================== */

    console.log(
        "🤖 Sending file edit request..."
    );


    console.log(
        "📄 Output filename:",
        editedFilename
    );


    console.log(
        "📦 Output MIME type:",
        mimeType
    );


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

                        fileEdit: {

                            filename:
                                editedFilename,

                            mimeType:
                                mimeType,

                            instruction:
                                String(
                                    message || ""
                                ).trim(),

                            content:
                                documentText

                        }

                    })

            }
        );


    /* ======================================
       READ RESPONSE SAFELY
    ====================================== */

    const data =
        await response.json();


    /* ======================================
       ERROR HANDLING
    ====================================== */

    if (
        !response.ok
    ) {

        if (
            response.status ===
            429
        ) {

            const seconds =
                Number(
                    data?.retryAfter
                ) || 10;


            throw new Error(
                "The AI service is temporarily busy. " +
                "Please wait about " +
                seconds +
                " seconds and try again."
            );

        }


        throw new Error(
            data?.error ||
            "AI could not edit the file."
        );

    }


    /* ======================================
       VALIDATE FILE RESPONSE
    ====================================== */

    if (
        !data?.success ||
        !data?.file?.data
    ) {

        throw new Error(
            "File engine returned no edited file."
        );

    }


    console.log(
        "✅ EDITED FILE CREATED:",
        data.file.filename
    );


    return data.file;

}

async function createAIFile(message) {

    const fileType =
        detectFileCreationType(
            message
        );


    const filename =
        detectRequestedFilename(
            message,
            fileType.extension
        );


    /*
     * Ask the normal AI endpoint to
     * create the actual file content.
     */

    const contentPrompt = `
Create the content for the requested ${fileType.extension.toUpperCase()} file.

User request:
${message}

Important:
- Return ONLY the actual file content.
- Do not add explanations before or after the content.
- Do not use Markdown code fences.
- For CSV, return valid CSV only.
- Make the content complete and useful.
`;


    const response =
        await fetch(
            ONLINE_AI_ENDPOINT,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    message:
                        contentPrompt,

                    history:
                        getConversationHistory()

                })

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data?.error ||
            "AI could not create the file content."
        );

    }


    const content =
        String(
            data?.reply || ""
        ).trim();


    if (!content) {

        throw new Error(
            "AI returned empty file content."
        );

    }


    /*
     * Remove accidental code fences.
     */

    const cleanContent =
        content
            .replace(
                /^```(?:text|txt|markdown|md|csv)?\s*/i,
                ""
            )
            .replace(
                /\s*```$/i,
                ""
            )
            .trim();


    const fileResponse =
        await fetch(
            ONLINE_AI_ENDPOINT,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    createFile: {

                        filename:
                            filename,

                        mimeType:
                            fileType.mimeType,

                        content:
                            cleanContent

                    }

                })

            }
        );


    const fileData =
        await fileResponse.json();


    if (!fileResponse.ok) {

        throw new Error(
            fileData?.error ||
            "File creation failed."
        );

    }


    if (
        !fileData?.success ||
        !fileData?.file?.data
    ) {

        throw new Error(
            "File engine returned no file."
        );

    }


    return fileData.file;

}


window.isFileCreationCommand =
    isFileCreationCommand;

window.createAIFile =
    createAIFile;
window.isFileEditingCommand =
    isFileEditingCommand;
window.editAIFile =
    editAIFile;
/* ==========================================
   CONVERSATION CONTEXT SYSTEM
========================================== */

const CONVERSATION_MAX_MESSAGES = 40;

/*
   Keep conversation context available for
   longer conversations.

   We are no longer expiring the conversation
   after only 30 minutes. The conversation
   manager is responsible for persistence.
*/
const CONVERSATION_MAX_AGE =
    24 * 60 * 60 * 1000; // 24 hours

window.conversationHistory =
    window.conversationHistory || [];

window.activeVisionContext =
    window.activeVisionContext || null;

/* ==========================================
   IMAGE WORKSPACE / VERSION HISTORY
========================================== */

const IMAGE_WORKSPACE_STORAGE_KEY =
    "aiLifeAssistant_imageWorkspace";

const IMAGE_WORKSPACE_MAX_VERSIONS = 5;


/* ==========================================
   LOAD IMAGE WORKSPACE
========================================== */

function loadImageWorkspace() {

    try {

        const saved =
            localStorage.getItem(
                IMAGE_WORKSPACE_STORAGE_KEY
            );

        if (!saved) {

            return {
                activeImage: null,
                versions: []
            };

        }

        const parsed =
            JSON.parse(saved);

        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return {
                activeImage: null,
                versions: []
            };

        }

        return {

            activeImage:
                typeof parsed.activeImage === "string"
                    ? parsed.activeImage
                    : null,

            versions:
                Array.isArray(parsed.versions)
                    ? parsed.versions
                    : []

        };

    }

    catch (error) {

        console.warn(
            "⚠️ Could not load image workspace:",
            error
        );

        return {
            activeImage: null,
            versions: []
        };

    }

}


/* ==========================================
   SAVE IMAGE WORKSPACE
========================================== */

function saveImageWorkspace(
    workspace
) {

    try {

        localStorage.setItem(
            IMAGE_WORKSPACE_STORAGE_KEY,
            JSON.stringify(workspace)
        );

        console.log(
            "💾 Image workspace saved"
        );

        return true;

    }

    catch (error) {

        console.warn(
            "⚠️ Could not save image workspace:",
            error
        );

        /*
         * If browser storage is full,
         * remove the oldest versions and
         * try again.
         */

        try {

            const reducedWorkspace = {

                activeImage:
                    workspace.activeImage || null,

                versions:
                    Array.isArray(
                        workspace.versions
                    )
                        ? workspace.versions.slice(-2)
                        : []

            };

            localStorage.setItem(
                IMAGE_WORKSPACE_STORAGE_KEY,
                JSON.stringify(
                    reducedWorkspace
                )
            );

            console.log(
                "💾 Image workspace saved with reduced history"
            );

            return true;

        }

        catch (retryError) {

            console.error(
                "❌ Image workspace storage failed:",
                retryError
            );

            return false;

        }

    }

}


/* ==========================================
   INITIALIZE IMAGE WORKSPACE
========================================== */

window.imageWorkspace =
    loadImageWorkspace();


/* ==========================================
   GET ACTIVE GENERATED IMAGE
========================================== */

function getActiveGeneratedImage() {

    /*
     * Prefer the live runtime value.
     */

    if (
        typeof window.activeGeneratedImage ===
        "string" &&
        window.activeGeneratedImage.trim()
    ) {

        return window.activeGeneratedImage;

    }


    /*
     * Restore from persistent workspace.
     */

    const workspace =
        window.imageWorkspace ||
        loadImageWorkspace();

    if (
        workspace &&
        typeof workspace.activeImage ===
            "string" &&
        workspace.activeImage.trim()
    ) {

        window.activeGeneratedImage =
            workspace.activeImage;

        console.log(
            "♻️ Active generated image restored"
        );

        return workspace.activeImage;

    }

    return null;

}


/* ==========================================
   SAVE GENERATED IMAGE VERSION
========================================== */

function saveGeneratedImageVersion(
    image,
    prompt = "",
    operation = "generate"
) {

    if (
        !image ||
        typeof image !== "string"
    ) {

        return false;

    }

    const cleanImage =
        image.trim();

    if (!cleanImage) {

        return false;

    }

    let workspace =
        window.imageWorkspace ||
        loadImageWorkspace();


    /*
     * Make this image the active image.
     */

    window.activeGeneratedImage =
        cleanImage;


    /*
     * Create version record.
     */

    const version = {

        id:
            "image_" +
            Date.now(),

        image:
            cleanImage,

        prompt:
            String(
                prompt || ""
            ).trim(),

        operation:
            operation === "edit"
                ? "edit"
                : "generate",

        createdAt:
            new Date().toISOString()

    };


    /*
     * Add newest version.
     */

    const versions =
        Array.isArray(
            workspace.versions
        )
            ? workspace.versions
            : [];

    versions.push(version);


    /*
     * Keep only the newest versions.
     */

    workspace.versions =
        versions.slice(
            -IMAGE_WORKSPACE_MAX_VERSIONS
        );

    workspace.activeImage =
        cleanImage;


    window.imageWorkspace =
        workspace;


    /*
     * Persist workspace.
     */

    saveImageWorkspace(
        workspace
    );


    console.log(
        "🖼️ Image version saved:",
        version.operation,
        version.id
    );

    return version;

}


/* ==========================================
   GET IMAGE HISTORY
========================================== */

function getImageHistory() {

    const workspace =
        window.imageWorkspace ||
        loadImageWorkspace();

    return Array.isArray(
        workspace.versions
    )
        ? workspace.versions
        : [];

}


/* ==========================================
   RESTORE IMAGE VERSION
========================================== */

function restoreImageVersion(
    versionId
) {

    const history =
        getImageHistory();

    const version =
        history.find(
            function (item) {

                return (
                    item &&
                    item.id === versionId
                );

            }
        );

    if (!version) {

        return null;

    }

    window.activeGeneratedImage =
        version.image;


    const workspace =
        window.imageWorkspace ||
        loadImageWorkspace();

    workspace.activeImage =
        version.image;

    window.imageWorkspace =
        workspace;

    saveImageWorkspace(
        workspace
    );


    console.log(
        "♻️ Image version restored:",
        version.id
    );

    return version.image;

}


/* ==========================================
   CLEAR IMAGE WORKSPACE
========================================== */

function clearImageWorkspace() {

    window.activeGeneratedImage =
        null;

    window.imageWorkspace = {

        activeImage:
            null,

        versions:
            []

    };

    try {

        localStorage.removeItem(
            IMAGE_WORKSPACE_STORAGE_KEY
        );

    }

    catch (error) {

        console.warn(
            "⚠️ Could not clear image workspace:",
            error
        );

    }

    console.log(
        "🧹 Image workspace cleared"
    );

}


/* ==========================================
   PUBLIC IMAGE WORKSPACE API
========================================== */

window.getActiveGeneratedImage =
    getActiveGeneratedImage;

window.saveGeneratedImageVersion =
    saveGeneratedImageVersion;

window.getImageHistory =
    getImageHistory;

window.restoreImageVersion =
    restoreImageVersion;

window.clearImageWorkspace =
    clearImageWorkspace;
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

    const history =
        window.conversationHistory || [];

    
    /*
     * =====================================================
     * PHASE 9C.8
     * CONTEXT SAFETY VALIDATION
     * =====================================================
     */

    if (!Array.isArray(history)) {
        window.conversationHistory = [];
        return [];
    }

    const validHistory =
        history.filter(function (item) {

            if (!item || typeof item !== "object") {
                return false;
            }

            if (
                item.role !== "user" &&
                item.role !== "assistant"
            ) {
                return false;
            }

            if (
                typeof item.content !== "string"
            ) {
                return false;
            }

            if (
                !item.content.trim()
            ) {
                return false;
            }

            return true;
        });
   if (!history.length) {
        return [];
    }

    const MAX_CONTEXT_MESSAGES = 24;
    /*
     * =====================================================
     * PHASE 9C.7
     * SMART CONTEXT COMPRESSION
     * =====================================================
     */

    const recentHistory =
    validHistory.slice(-MAX_CONTEXT_MESSAGES);
    const imageKeywords =
        /\b(image|photo|picture|pictured|shown|see|look|this|that|it|attachment|uploaded|camera|visual)\b/i;

    const importantKeywords =
        /\b(my name|my name is|i am|i'm|i live|i work|my job|my goal|my project|remember|important|prefer|preference|birthday|family|friend|school|business)\b/i;

    /*
     * First score the recent messages.
     */
    const scoredHistory =
        recentHistory.map(function (item, index) {

            let score = index;

            const text =
                String(item.content || "");

            if (imageKeywords.test(text)) {
                score += 20;
            }

            if (importantKeywords.test(text)) {
                score += 15;
            }

            if (item.role === "user") {
                score += 5;
            }

            return {
                item: item,
                score: score,
                originalIndex: index
            };
        });

    /*
     * Select the strongest context.
     */
    scoredHistory.sort(function (a, b) {
        return b.score - a.score;
    });

    const selectedHistory =
        scoredHistory
            .slice(0, MAX_CONTEXT_MESSAGES)
            .sort(function (a, b) {
                return a.originalIndex - b.originalIndex;
            });

    /*
     * =====================================================
     * COMPRESS REPEATED SAME-ROLE MESSAGES
     * =====================================================
     */

    const compressedHistory = [];

    selectedHistory.forEach(function (entry) {

        const item = entry.item;

        const last =
            compressedHistory[
                compressedHistory.length - 1
            ];

        /*
         * If two consecutive messages have the same
         * role, combine them instead of sending them
         * as separate messages.
         */
        if (
            last &&
            last.role === item.role
        ) {
            last.content +=
                "\n" +
                String(item.content || "");
        } else {
            compressedHistory.push({
                role: item.role,
                content: String(item.content || "")
            });
        }
    });

    return compressedHistory;
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
text.includes("this") ||

text.includes("edit") ||
text.includes("modify") ||
text.includes("update") ||
text.includes("rewrite") ||
text.includes("revise") ||
text.includes("correct") ||
text.includes("fix") ||
text.includes("add") ||
text.includes("remove") ||
text.includes("delete")

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

   /* ==========================================
   FILE CREATION
========================================== */

if (
    isFileCreationCommand(original)
) {

    try {

        const file =
            await createAIFile(
                original
            );


        /*
         * Return a structured marker.
         * The frontend will handle the
         * actual download in the next step.
         */

        return (
            "__AI_CREATED_FILE__" +
            JSON.stringify({
                filename:
                    file.filename,

                mimeType:
                    file.mimeType,

                size:
                    file.size,

                data:
                    file.data
            }) +
            "__END_AI_CREATED_FILE__"
        );

    }

    catch (error) {

        console.error(
            "❌ AI file creation failed:",
            error
        );


        return (
            "⚠️ I couldn't create that file right now.\n\n" +
            error.message
        );

    }

}

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


    /* ==================================
       FILE EDITING
    ================================== */

    if (
        isFileEditingCommand(
            original
        )
    ) {

        console.log(
            "✏️ FILE EDITING COMMAND DETECTED"
        );

        try {

            const editedFile =
                await editAIFile(
                    original
                );


            return (
                "__AI_CREATED_FILE__" +
                JSON.stringify(
                    editedFile
                ) +
                "__END_AI_CREATED_FILE__"
            );

        }

        catch (error) {

            console.error(
                "❌ FILE EDITING ERROR:",
                error
            );

            return (
                "⚠️ I couldn't edit that file.\n\n" +
                (
                    error?.message ||
                    "An unknown error occurred."
                )
            );

        }

    }


    /* ==================================
       NORMAL FILE COMMAND
    ================================== */

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
   🎨 AI IMAGE ENGINE
========================================== */

async function generateAIImage(
    prompt,
    sourceImage = null
) {

    try {

        if (
            !prompt ||
            typeof prompt !== "string"
        ) {

            throw new Error(
                "Image prompt is required."
            );

        }


        const requestBody = {

            prompt:
                prompt.trim()

        };


        /*
         * If an existing image is supplied,
         * this becomes an image-edit request.
         */

        if (sourceImage) {

            let imageData =
                sourceImage;


            /*
             * Support an attachment object.
             */

            if (
                typeof sourceImage === "object"
            ) {

                if (
                    sourceImage.image
                ) {

                    imageData =
                        sourceImage.image;

                } else if (
                    sourceImage.dataUrl
                ) {

                    imageData =
                        sourceImage.dataUrl;

                } else if (
                    sourceImage.base64
                ) {

                    imageData =
                        sourceImage.base64;

                }

            }


            if (
                typeof imageData === "string" &&
                imageData.trim()
            ) {

                requestBody.image =
                    imageData;

            }

        }


        console.log(
            "🎨 Sending request to Image Engine..."
        );


        const response =
            await fetch(
                "https://ai-life-assistant-backend.vercel.app/api/image",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            requestBody
                        )

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "❌ Image Engine error:",
                data
            );


            throw new Error(
                data.error ||
                data.details ||
                "Image generation failed."
            );

        }


        if (
            !data.success ||
            !data.image
        ) {

            throw new Error(
                "Image engine returned no image."
            );

        }


        console.log(
            "✅ Image generated successfully."
        );


        return {

            success:
                true,

            image:
                data.image,

            operation:
                data.operation ||
                "generate",

            prompt:
                data.prompt ||
                prompt

        };


    } catch (error) {

        console.error(
            "🎨 Image Engine:",
            error
        );


        return {

            success:
                false,

            error:
                error.message ||
                "Unable to generate image."

        };

    }

}


/*
 * Make the image engine available
 * to the rest of the application.
 */

window.generateAIImage =
    generateAIImage;

/* ==========================================
   PUBLIC CONVERSATION-AWARE AI
========================================== */

async function smartAIReply(
    rawMessage,
    providedAttachment = null
) {

    /* ======================================
       NORMALIZE MESSAGE FIRST
    ====================================== */

    const message =
        String(
            rawMessage || ""
        ).trim();

    if (!message) {
        return null;
    }

    /* ======================================
       🧭 AI TOOL ROUTER
    ====================================== */

    let toolIntent = null;

    try {

        if (
            window.aiToolRouter &&
            typeof window.aiToolRouter.detectIntent === "function"
        ) {

            toolIntent =
                window.aiToolRouter.detectIntent(
                    message,
                    {
                        hasImage:
    Boolean(
        providedAttachment ||
        window.activeVisionContext ||
        getActiveGeneratedImage()
    ),

                        activeImage:
                            window.activeVisionContext,

                        generatedImage:
    getActiveGeneratedImage() || null
                    }
                );

            window.lastAIToolIntent =
                toolIntent;

            console.log(
                "🧭 AI Tool Router:",
                toolIntent
            );

        }

    }

    catch (routerError) {

        console.warn(
            "⚠️ AI Tool Router error:",
            routerError
        );

    }


  /* ======================================
   🎨 IMAGE GENERATION
   DIRECT SAFETY ROUTE
====================================== */

const imageGenerationPattern =
    /\b(create|generate|make|draw|produce)\b.*\b(image|picture|photo|illustration|artwork)\b/i;

const directImageGenerationRequest =
    imageGenerationPattern.test(message) ||
    /\b(i want|i need|can you make|can you create|can you generate)\b.*\b(image|picture|photo)\b/i.test(message);

if (
    (
        directImageGenerationRequest ||
        (
            toolIntent &&
            toolIntent.type === "image_generation"
        )
    ) &&
    typeof window.generateAIImage === "function"
) {

    console.log(
        "🎨 DIRECT IMAGE GENERATION ROUTE ACTIVATED"
    );

    console.log(
        "🎨 Prompt:",
        message
    );


    const imageResult =
        await window.generateAIImage(
            message
        );


    if (
        imageResult &&
        imageResult.success &&
        imageResult.image
    ) {

        console.log(
            "✅ IMAGE ENGINE RETURNED IMAGE"
        );


        /*
         * Save generated image so the next
         * message can edit it.
         */

        saveGeneratedImageVersion(
    imageResult.image,
    message,
    "generate"
);


        /*
         * Send the image to the chat renderer.
         */

        return (
            "__AI_GENERATED_IMAGE__" +
            imageResult.image +
            "__END_AI_GENERATED_IMAGE__"
        );

    }


    console.error(
        "❌ IMAGE ENGINE FAILED:",
        imageResult
    );


    return (
        "⚠️ I couldn't generate the image right now.\n\n" +
        (
            imageResult &&
            imageResult.error
                ? imageResult.error
                : "The image engine did not return an image."
        )
    );

}


    /* ======================================
       🖼️ IMAGE EDITING
    ====================================== */

    if (
        toolIntent &&
        toolIntent.type === "image_edit" &&
        typeof window.generateAIImage === "function"
    ) {

        console.log(
            "🎨 IMAGE EDIT REQUEST DETECTED"
        );


        let sourceImage =
    getActiveGeneratedImage() ||
    null;


        /*
         * If there is no generated image,
         * try the active uploaded image.
         */

        if (
            !sourceImage &&
            window.activeVisionContext
        ) {

            sourceImage =
                window.activeVisionContext.image ||
                null;

        }


        if (!sourceImage) {

            console.log(
                "⚠️ No image available for editing."
            );

            return (
                "🖼️ I can edit an image for you, but I don't currently have an image to edit.\n\n" +
                "Please generate or upload an image first."
            );

        }


        const imageResult =
            await window.generateAIImage(
                message,
                sourceImage
            );


        if (
            imageResult &&
            imageResult.success &&
            imageResult.image
        ) {

            console.log(
                "✅ IMAGE EDIT SUCCESS"
            );


            /*
             * The edited image becomes
             * the new active image.
             */

            saveGeneratedImageVersion(
    imageResult.image,
    message,
    "edit"
);


            return (
                "__AI_GENERATED_IMAGE__" +
                imageResult.image +
                "__END_AI_GENERATED_IMAGE__"
            );

        }


        console.error(
            "❌ IMAGE EDIT FAILED:",
            imageResult
        );


        return (
            "⚠️ I couldn't edit the image right now.\n\n" +
            (
                imageResult &&
                imageResult.error
                    ? imageResult.error
                    : "The image engine did not return an edited image."
            )
        );

    }


    /* ======================================
       SAVE NEW UPLOADED IMAGE CONTEXT
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
       PROCESS NORMAL AI REQUEST
    ====================================== */

    const response =
        await processSmartAIReply(
            message,
            providedAttachment
        );

/* ==========================================
   CREATED FILE HANDLER
========================================== */

if (
    typeof result === "string" &&
    result.startsWith(
        "__AI_CREATED_FILE__"
    )
) {

    const startMarker =
        "__AI_CREATED_FILE__";

    const endMarker =
        "__END_AI_CREATED_FILE__";


    const startIndex =
        result.indexOf(
            startMarker
        ) +
        startMarker.length;


    const endIndex =
        result.indexOf(
            endMarker
        );


    if (
        endIndex !== -1 &&
        endIndex > startIndex
    ) {

        try {

            const fileJson =
                result.substring(
                    startIndex,
                    endIndex
                );


            const file =
                JSON.parse(
                    fileJson
                );


            if (
                file &&
                file.data &&
                file.filename
            ) {

                const fileUrl =
                    "data:" +
                    (
                        file.mimeType ||
                        "application/octet-stream"
                    ) +
                    ";base64," +
                    file.data;


                /*
                 * Create a temporary download link.
                 */

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    fileUrl;


                link.download =
                    file.filename;


                link.textContent =
                    "📄 Download " +
                    file.filename;


                link.target =
                    "_blank";


                link.rel =
                    "noopener";


                /*
                 * Store the link information
                 * for the frontend renderer.
                 */

                return {
                    type:
                        "file",

                    filename:
                        file.filename,

                    mimeType:
                        file.mimeType,

                    size:
                        file.size,

                    data:
                        file.data,

                    downloadUrl:
                        fileUrl,

                    downloadLink:
                        link.outerHTML
                };

            }

        }

        catch (error) {

            console.error(
                "❌ Could not process created file:",
                error
            );

            return (
                "⚠️ The file was created, " +
                "but I couldn't prepare the download."
            );

        }

    }

}
   
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

window.getActiveGeneratedImage =
    getActiveGeneratedImage;

window.saveGeneratedImageVersion =
    saveGeneratedImageVersion;

window.getImageHistory =
    getImageHistory;

window.restoreImageVersion =
    restoreImageVersion;

window.clearImageWorkspace =
    clearImageWorkspace;
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
