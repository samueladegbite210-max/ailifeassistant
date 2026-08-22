"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   helpers.js
   Version 1.0
   Shared Utility Functions
========================================== */

console.log("🛠️ helpers.js loading...");


/* ==========================================
   SAFE STRING
========================================== */

function safeString(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value);

}


/* ==========================================
   NORMALIZE MESSAGE
========================================== */

function normalizeMessage(value) {

    return safeString(value)
        .toLowerCase()
        .trim();

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    return safeString(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   CHECK EMPTY VALUE
========================================== */

function isEmpty(value) {

    return (
        value === null ||
        value === undefined ||
        safeString(value).trim() === ""
    );

}


/* ==========================================
   GET PROFILE NAME
========================================== */

function getProfileName() {

    return (
        localStorage.getItem("profileName") ||
        "Samuel"
    );

}


/* ==========================================
   CURRENT DATE
========================================== */

function getCurrentDate() {

    return new Date().toLocaleDateString();

}


/* ==========================================
   CURRENT TIME
========================================== */

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}


/* ==========================================
   SAFE LOCAL STORAGE READ
========================================== */

function readStorage(key, fallback = null) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {

            return fallback;

        }

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            "⚠️ Storage read failed:",
            key,
            error
        );

        return fallback;

    }

}


/* ==========================================
   SAFE LOCAL STORAGE WRITE
========================================== */

function writeStorage(key, value) {

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


/* ==========================================
   GENERATE ID
========================================== */

function generateID(prefix = "id") {

    return (

        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8)

    );

}


/* ==========================================
   ARRAY CHECK
========================================== */

function ensureArray(value) {

    return Array.isArray(value)
        ? value
        : [];

}


/* ==========================================
   OBJECT CHECK
========================================== */

function ensureObject(value) {

    if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {

        return value;

    }

    return {};

}


/* ==========================================
   FORMAT FILE SIZE
========================================== */

function formatFileSize(bytes) {

    bytes = Number(bytes) || 0;

    if (bytes < 1024) {

        return bytes + " Bytes";

    }

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );

    }

    if (bytes < 1024 * 1024 * 1024) {

        return (
            (bytes / (1024 * 1024)).toFixed(1) +
            " MB"
        );

    }

    return (
        (bytes / (1024 * 1024 * 1024)).toFixed(1) +
        " GB"
    );

}


/* ==========================================
   DELAY
========================================== */

function delay(ms) {

    return new Promise(function(resolve) {

        setTimeout(resolve, ms);

    });

}


/* ==========================================
   DEBUG LOGGER
========================================== */

function aiLog(...args) {

    console.log(
        "🤖 AI Life Assistant:",
        ...args
    );

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.safeString = safeString;

window.normalizeMessage = normalizeMessage;

window.escapeHTML = escapeHTML;

window.isEmpty = isEmpty;

window.getProfileName = getProfileName;

window.getCurrentDate = getCurrentDate;

window.getCurrentTime = getCurrentTime;

window.readStorage = readStorage;

window.writeStorage = writeStorage;

window.generateID = generateID;

window.ensureArray = ensureArray;

window.ensureObject = ensureObject;

window.formatFileSize = formatFileSize;

window.delay = delay;

window.aiLog = aiLog;


console.log(
    "✅ helpers.js loaded successfully"
);
