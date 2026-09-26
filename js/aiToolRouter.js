"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   aiToolRouter.js
   Version 1.0

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


    function normalizeMessage(message) {

        return String(message || "")
            .trim()
            .toLowerCase();

    }


    function hasAny(text, words) {

        return words.some(function (word) {

            return text.includes(word);

        });

    }


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


    function detectImageEdit(text) {

        const editWords = [

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
            "remove the person",
            "remove someone",
            "remove something",
            "add a person",
            "add someone",
            "add something",
            "change the background",
            "replace the background",
            "change the clothes",
            "change the shirt",
            "change the color",
            "make it brighter",
            "make it darker",
            "make it realistic",
            "make it cartoon",
            "turn it into a cartoon",
            "make it look professional"

        ];

        return hasAny(
            text,
            editWords
        );

    }


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


    function detectIntent(message, context) {

        const text = normalizeMessage(
            message
        );

        context = context || {};

        const hasImage =
            Boolean(
                context.hasImage ||
                context.image ||
                context.activeImage
            );

        const hasFile =
            Boolean(
                context.hasFile ||
                context.file ||
                context.activeFile
            );


        /*
         * IMAGE GENERATION
         *
         * Check this before normal text.
         */

        if (
            detectImageGeneration(text)
        ) {

            return {
                type:
                    ROUTES.IMAGE_GENERATION,

                confidence: 0.95,

                message: message,

                requiresImage:
                    false,

                requiresFile:
                    false

            };

        }


        /*
         * IMAGE EDITING
         */

        if (
            hasImage &&
            detectImageEdit(text)
        ) {

            return {
                type:
                    ROUTES.IMAGE_EDIT,

                confidence: 0.95,

                message: message,

                requiresImage:
                    true,

                requiresFile:
                    false

            };

        }


        /*
         * IMAGE ANALYSIS
         */

        if (
            (
                hasImage ||
                detectImageAnalysis(text)
            ) &&
            detectImageAnalysis(text)
        ) {

            return {
                type:
                    ROUTES.IMAGE_ANALYSIS,

                confidence: 0.95,

                message: message,

                requiresImage:
                    true,

                requiresFile:
                    false

            };

        }


        /*
         * FILE CREATION
         */

        if (
            detectFileCreation(text)
        ) {

            return {
                type:
                    ROUTES.FILE_CREATION,

                confidence: 0.90,

                message: message,

                requiresImage:
                    false,

                requiresFile:
                    false

            };

        }


        /*
         * FILE EDITING
         */

        if (
            hasFile &&
            detectFileEdit(text)
        ) {

            return {
                type:
                    ROUTES.FILE_EDIT,

                confidence: 0.95,

                message: message,

                requiresImage:
                    false,

                requiresFile:
                    true

            };

        }


        /*
         * FILE ANALYSIS
         */

        if (
            hasFile &&
            detectFileAnalysis(text)
        ) {

            return {
                type:
                    ROUTES.FILE_ANALYSIS,

                confidence: 0.95,

                message: message,

                requiresImage:
                    false,

                requiresFile:
                    true

            };

        }


        /*
         * NORMAL CHAT
         */

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
        "✅ AI Tool Router ready"
    );

})();
