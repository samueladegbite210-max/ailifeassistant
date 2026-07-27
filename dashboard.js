"use strict";

/*==================================================
 AI LIFE ASSISTANT
 Dashboard.js v2.0
 Author: OpenAI + Samuel
==================================================*/

/*==================================================
 CONFIGURATION
==================================================*/

const CONFIG = {
    dashboardRefresh: 10000,
    clockRefresh: 1000,
    defaultUsername: "Samuel"
};

/*==================================================
 USER
==================================================*/

const username =
    localStorage.getItem("profileName") ||
    CONFIG.defaultUsername;

/*==================================================
 STORAGE MANAGER
==================================================*/

function getDashboardData() {

    return {

        tasks:
            JSON.parse(localStorage.getItem("tasks")) || [],

        goals:
            JSON.parse(localStorage.getItem("goals")) || [],

        events:
            JSON.parse(localStorage.getItem("events")) || [],

        notes:
            JSON.parse(localStorage.getItem("notes")) || [],

        xp:
            JSON.parse(localStorage.getItem("xp")) || {
                xp: 0,
                level: 1
            },

        streak:
            JSON.parse(localStorage.getItem("streak")) || {
                days: 0
            }

    };

}

/*==================================================
 HELPER FUNCTIONS
==================================================*/

function getElement(id) {

    return document.getElementById(id);

}

function setText(id, value) {

    const element = getElement(id);

    if (!element) return;

    element.textContent = value;

}

function setHTML(id, value) {

    const element = getElement(id);

    if (!element) return;

    element.innerHTML = value;

}

/*==================================================
 DATE & TIME
==================================================*/

function updateDateTime() {

    const now = new Date();

    setText(
        "todayDate",
        now.toDateString()
    );

    const clock =
        getElement("currentTime");

    if (!clock) return;

    clock.textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

}

/*==================================================
 WELCOME GREETING
==================================================*/

function updateGreeting() {

    let greeting = "";

    const hour =
        new Date().getHours();

    if (hour < 12) {

        greeting = "🌅 Good Morning";

    }
    else if (hour < 17) {

        greeting = "☀️ Good Afternoon";

    }
    else if (hour < 21) {

        greeting = "🌇 Good Evening";

    }
    else {

        greeting = "🌙 Good Night";

    }

    setText(
        "welcomeText",
        `${greeting}, ${username}`
    );

    setHTML(
        "assistantMessage",
        `
📅 Today is a brand-new opportunity.<br><br>

I'm here to help you organize your tasks,
goals, notes and events.<br><br>

💙 Let's make today productive together!
`
    );

}

/*==================================================
 AI GREETING
==================================================*/

function loadAIGreeting() {

    let greeting = "";

    const hour =
        new Date().getHours();

    if (hour < 12) {

        greeting = "🌅 Good Morning";

    }
    else if (hour < 18) {

        greeting = "☀️ Good Afternoon";

    }
    else {

        greeting = "🌙 Good Evening";

    }

    setHTML(
        "aiGreeting",
        `${greeting}, ${username}!`
    );

}

/*==================================================
 DAILY TIP
==================================================*/

const DAILY_TIPS = [

    "💪 Start your day with your most important task.",

    "🎯 Focus on progress, not perfection.",

    "📅 Check your calendar before starting work.",

    "💧 Stay hydrated and take short breaks.",

    "🚀 Small steps every day create big success.",

    "📚 Learn one new thing today.",

    "😊 Smile — you're building something amazing."

];

function loadDailyTip() {

    const tip =
        getElement("tipText");

    if (!tip) return;

    const today =
        new Date().getDate();

    tip.textContent =
        DAILY_TIPS[
            today % DAILY_TIPS.length
        ];

}
