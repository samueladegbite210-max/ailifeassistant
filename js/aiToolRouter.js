"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   aiToolRouter.js
   Version 2.0

   PURPOSE:
   Detect what kind of AI operation the user
   is requesting.

   ROUTES:
   - text
   - image_analysis
   - image_generation
   - image_edit
   - file_analysis
   - file_edit
   - file_creation

   IMPORTANT:
   Supports conversational image editing.

   Examples:
   - Create a picture of three people.
   - Put them in front of a modern house.
   - Change her shirt to black.
   - Remove the person in the middle.
   - Make the background a beach.
========================================== */

console.log("🧭 AI Tool Router loading...");

(function () {

    const ROUTES = {
        TEXT: "text",
        IMAGE_ANALYSIS: "image_analysis",
        IMAGE_GENERATION: "image_generation",
        IMAGE_EDIT: "image_edit",
        FILE_ANALYSIS: "file_analysis",
        FILE_EDIT: "file_edit",
        FILE_CREATION: "file_creation"
    };


    // ==========================================
    // NORMALIZE MESSAGE
    // ==========================================

    function normalizeMessage(message) {

        return String(message || "")
            .trim()
            .toLowerCase();

    }


    // ==========================================
    // CHECK WORDS
    // ==========================================

    function hasAny(text, words) {

        return words.some(function (word) {

            return text.includes(word);

        });

    }


    // ==========================================
    // IMAGE GENERATION
    // ==========================================

    function detectImageGeneration(text) {

        const generationWords = [

            "create an image",
            "create a picture",
            "create image",
            "create picture",

            "generate an image",
            "generate a picture",
            "generate image",
            "generate picture",

            "make an image",
            "make a picture",
            "make image",
            "make picture",

            "draw an image",
            "draw a picture",
            "draw image",
            "draw picture",

            "i need a picture",
            "i need an image",

            "can you create",
            "can you generate",

            "make me a picture",
            "make me an image"

        ];

        return hasAny(
            text,
            generationWords
        );

    }


    // ==========================================
    // IMAGE EDITING
    // ==========================================

    function detectImageEdit(text) {

        const editWords = [

            // Direct editing
            "edit this image",
            "edit the image",
            "edit this picture",
            "edit the picture",

            "change the image",
            "change this image",
            "change the picture",
            "change this picture",

            "modify the image",
            "modify this image",
            "modify the picture",
            "modify this picture",

            "alter the image",
            "alter this image",
            "alter the picture",
            "alter this picture",

            // Objects
            "remove the person",
            "remove a person",
            "remove someone",
            "remove something",
            "remove the middle person",
            "remove the person in the middle",

            "delete the person",
            "delete someone",
            "delete something",

            "add a person",
            "add someone",
            "add something",

            // Background
            "change the background",
            "replace the background",
            "remove the background",
            "make the background",

            // Clothing
            "change the clothes",
            "change the shirt",
            "change her shirt",
            "change his shirt",
            "change their clothes",

            // Appearance
            "change the color",
            "change the colour",
            "change the person's color",
            "change the person's clothes",

            // Style
            "make it brighter",
            "make it darker",
            "make it realistic",
            "make it cartoon",
            "turn it into a cartoon",
            "make it look professional",

            // Conversational image edits
            "put them",
            "put him",
            "put her",
            "put it",
            "place them",
            "place him",
            "place her",
            "place it",

            "move them",
            "move him",
            "move her",
            "move it",

            "make them",
            "make him",
            "make her",

            "change them",
            "change him",
            "change her",

            "add to the image",
            "add to the picture",

            "behind them",
            "in front of them",
            "next to them",
            "beside them",

            "in front of the house",
            "behind the house",
            "inside the house",

            "change the scene",
            "change the setting",

            "make the house",
            "change the house"

        ];

        return hasAny(
            text,
            editWords
        );

    }


    // ==========================================
    // CONVERSATIONAL IMAGE EDIT DETECTION
    // ==========================================

    function detectConversationalImageEdit(text) {

        const conversationalPatterns = [

            /\bput\s+(them|him|her|it)\b/i,

            /\bplace\s+(them|him|her|it)\b/i,

            /\bmove\s+(them|him|her|it)\b/i,

            /\bremove\s+(them|him|her|it)\b/i,

            /\bdelete\s+(them|him|her|it)\b/i,

            /\bchange\s+(them|him|her|it)\b/i,

            /\bmake\s+(them|him|her|it)\b/i,

            /\badd\s+(them|him|her|it)\b/i,

            /\bput\s+\w+\s+(in|on|behind|in front of|next to|beside)\b/i,

            /\bplace\s+\w+\s+(in|on|behind|in front of|next to|beside)\b/i,

            /\bchange\s+the\s+\w+\s+to\b/i,

            /\bmake\s+the\s+\w+\s+(black|white|red|blue|green|bigger|smaller|brighter|darker)\b/i,

            /\bremove\s+the\s+\w+\b/i,

            /\badd\s+the\s+\w+\b/i

        ];

        return conversationalPatterns.some(
            function (pattern) {

                return pattern.test(text);

            }
        );

    }


    // ==========================================
    // IMAGE ANALYSIS
    // ==========================================

    function detectImageAnalysis(text) {

        const analysisWords = [

            "what is this image",
            "what is this picture",
            "what's this image",
            "what's this picture",

            "describe this image",
            "describe the image",
            "describe this picture",

            "analyze this image",
            "analyze the image",
            "analyze this picture",

            "look at this image",
            "look at this picture",

            "what do you see",

            "what is in this image",
            "what is in the picture",

            "read this image",
            "read the image",

            "what color is",
            "what colors are"

        ];

        return hasAny(
            text,
            analysisWords
        );

    }


    // ==========================================
    // FILE CREATION
    // ==========================================

    function detectFileCreation(text) {

        const creationWords = [

            "create a pdf",
            "create a document",
            "create a word document",
            "create a docx",
            "create a text file",
            "create a csv",
            "create a spreadsheet",

            "make a pdf",
            "make a document",
            "make a word document",
            "make a spreadsheet",

            "generate a pdf",
            "generate a document",
            "generate a report",

            "create a report",
            "make a report"

        ];

        return hasAny(
            text,
            creationWords
        );

    }


    // ==========================================
    // FILE EDITING
    // ==========================================

    function detectFileEdit(text) {

        const editWords = [

            "edit this file",
            "edit the file",

            "modify this file",
            "modify the file",

            "change this file",
            "change the file",

            "rewrite this document",
            "rewrite the document",

            "edit this document",
            "edit the document",

            "fix this document",
            "fix the document",

            "correct this document",
            "correct the document",

            "change the title",
            "change the wording",

            "change the formatting",
            "fix the formatting",

            "add this to the document",
            "remove this from the document"

        ];

        return hasAny(
            text,
            editWords
        );

    }


    // ==========================================
    // FILE ANALYSIS
    // ==========================================

    function detectFileAnalysis(text) {

        const analysisWords = [

            "summarize this file",
            "summarize the file",

            "summarize this document",
            "summarize the document",

            "read this file",
            "read the file",

            "read this document",
            "read the document",

            "analyze this file",
            "analyze the file",

            "analyze this document",
            "analyze the document",

            "what does this file say",
            "what does this document say",

            "what is in this file",
            "what is in this document",

            "find this in the file",
            "find this in the document",

            "extract information",
            "extract the information"

        ];

        return hasAny(
            text,
            analysisWords
        );

    }


    // ==========================================
    // MAIN INTENT DETECTOR
    // ==========================================

    function detectIntent(message, context) {

        const text =
            normalizeMessage(message);

        context =
            context || {};


        // --------------------------------------
        // IMAGE CONTEXT
        // --------------------------------------

        const hasImage =
            Boolean(
                context.hasImage ||
                context.image ||
                context.activeImage ||
                context.generatedImage ||
                context.activeGeneratedImage
            );


        // --------------------------------------
        // FILE CONTEXT
        // --------------------------------------

        const hasFile =
            Boolean(
                context.hasFile ||
                context.file ||
                context.activeFile
            );


        // ======================================
        // IMAGE GENERATION
        // ======================================

        if (
            detectImageGeneration(text)
        ) {

            console.log(
                "🎨 Router → IMAGE GENERATION"
            );

            return {

                type:
                    ROUTES.IMAGE_GENERATION,

                confidence:
                    0.98,

                message:
                    message,

                requiresImage:
                    false,

                requiresFile:
                    false

            };

        }


        // ======================================
        // IMAGE EDITING
        // ======================================

        /*
         * IMPORTANT:
         *
         * If an image already exists, ordinary
         * conversational instructions such as:
         *
         * "Put them in front of a house"
         * "Change her shirt"
         * "Remove the person"
         *
         * are treated as image edits.
         */

        if (
            hasImage &&
            (
                detectImageEdit(text) ||
                detectConversationalImageEdit(text)
            )
        ) {

            console.log(
                "🖼️ Router → IMAGE EDIT"
            );

            return {

                type:
                    ROUTES.IMAGE_EDIT,

                confidence:
                    0.99,

                message:
                    message,

                requiresImage:
                    true,

                requiresFile:
                    false

            };

        }


        // ======================================
        // IMAGE ANALYSIS
        // ======================================

        if (
            hasImage &&
            detectImageAnalysis(text)
        ) {

            console.log(
                "🔎 Router → IMAGE ANALYSIS"
            );

            return {

                type:
                    ROUTES.IMAGE_ANALYSIS,

                confidence:
                    0.95,

                message:
                    message,

                requiresImage:
                    true,

                requiresFile:
                    false

            };

        }


        // ======================================
        // FILE CREATION
        // ======================================

        if (
            detectFileCreation(text)
        ) {

            console.log(
                "📄 Router → FILE CREATION"
            );

            return {

                type:
                    ROUTES.FILE_CREATION,

                confidence:
                    0.90,

                message:
                    message,

                requiresImage:
                    false,

                requiresFile:
                    false

            };

        }


        // ======================================
        // FILE EDITING
        // ======================================

        if (
            hasFile &&
            detectFileEdit(text)
        ) {

            console.log(
                "📝 Router → FILE EDIT"
            );

            return {

                type:
                    ROUTES.FILE_EDIT,

                confidence:
                    0.95,

                message:
                    message,

                requiresImage:
                    false,

                requiresFile:
                    true

            };

        }


        // ======================================
        // FILE ANALYSIS
        // ======================================

        if (
            hasFile &&
            detectFileAnalysis(text)
        ) {

            console.log(
                "📖 Router → FILE ANALYSIS"
            );

            return {

                type:
                    ROUTES.FILE_ANALYSIS,

                confidence:
                    0.95,

                message:
                    message,

                requiresImage:
                    false,

                requiresFile:
                    true

            };

        }


        // ======================================
        // NORMAL CHAT
        // ======================================

        return {

            type:
                ROUTES.TEXT,

            confidence:
                0.50,

            message:
                message,

            requiresImage:
                false,

            requiresFile:
                false

        };

    }


    // ==========================================
    // PUBLIC API
    // ==========================================

    window.aiToolRouter = {

        routes:
            ROUTES,

        detectIntent:
            detectIntent,

        detectImageGeneration:
            detectImageGeneration,

        detectImageEdit:
            detectImageEdit,

        detectImageAnalysis:
            detectImageAnalysis,

        detectFileCreation:
            detectFileCreation,

        detectFileEdit:
            detectFileEdit,

        detectFileAnalysis:
            detectFileAnalysis

    };


    console.log(
        "✅ AI Tool Router v2.0 ready"
    );

})();
