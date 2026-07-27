"use strict";

/*==================================================
 AI LIFE ASSISTANT
 Dashboard.js Version 3.0
 Author: Samuel + OpenAI
==================================================*/


/*==================================================
 APP CONFIGURATION
==================================================*/

const APP = {
    name: "AI Life Assistant",
    version: "3.0.0",
    refreshInterval: 10000,
    clockInterval: 1000,
    defaultUsername: "Samuel"
};


/*==================================================
 USER
==================================================*/

const username =
    localStorage.getItem("profileName") ||
    APP.defaultUsername;


/*==================================================
 STORAGE MANAGER
==================================================*/

function getDashboardData() {

    return {

        tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),

        goals: JSON.parse(localStorage.getItem("goals") || "[]"),

        events: JSON.parse(localStorage.getItem("events") || "[]"),

        notes: JSON.parse(localStorage.getItem("notes") || "[]"),

        xp: JSON.parse(localStorage.getItem("xp") || '{"xp":0,"level":1}'),

        streak: JSON.parse(localStorage.getItem("streak") || '{"days":0}')

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

function setWidth(id, value) {

    const element = getElement(id);

    if (!element) return;

    element.style.width = value;

}


/*==================================================
 DATE & TIME
==================================================*/

function updateDateTime() {

    const now = new Date();

    setText("todayDate", now.toDateString());

    const clock = getElement("currentTime");

    if (!clock) return;

    clock.textContent = now.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    });

}


/*==================================================
 GREETING
==================================================*/

function updateGreeting() {

    let greeting = "";

    const hour = new Date().getHours();

    if (hour < 12) {

        greeting = "🌅 Good Morning";

    } else if (hour < 17) {

        greeting = "☀️ Good Afternoon";

    } else if (hour < 21) {

        greeting = "🌇 Good Evening";

    } else {

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
