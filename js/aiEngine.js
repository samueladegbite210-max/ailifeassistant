
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
/*==========================================
TODAY'S FOCUS
==========================================*/

function getTodayFocus() {

    const data = getAIData();

    const pending = data.tasks.filter(task => !task.done);

    if (pending.length === 0) {

        return [

            "🎉 Everything is completed today!"

        ];

    }

    pending.sort((a, b) => {

        const priority = {

            High: 3,

            Medium: 2,

            Low: 1

        };

        return (priority[b.priority] || 0) -

               (priority[a.priority] || 0);

    });

    return pending.slice(0, 3);

}

/*==========================================
DAILY AI BRIEFING
==========================================*/

function getDailyBriefing() {

    const data = getAIData();

    const pendingTasks =

        data.tasks.filter(task => !task.done).length;

    const pendingGoals =

        data.goals.filter(goal => !goal.done).length;

    const upcomingEvents =

        data.events.length;

    let message = "";

    message += `👋 Hello ${localStorage.getItem("profileName") || "Samuel"}!\n\n`;

    message += `📌 Pending Tasks: ${pendingTasks}\n`;

    message += `🎯 Goals: ${pendingGoals}\n`;

    message += `📅 Events: ${upcomingEvents}\n\n`;

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

/*==========================================
SMART AI RECOMMENDATION
==========================================*/

function getRecommendation() {

    const productivity = calculateProductivity();

    const wellness = calculateWellness();

    let recommendation = "";

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

