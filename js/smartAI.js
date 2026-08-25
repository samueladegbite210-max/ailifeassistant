// ==========================================
// AI LIFE ASSISTANT
// smartAI.js
// Version 9.0
// Stable Central AI Controller
// ==========================================

"use strict";

console.log(
    "🧠 smartAI.js loading..."
);


// ==========================================
// ATTACHMENT ACCESS
// ==========================================

function getCurrentAttachment() {

    return window.aiAttachment || null;

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
// IMAGE COMMAND DETECTION
// ==========================================

function isImageCommand(msg) {

    if (!msg) {
        return false;
    }


    return (

        msg.includes(
            "describe the image"
        ) ||

        msg.includes(
            "describe image"
        ) ||

        msg.includes(
            "what is in the image"
        ) ||

        msg.includes(
            "what's in the image"
        ) ||

        msg.includes(
            "what does the image show"
        ) ||

        msg.includes(
            "analyze the image"
        ) ||

        msg.includes(
            "analyze image"
        ) ||

        msg.includes(
            "read text from image"
        ) ||

        msg.includes(
            "read the text from image"
        ) ||

        msg.includes(
            "read the text"
        ) ||

        msg.includes(
            "extract text from image"
        ) ||

        msg.includes(
            "extract text"
        ) ||

        msg.includes(
            "text in the image"
        ) ||

        msg.includes(
            "what does the image say"
        ) ||

        msg.includes(
            "what does this say"
        ) ||

        msg.includes(
            "read this image"
        )

    );

}


// ==========================================
// FILE COMMAND DETECTION
// ==========================================

function isFileCommand(msg) {

    if (!msg) {
        return false;
    }


    return (

        msg.includes(
            "summarize the file"
        ) ||

        msg.includes(
            "summarize file"
        ) ||

        msg.includes(
            "summarize this file"
        ) ||

        msg.includes(
            "summarize this"
        ) ||

        msg.includes(
            "summarize it"
        ) ||

        msg.includes(
            "explain the file"
        ) ||

        msg.includes(
            "explain this file"
        ) ||

        msg.includes(
            "explain the contents"
        ) ||

        msg.includes(
            "read the file"
        ) ||

        msg.includes(
            "read this file"
        ) ||

        msg.includes(
            "find important information"
        ) ||

        msg.includes(
            "important information in the file"
        ) ||

        msg.includes(
            "answer questions about the file"
        ) ||

        msg.includes(
            "what does the file say"
        )

    );

}


// ==========================================
// IMAGE HANDLER
// ==========================================

async function handleImageCommand(msg) {

    console.log(
        "🖼️ IMAGE COMMAND DETECTED:",
        msg
    );


    const attachment =
        getCurrentAttachment();


    if (!attachment) {

        return (
            "📷 I don't currently have an image attached.\n\n" +
            "Please upload an image first."
        );

    }


    if (
        attachment.type !== "image"
    ) {

        return (
            "📎 The current attachment isn't an image.\n\n" +
            "Please upload an image."
        );

    }


    const imageSource =
        attachment.file ||
        attachment.data;


    if (!imageSource) {

        return (
            "📷 I found the image attachment, but I couldn't access the image data."
        );

    }


    console.log(
        "🖼️ Current image:",
        attachment.name
    );


    // ======================================
    // OCR
    // ======================================

    if (

        msg.includes(
            "read text"
        ) ||

        msg.includes(
            "extract text"
        ) ||

        msg.includes(
            "what does the image say"
        ) ||

        msg.includes(
            "what does this say"
        ) ||

        msg.includes(
            "text in the image"
        )

    ) {

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

            }

            catch (error) {

                console.error(
                    "❌ OCR ERROR:",
                    error
                );

            }

        }


        return (
            "📝 I couldn't read text from this image."
        );

    }


    // ======================================
    // IMAGE ANALYSIS
    // ======================================

    if (

        msg.includes(
            "describe"
        ) ||

        msg.includes(
            "what is in"
        ) ||

        msg.includes(
            "analyze"
        )

    ) {

        console.log(
            "👀 Starting image analysis..."
        );


        if (
            typeof window.analyzeImage ===
            "function"
        ) {

            try {

                const result =
                    await window.analyzeImage(
                        imageSource
                    );


                if (
                    result !== null &&
                    result !== undefined &&
                    String(result).trim() !== ""
                ) {

                    return String(result);

                }

            }

            catch (error) {

                console.error(
                    "❌ IMAGE ANALYSIS ERROR:",
                    error
                );


                return (
                    "⚠️ I received your image, but something went wrong while analyzing it."
                );

            }

        }


        return (
            "👀 I received your image, but the image analysis function is not connected yet."
        );

    }


    // ======================================
    // DEFAULT IMAGE RESPONSE
    // ======================================

    return (
        "📷 I have your image ready.\n\n" +
        "You can ask me:\n\n" +
        "• Describe the image\n" +
        "• Read the text from the image\n" +
        "• Analyze the image"
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
        attachment.type !== "file"
    ) {

        return (
            "📎 The current attachment isn't a document.\n\n" +
            "Please upload a file."
        );

    }


    console.log(
        "📄 Current file:",
        attachment.name
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
                "📄 I read the file, but no readable content was returned."
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
        "📄 I have your file, but the file-reading engine is not connected yet."
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
                file.type ||
                "Unknown type";


            reply +=
                `${index + 1}. ${name} (${type})\n`;

        }
    );


    return reply;

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
        original.toLowerCase().trim();


    console.log(
        "🧠 Processing:",
        original
    );


    // ======================================
    // ATTACHMENT COMMANDS
    // ======================================

    if (
        isImageCommand(msg)
    ) {

        return await handleImageCommand(
            msg
        );

    }


    if (
        isFileCommand(msg)
    ) {

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

    const modules = [


        // Conversation
        [
            "conversationReply",
            () => {

                if (
                    typeof window.conversationReply ===
                    "function"
                ) {

                    return window.conversationReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Memory
        [
            "memoryReply",
            () => {

                if (
                    typeof window.memoryReply ===
                    "function"
                ) {

                    return window.memoryReply(
                        msg,
                        original
                    );

                }


                return null;

            }
        ],


        // Knowledge
        [
            "knowledgeReply",
            () => {

                if (
                    typeof window.knowledgeReply ===
                    "function"
                ) {

                    return window.knowledgeReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Profile
        [
            "profileReply",
            () => {

                if (
                    typeof window.profileReply ===
                    "function"
                ) {

                    return window.profileReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Learning
        [
            "learnUserReply",
            () => {

                if (
                    typeof window.learnUserReply ===
                    "function"
                ) {

                    return window.learnUserReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Teacher
        [
            "teacherReply",
            () => {

                if (
                    typeof window.teacherReply ===
                    "function"
                ) {

                    return window.teacherReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Quiz
        [
            "quizReply",
            () => {

                if (
                    typeof window.quizReply ===
                    "function"
                ) {

                    return window.quizReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Calculator
        [
            "calculatorReply",
            () => {

                if (
                    typeof window.calculatorReply ===
                    "function"
                ) {

                    return window.calculatorReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Date / Time
        [
            "dateTimeReply",
            () => {

                if (
                    typeof window.dateTimeReply ===
                    "function"
                ) {

                    return window.dateTimeReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Tasks
        [
            "taskReply",
            () => {

                if (
                    typeof window.taskReply ===
                    "function"
                ) {

                    return window.taskReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Goals
        [
            "goalReply",
            () => {

                if (
                    typeof window.goalReply ===
                    "function"
                ) {

                    return window.goalReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Notes
        [
            "noteReply",
            () => {

                if (
                    typeof window.noteReply ===
                    "function"
                ) {

                    return window.noteReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Events
        [
            "eventReply",
            () => {

                if (
                    typeof window.eventReply ===
                    "function"
                ) {

                    return window.eventReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Natural Language
        [
            "naturalReply",
            () => {

                if (
                    typeof window.naturalReply ===
                    "function"
                ) {

                    return window.naturalReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Food
        [
            "foodReply",
            () => {

                if (
                    typeof window.foodReply ===
                    "function"
                ) {

                    return window.foodReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Weather
        [
            "weatherReply",
            () => {

                if (
                    typeof window.weatherReply ===
                    "function"
                ) {

                    return window.weatherReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Advice
        [
            "adviceReply",
            () => {

                if (
                    typeof window.adviceReply ===
                    "function"
                ) {

                    return window.adviceReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Internet
        [
            "internetReply",
            () => {

                if (
                    typeof window.internetReply ===
                    "function"
                ) {

                    return window.internetReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ],


        // Main Brain
        [
            "aiBrainReply",
            () => {

                if (
                    typeof window.aiBrainReply ===
                    "function"
                ) {

                    return window.aiBrainReply(
                        original,
                        msg
                    );

                }


                return null;

            }
        ]

    ];


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
    // FALLBACK
    // ======================================

    return (
        "🤖 I'm still learning.\n\n" +
        "I couldn't find a good answer to that yet."
    );

}


// ==========================================
// GLOBAL ACCESS
// ==========================================

window.smartAIReply =
    smartAIReply;


window.getCurrentAttachment =
    getCurrentAttachment;


window.handleImageCommand =
    handleImageCommand;


window.handleFileCommand =
    handleFileCommand;


window.getUploadList =
    getUploadList;


window.isImageCommand =
    isImageCommand;


window.isFileCommand =
    isFileCommand;


// ==========================================
// READY
// ==========================================

console.log(
    "========================================"
);

console.log(
    "✅ smartAI.js ready"
);

console.log(
    "🔎 window.smartAIReply:",
    typeof window.smartAIReply
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
