"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   brain.js
   Version 3.0
   Stable AI Brain / Data Engine
========================================== */

console.log("🧠 brain.js loading...");


/* ==========================================
   SAFE STORAGE READERS
========================================== */

function aiRead(key) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return [];
        }

        const parsed =
            JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.warn(
            "⚠️ AI storage read failed:",
            key,
            error
        );

        return [];

    }

}


function aiReadObject(key, fallback = {}) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        const parsed =
            JSON.parse(value);

        if (
            parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
        ) {

            return parsed;

        }

        return fallback;

    } catch (error) {

        console.warn(
            "⚠️ AI object read failed:",
            key,
            error
        );

        return fallback;

    }

}


/* ==========================================
   LOAD AI DATA
========================================== */

function getAIData() {

    return {

        tasks: aiRead("tasks"),

        goals: aiRead("goals"),

        events: aiRead("events"),

        notes: aiRead("notes"),

        wellness: aiReadObject(
            "wellness",
            {}
        ),

        xp: aiReadObject(
            "xp",
            {
                xp: 0,
                level: 1,
                total: 0
            }
        ),

        streak: aiReadObject(
            "streak",
            {
                days: 0
            }
        )

    };

}


/* ==========================================
   PRODUCTIVITY SCORE
========================================== */

function calculateProductivity() {

    const data =
        getAIData();

    const tasks =
        Array.isArray(data.tasks)
            ? data.tasks
            : [];

    if (!tasks.length) {

        return 0;

    }

    const completed =
        tasks.filter(task => {

            if (!task) {
                return false;
            }

            return (
                task.done === true ||
                task.completed === true
            );

        }).length;


    return Math.round(
        (
            completed /
            tasks.length
        ) * 100
    );

}


/* ==========================================
   WELLNESS SCORE
========================================== */

function calculateWellness() {

    const data =
        getAIData();

    const wellness =
        data.wellness || {};

    let score = 50;


    const water =
        Number(wellness.water) || 0;

    const sleep =
        Number(wellness.sleep) || 0;


    score += Math.min(
        Math.max(water, 0),
        8
    );

    score += Math.min(
        Math.max(sleep, 0),
        8
    );


    const mood =
        wellness.mood;


    const moodText =
        typeof mood === "string"
            ? mood
            : mood?.text;


    switch (
        String(moodText || "")
            .trim()
            .toLowerCase()
    ) {

        case "great":
            score += 20;
            break;

        case "good":
            score += 15;
            break;

        case "okay":
            score += 10;
            break;

        case "sad":
            score -= 10;
            break;

        case "stressed":
            score -= 20;
            break;

    }


    return Math.max(
        0,
        Math.min(score, 100)
    );

}


/* ==========================================
   TASK COMPLETION CHECK
========================================== */

function isTaskCompleted(task) {

    if (!task) {
        return false;
    }

    return (
        task.done === true ||
        task.completed === true
    );

}


/* ==========================================
   TODAY'S FOCUS
========================================== */

function getTodayFocus() {

    const data =
        getAIData();

    const tasks =
        Array.isArray(data.tasks)
            ? data.tasks
            : [];


    const pending =
        tasks.filter(
            task =>
                task &&
                !isTaskCompleted(task)
        );


    if (!pending.length) {

        return [
            "🎉 Everything is completed today!"
        ];

    }


    function getPriorityValue(priority) {

    const value =
        String(priority || "")
            .trim()
            .toLowerCase();

    if (value === "high") {
        return 3;
    }

    if (value === "medium") {
        return 2;
    }

    if (value === "low") {
        return 1;
    }

    return 0;

}


    pending.sort(
        (a, b) => {

            return (
              getPriorityValue(b.priority) -
              getPriorityValue(a.priority)
            );

        }
    );


    return pending.slice(0, 3);

}


/* ==========================================
   DAILY AI BRIEFING
========================================== */

function getDailyBriefing() {

    const data =
        getAIData();


    const tasks =
        Array.isArray(data.tasks)
            ? data.tasks
            : [];

    const goals =
        Array.isArray(data.goals)
            ? data.goals
            : [];

    const events =
        Array.isArray(data.events)
            ? data.events
            : [];


    const pendingTasks =
        tasks.filter(
            task =>
                task &&
                !isTaskCompleted(task)
        ).length;


    const pendingGoals =
        goals.filter(
            goal =>
                goal &&
                !isTaskCompleted(goal)
        ).length;


    const upcomingEvents =
        events.length;


    let profileName =
        "Samuel";


    try {

        profileName =
            localStorage.getItem(
                "profileName"
            ) || "Samuel";

    } catch {

        profileName =
            "Samuel";

    }


    let message = "";


    message +=
        `👋 Hello ${profileName}!\n\n`;

    message +=
        `📌 Pending Tasks: ${pendingTasks}\n`;

    message +=
        `🎯 Goals: ${pendingGoals}\n`;

    message +=
        `📅 Events: ${upcomingEvents}\n\n`;


    if (pendingTasks > 0) {

        message +=
            "🔥 Finish your highest-priority task first today.";

    }

    else if (pendingGoals > 0) {

        message +=
            "🚀 Spend today making progress toward your biggest goal.";

    }

    else {

        message +=
            "🎉 Excellent! You're all caught up today.";

    }


    return message;

}


/* ==========================================
   SMART RECOMMENDATION
========================================== */

function getRecommendation() {

    const productivity =
        calculateProductivity();

    const wellness =
        calculateWellness();


    let recommendation = "";


    /* --------------------------------------
       WELLNESS
    -------------------------------------- */

    if (wellness >= 80) {

        recommendation +=
            "🚀 You're feeling great today.\n";

    }

    else if (wellness >= 60) {

        recommendation +=
            "🙂 Your energy is good.\n";

    }

    else {

        recommendation +=
            "💙 Slow down today and recharge.\n";

    }


    recommendation += "\n";


    /* --------------------------------------
       PRODUCTIVITY
    -------------------------------------- */

    if (productivity >= 80) {

        recommendation +=
            "🔥 You're very productive. Keep your momentum going.";

    }

    else if (productivity >= 50) {

        recommendation +=
            "💪 You're making progress. Complete one important task next.";

    }

    else {

        recommendation +=
            "📌 Focus on finishing one task before starting another.";

    }


    return recommendation;

}


/* ==========================================
   AI BRAIN REPLY
========================================== */

function aiBrainReply(rawMsg) {

    const text =
        String(rawMsg || "")
            .trim()
            .toLowerCase();


    if (!text) {

        return null;

    }


    /* ======================================
       DAILY BRIEFING
    ====================================== */

    if (
        text.includes("daily briefing") ||
        text.includes("daily brief") ||
        text.includes("my briefing") ||
        text.includes("what should i do today")
    ) {

        return getDailyBriefing();

    }


    /* ======================================
       RECOMMENDATION
    ====================================== */

    if (
        text.includes("recommend something") ||
        text.includes("give me a recommendation") ||
        text.includes("what do you recommend") ||
        text.includes("give me advice for today")
    ) {

        return getRecommendation();

    }


    /* ======================================
       PRODUCTIVITY
    ====================================== */

    if (
        text.includes("productivity score") ||
        text.includes("how productive am i") ||
        text.includes("my productivity")
    ) {

        return (
            "📊 Your productivity score is " +
            calculateProductivity() +
            "%."
        );

    }


    /* ======================================
       WELLNESS
    ====================================== */

    if (
        text.includes("wellness score") ||
        text.includes("how is my wellness") ||
        text.includes("my wellness score")
    ) {

        return (
            "💙 Your wellness score is " +
            calculateWellness() +
            "%."
        );

    }


    /* ======================================
       TODAY'S FOCUS
    ====================================== */

    if (
        text.includes("today's focus") ||
        text.includes("todays focus") ||
        text.includes("what should i focus on")
    ) {

        const focus =
            getTodayFocus();


        if (!focus.length) {

            return "🎉 You have nothing pending.";

        }


        let reply =
            "🎯 Here's what you should focus on:\n\n";


        focus.forEach(
            (item, index) => {

                if (
                    typeof item === "string"
                ) {

                    reply +=
                        `${index + 1}. ${item}\n`;

                    return;

                }


                const title =
                    item.title ||
                    item.name ||
                    item.task ||
                    item.text ||
                    "Untitled task";


                reply +=
                    `${index + 1}. ${title}\n`;

            }
        );


        return reply;

    }


    /* ======================================
       NO MATCH
    ====================================== */

    return null;

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.aiRead =
    aiRead;

window.aiReadObject =
    aiReadObject;

window.getAIData =
    getAIData;

window.calculateProductivity =
    calculateProductivity;

window.calculateWellness =
    calculateWellness;

window.getTodayFocus =
    getTodayFocus;

window.getDailyBriefing =
    getDailyBriefing;

window.getRecommendation =
    getRecommendation;

window.aiBrainReply =
    aiBrainReply;


/* ==========================================
   READY
========================================== */

console.log(
    "✅ brain.js loaded successfully"
);
