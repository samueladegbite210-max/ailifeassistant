"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   imageEngine.js
   Version 1.0

   PURPOSE:
   Central image-generation/editing interface.

   IMPORTANT:
   This module does NOT directly modify
   smartAI.js.

   ROUTES:
   - generate
   - edit

   The actual image provider can be connected
   later without changing the rest of the app.
========================================== */

console.log("🎨 Image Engine loading...");

(function () {

    const CONFIG = {

        version: "1.0",

        /*
         * Backend endpoint will be connected later.
         *
         * Keeping this separate means we can change
         * the image provider without changing chat.
         */

        generateEndpoint:
            "/api/image",

        editEndpoint:
            "/api/image",

        enabled:
            true

    };


    /*
     * ------------------------------------------
     * Utility
     * ------------------------------------------
     */

    function cleanPrompt(prompt) {

        return String(prompt || "")
            .trim();

    }


    function hasPrompt(prompt) {

        return cleanPrompt(prompt).length > 0;

    }


    /*
     * ------------------------------------------
     * IMAGE GENERATION
     * ------------------------------------------
     */

    async function generateImage(prompt, options) {

        prompt =
            cleanPrompt(prompt);

        options =
            options || {};


        if (!hasPrompt(prompt)) {

            throw new Error(
                "Image generation requires a prompt."
            );

        }


        console.log(
            "🎨 Image Engine: generation requested"
        );

        console.log(
            "📝 Prompt:",
            prompt
        );


        /*
         * Provider connection intentionally
         * disabled in Version 1.0.
         *
         * We will connect the backend after
         * confirming the provider.
         */

        return {

            success:
                false,

            type:
                "image_generation",

            status:
                "not_connected",

            prompt:
                prompt,

            options:
                options,

            message:
                "Image generation engine is not connected yet."

        };

    }


    /*
     * ------------------------------------------
     * IMAGE EDITING
     * ------------------------------------------
     */

    async function editImage(
        image,
        prompt,
        options
    ) {

        prompt =
            cleanPrompt(prompt);

        options =
            options || {};


        if (!image) {

            throw new Error(
                "Image editing requires a source image."
            );

        }


        if (!hasPrompt(prompt)) {

            throw new Error(
                "Image editing requires an instruction."
            );

        }


        console.log(
            "🎨 Image Engine: edit requested"
        );

        console.log(
            "📝 Edit instruction:",
            prompt
        );


        /*
         * Provider connection intentionally
         * disabled in Version 1.0.
         */

        return {

            success:
                false,

            type:
                "image_edit",

            status:
                "not_connected",

            prompt:
                prompt,

            sourceImage:
                image,

            options:
                options,

            message:
                "Image editing engine is not connected yet."

        };

    }


    /*
     * ------------------------------------------
     * CHECK ENGINE
     * ------------------------------------------
     */

    function isAvailable() {

        return Boolean(
            CONFIG.enabled
        );

    }


    /*
     * ------------------------------------------
     * ENGINE INFORMATION
     * ------------------------------------------
     */

    function getInfo() {

        return {

            name:
                "AI Life Assistant Image Engine",

            version:
                CONFIG.version,

            enabled:
                CONFIG.enabled,

            generation:
                true,

            editing:
                true,

            connected:
                false,

            generateEndpoint:
                CONFIG.generateEndpoint,

            editEndpoint:
                CONFIG.editEndpoint

        };

    }


    /*
     * ------------------------------------------
     * PUBLIC API
     * ------------------------------------------
     */

    window.imageEngine = {

        config:
            CONFIG,

        generateImage:
            generateImage,

        editImage:
            editImage,

        isAvailable:
            isAvailable,

        getInfo:
            getInfo

    };


    console.log(
        "✅ Image Engine ready"
    );

})();
