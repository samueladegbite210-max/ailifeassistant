"use strict";

// ==========================================
// AI LIFE ASSISTANT
// helpers.js
// Version 6.0
// Shared Utility Functions
// ==========================================

console.log("🛠️ helpers.js loading...");


// ==========================================
// SAFE STRING
// ==========================================

function safeString(value, fallback = "") {

    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    return String(value);

}


// ==========================================
// NORMALIZE TEXT
// ==========================================

function normalizeText(value) {

    return safeString(value)
        .trim()
        .replace(/\s+/g, " ");

}


// ==========================================
// LOWERCASE TEXT
// ==========================================

function lowerText(value) {

    return normalizeText(value)
        .toLowerCase();

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return safeString(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// CHECK EMPTY VALUE
// ==========================================

function isEmpty(value) {

    return (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );

}


// ==========================================
// SAFE JSON PARSE
// ==========================================

function safeJSONParse(
    value,
    fallback = null
) {

    try {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return fallback;

        }

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            "⚠️ JSON parse failed:",
            error
        );

        return fallback;

    }

}


// ==========================================
// READ LOCAL STORAGE
// ==========================================

function readStorage(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {

            return fallback;

        }

        return safeJSONParse(
            value,
            fallback
        );

    } catch (error) {

        console.warn(
            "⚠️ Storage read failed:",
            key,
            error
        );

        return fallback;

    }

}


// ==========================================
// WRITE LOCAL STORAGE
// ==========================================

function writeStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "❌ Storage write failed:",
            key,
            error
        );

        return false;

    }

}


// ==========================================
// REMOVE STORAGE
// ==========================================

function removeStorage(key) {

    try {

        localStorage.removeItem(key);

        return true;

    } catch (error) {

        console.error(
            "❌ Storage remove failed:",
            key,
            error
        );

        return false;

    }

}


// ==========================================
// GET PROFILE NAME
// ==========================================

function getProfileName() {

    try {

        return (
            localStorage.getItem(
                "profileName"
            ) ||
            "Samuel"
        );

    } catch {

        return "Samuel";

    }

}


// ==========================================
// CURRENT DATE
// ==========================================

function getCurrentDate() {

    return new Date();

}


// ==========================================
// CURRENT TIME
// ==========================================

function getCurrentTime() {

    return new Date().toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// DATE STRING
// ==========================================

function getDateString(date = new Date()) {

    try {

        return new Date(date)
            .toLocaleDateString();

    } catch {

        return "";

    }

}


// ==========================================
// FORMAT FILE SIZE
// ==========================================

function formatFileSize(bytes) {

    const size =
        Number(bytes);

    if (
        !Number.isFinite(size) ||
        size <= 0
    ) {

        return "0 Bytes";

    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.min(
            Math.floor(
                Math.log(size) /
                Math.log(1024)
            ),
            units.length - 1
        );


    return (
        parseFloat(
            (
                size /
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(1)
        ) +
        " " +
        units[index]
    );

}


// ==========================================
// ARRAY CHECK
// ==========================================

function safeArray(value) {

    return Array.isArray(value)
        ? value
        : [];

}


// ==========================================
// OBJECT CHECK
// ==========================================

function safeObject(
    value,
    fallback = {}
) {

    if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {

        return value;

    }

    return fallback;

}


// ==========================================
// UNIQUE ARRAY
// ==========================================

function uniqueArray(array) {

    return [
        ...new Set(
            safeArray(array)
        )
    ];

}


// ==========================================
// FIND ELEMENT
// ==========================================

function getElement(id) {

    if (!id) {

        return null;

    }

    return document.getElementById(id);

}


// ==========================================
// SAFE FUNCTION CALL
// ==========================================

async function safeCall(
    fn,
    fallback = null
) {

    if (
        typeof fn !== "function"
    ) {

        return fallback;

    }


    try {

        return await fn();

    } catch (error) {

        console.error(
            "❌ Function error:",
            error
        );

        return fallback;

    }

}


// ==========================================
// DELAY
// ==========================================

function delay(ms = 0) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


// ==========================================
// CHECK FUNCTION
// ==========================================

function functionExists(name) {

    return (
        typeof window[name] ===
        "function"
    );

}


// ==========================================
// GLOBAL EXPORTS
// ==========================================

window.safeString =
    safeString;

window.normalizeText =
    normalizeText;

window.lowerText =
    lowerText;

window.escapeHTML =
    escapeHTML;

window.isEmpty =
    isEmpty;

window.safeJSONParse =
    safeJSONParse;

window.readStorage =
    readStorage;

window.writeStorage =
    writeStorage;

window.removeStorage =
    removeStorage;

window.getProfileName =
    getProfileName;

window.getCurrentDate =
    getCurrentDate;

window.getCurrentTime =
    getCurrentTime;

window.getDateString =
    getDateString;

window.formatFileSize =
    formatFileSize;

window.safeArray =
    safeArray;

window.safeObject =
    safeObject;

window.uniqueArray =
    uniqueArray;

window.getElement =
    getElement;

window.safeCall =
    safeCall;

window.delay =
    delay;

window.functionExists =
    functionExists;


// ==========================================
// READY
// ==========================================

console.log(
    "✅ helpers.js loaded successfully"
);
