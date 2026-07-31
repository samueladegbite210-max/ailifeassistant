
"use strict";

/*==========================================
AI LIFE ASSISTANT
AI ENGINE v1.0
The Brain of the App
==========================================*/

/*==========================================
READ STORAGE
==========================================*/

function aiRead(key) {

    try {

        return JSON.parse(localStorage.getItem(key)) || [];

    } catch {

        return [];

    }

}

function aiReadObject(key, fallback = {}) {

    try {

        return JSON.parse(localStorage.getItem(key)) || fallback;

    } catch {

        return fallback;

    }

}

/*==========================================
LOAD EVERYTHING
==========================================*/

function getAIData() {

    return {

        tasks: aiRead("tasks"),

        goals: aiRead("goals"),

        events: aiRead("events"),

        notes: aiRead("notes"),

        wellness: aiReadObject("wellness"),

        xp: aiReadObject("xp", {

            xp: 0,

            level: 1,

            total: 0

        }),

        streak: aiReadObject("streak", {

            days: 0

        })

    };

}/*==========================================
PRODUCTIVITY SCORE
==========================================*/

function calculateProductivity() {

    const data = getAIData();

    const tasks = data.tasks;

    if (tasks.length === 0) {

        return 0;

    }

    const completed = tasks.filter(task => task.done).length;

    return Math.round(

        (completed / tasks.length) * 100

    );

}

/*==========================================
WELLNESS SCORE
==========================================*/

function calculateWellness() {

    const data = getAIData();

    const wellness = data.wellness;

    let score = 50;

    score += Math.min(wellness.water || 0, 8);

    score += Math.min(wellness.sleep || 0, 8);

    if (wellness.mood) {

        switch (wellness.mood.text) {

            case "Great":

                score += 20;

                break;

            case "Good":

                score += 15;

                break;

            case "Okay":

                score += 10;

                break;

            case "Sad":

                score -= 10;

                break;

            case "Stressed":

                score -= 20;

                break;

        }

    }

    return Math.max(0, Math.min(score, 100));

}

