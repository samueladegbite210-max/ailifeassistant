// ============================================
// AI LIFE ASSISTANT
// Dashboard.js Version 2.0
// ============================================

"use strict";

// ============================================
// USER
// ============================================

const username =
localStorage.getItem("profileName") || "Samuel";

// ============================================
// REFRESH SETTINGS
// ============================================

const DASHBOARD_REFRESH_INTERVAL = 10000;
const CLOCK_REFRESH_INTERVAL = 1000;
    // ============================================
// DASHBOARD DATA
// ============================================

function getDashboardData(){

    return{

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
            xp:0,
            level:1
        },

        streak:
        JSON.parse(localStorage.getItem("streak")) || {
            days:0
        }

    };

}
// ============================================
// CLOCK
// ============================================

function updateDateTime(){

    const now = new Date();

    const todayDate =
    document.getElementById("todayDate");

    const currentTime =
    document.getElementById("currentTime");

    if(todayDate){

        todayDate.textContent =
        now.toDateString();

    }

    if(currentTime){

        currentTime.textContent =
        now.toLocaleTimeString([],{

            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"

        });

    }

}
// ============================================
// GREETING
// ============================================

function updateGreeting(){

    const welcome =
    document.getElementById("welcomeText");

    const assistant =
    document.getElementById("assistantMessage");

    let greeting = "";

    const hour = new Date().getHours();

    if(hour < 12){

        greeting = "🌅 Good Morning";

    }
    else if(hour < 17){

        greeting = "☀️ Good Afternoon";

    }
    else if(hour < 21){

        greeting = "🌇 Good Evening";

    }
    else{

        greeting = "🌙 Good Night";

    }

    if(welcome){

        welcome.textContent =
        `${greeting}, ${username}`;

    }

    if(assistant){

        assistant.innerHTML = `
📅 Today is a brand-new opportunity.<br><br>

I'm here to help organize your tasks, goals,
events and productivity.<br><br>

💙 Let's make today amazing!
`;

    }

}
// ============================================
// AI GREETING
// ============================================

function loadAIGreeting(){

    const greetingBox =
    document.getElementById("aiGreeting");

    if(!greetingBox) return;

    const hour =
    new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "🌅 Good Morning";

    }
    else if(hour < 18){

        greeting = "☀️ Good Afternoon";

    }
    else{

        greeting = "🌙 Good Evening";

    }

    greetingBox.innerHTML =
    `${greeting}, ${username}!`;

}
// ============================================
// DAILY TIP
// ============================================

const DAILY_TIPS = [

"💪 Start with your hardest task.",

"🎯 Focus on progress, not perfection.",

"📅 Review today's schedule first.",

"💧 Stay hydrated.",

"🚀 Small steps create big success.",

"📚 Learn something new today.",

"😊 Smile. You're doing great."

];

function loadDailyTip(){

    const tip =
    document.getElementById("tipText");

    if(!tip) return;

    const today =
    new Date().getDate();

    tip.textContent =
    DAILY_TIPS[today % DAILY_TIPS.length];

}
