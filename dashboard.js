"use strict";

/*==================================================
AI LIFE ASSISTANT
Dashboard.js Version 5.0
Stable Release
==================================================*/

/*==================================================
SECTION 1 — APP CONFIGURATION
==================================================*/

const APP = {

    name: "AI Life Assistant",

    version: "5.0.0",

    username:
        localStorage.getItem("profileName") || "Samuel",

    refreshInterval: 30000,

    clockInterval: 1000

};
/*==================================================
SECTION 2 — STORAGE
==================================================*/

function safeRead(key){

    try{

        return JSON.parse(localStorage.getItem(key)) || [];

    }

    catch{

        return [];

    }

}

function safeObject(key, fallback = {}){

    try{

        return JSON.parse(localStorage.getItem(key)) || fallback;

    }

    catch{

        return fallback;

    }

}

function getDashboardData(){

    return{

        tasks: safeRead("tasks"),

        goals: safeRead("goals"),

        events: safeRead("events"),

        notes: safeRead("notes"),

        wellness: safeObject("wellness"),

        xp: safeObject("xp",{

            xp:0,

            level:1,

            total:0

        }),

        streak: safeObject("streak",{

            days:0

        })

    };

}
/*==================================================
SECTION 3 — HELPERS
==================================================*/

function $(id){

    return document.getElementById(id);

}

function setText(id,text){

    const element=$(id);

    if(element){

        element.textContent=text;

    }

}

function setHTML(id,html){

    const element=$(id);

    if(element){

        element.innerHTML=html;

    }

}

function setWidth(id,width){

    const element=$(id);

    if(element){

        element.style.width=width;

    }

}
/*==================================================
SECTION 4 — CLOCK
==================================================*/

function updateClock(){

    const now = new Date();

    setText(
        "todayDate",
        now.toDateString()
    );

    const time = now.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit",

        second:"2-digit"

    });

    setText(
        "currentTime",
        time
    );

}
/*==================================================
SECTION 5 — GREETING
==================================================*/

function updateGreeting(){

    const hour = new Date().getHours();

    let greeting = "";

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

    setText(

        "welcomeText",

        `${greeting}, ${APP.username}`

    );

    setHTML(

        "assistantMessage",

        `
📅 Today is a new opportunity.<br><br>

Stay organized.<br>

Complete your important tasks.<br>

Keep moving toward your goals.
`

    );

}
/*==================================================
SECTION 6 — DASHBOARD SUMMARY
==================================================*/

function updateDashboardSummary(){

    const data = getDashboardData();

    const tasks = data.tasks;

    const goals = data.goals;

    const events = data.events;

    const notes = data.notes;

    const xp = data.xp;

    const completedTasks =
    tasks.filter(task=>task.done).length;

    const productivity =

    tasks.length === 0

    ? 0

    : Math.round(

        (completedTasks/tasks.length)*100

    );

    setText("taskCount",tasks.length);

    setText("goalCount",goals.length);

    setText("eventCount",events.length);

    setText("noteCount",notes.length);

    setText("xpCount",xp.xp);

    setText("levelCount",xp.level);

    setText(

        "productivityScore",

        productivity + "%"

    );

    setText(

        "progressText",

        `${completedTasks} of ${tasks.length} Tasks Completed`

    );

    setWidth(

        "progressBar",

        productivity + "%"

    );

}
/*==================================================
SECTION 7 — TODAY'S FOCUS
==================================================*/

function renderTodayFocus(){

    const box = $("todayFocus");

    if(!box) return;

    const tasks =
    getDashboardData().tasks;

    const pending =

    tasks.filter(task=>!task.done);

    if(pending.length===0){

        box.innerHTML=

        "🎉 Everything is completed today!";

        return;

    }

    let html="";

    pending

    .slice(0,3)

    .forEach(task=>{

        html +=

        `🔥 ${task.text || task.title}<br>`;

    });

    box.innerHTML = html;

}
/*==================================================
SECTION 8 — DAILY AI BRIEFING
==================================================*/

function renderDailyBriefing(){

    const box = $("briefingText");

    if(!box) return;

    const data = getDashboardData();

    const pendingTasks =
    data.tasks.filter(task=>!task.done).length;

    const pendingGoals =
    data.goals.filter(goal=>!goal.done).length;

    let briefing = "";

    briefing += `👋 Hello ${APP.username}!<br><br>`;

    briefing += `📌 Pending Tasks: <strong>${pendingTasks}</strong><br>`;

    briefing += `🎯 Active Goals: <strong>${pendingGoals}</strong><br>`;

    briefing += `📅 Upcoming Events: <strong>${data.events.length}</strong><br><br>`;

    if(pendingTasks > 0){

        briefing +=
        "🔥 AI Suggestion: Finish your most important task before starting anything new.";

    }

    else if(pendingGoals > 0){

        briefing +=
        "🚀 AI Suggestion: Spend some time making progress toward your biggest goal.";

    }

    else{

        briefing +=
        "🎉 You're all caught up today. Great work!";

    }

    box.innerHTML = briefing;

}
/*==================================================
SECTION 9 — AI RECOMMENDATION
==================================================*/

function updateRecommendation(){

    const box = $("aiRecommendation");

    if(!box) return;

    const data = getDashboardData();

    const wellness = data.wellness || {};

    let score = 50;

    score += Math.min(wellness.water || 0,8);

    score += Math.min(wellness.sleep || 0,8);

    if(wellness.mood){

        switch(wellness.mood.text){

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

    score = Math.max(0,Math.min(score,100));

    let html = `<strong>💙 Wellness Score: ${score}%</strong><br><br>`;

    if(score >= 80){

        html +=
        "🚀 You're in excellent condition today. Take advantage of it.";

    }

    else if(score >= 60){

        html +=
        "💪 You're doing well. Stay focused and keep moving.";

    }

    else{

        html +=
        "🌿 Slow down today. Rest, hydrate and avoid burnout.";

    }

    box.innerHTML = html;

}

/*==================================================
SECTION 10 — NEXT EVENT
==================================================*/

function loadNextEvent(){

    const box = $("nextEvent");

    if(!box) return;

    const events = getDashboardData().events;

    if(events.length === 0){

        box.innerHTML = "📅 No upcoming events.";

        return;

    }

    events.sort((a,b)=>{

        return new Date(a.date) - new Date(b.date);

    });

    const next = events[0];

    box.innerHTML = `
        <strong>${next.title}</strong><br>

        📅 ${next.date}

        ${next.time ? `<br>🕒 ${next.time}` : ""}

        ${next.location ? `<br>📍 ${next.location}` : ""}
    `;

}
/*==================================================
SECTION 11 — SMART NOTIFICATIONS
==================================================*/

function loadNotifications(){

    const box = $("notificationBox");

    if(!box) return;

    const data = getDashboardData();

    const pendingTasks =
        data.tasks.filter(task=>!task.done).length;

    let html = `🎉 Welcome back, ${APP.username}!<br><br>`;

    if(pendingTasks){

        html += `📌 ${pendingTasks} pending task(s)<br>`;

    }

    if(data.events.length){

        html += `📅 ${data.events.length} upcoming event(s)<br>`;

    }

    if(!pendingTasks && !data.events.length){

        html += "💙 Nothing urgent today.";

    }

    box.innerHTML = html;

}

/*==================================================
SECTION 12 — PRODUCTIVITY INSIGHTS
==================================================*/

function updateProductivityInsights(){

    const box = $("productivityInsights");

    if(!box) return;

    const tasks = getDashboardData().tasks;

    const completed =
        tasks.filter(task=>task.done).length;

    const pending =
        tasks.length - completed;

    if(tasks.length === 0){

        box.innerHTML =
        "🚀 Create your first task.";

        return;

    }

    if(pending === 0){

        box.innerHTML =
        "🎉 Everything is completed today!";

        return;

    }

    if(pending <= 2){

        box.innerHTML =
        "🔥 You're almost finished today.";

        return;

    }

    box.innerHTML =
    `💪 ${pending} task(s) remaining today.`;

}

/*==================================================
SECTION 13 — REFRESH ENGINE
==================================================*/

function refreshDashboard(){

    updateClock();

    updateGreeting();

    updateDashboardSummary();

    renderTodayFocus();

    renderDailyBriefing();

    updateRecommendation();

    loadNextEvent();

    loadNotifications();

    updateProductivityInsights();

    loadWeather();

}


/*==================================================
SECTION 14 — AUTO REFRESH
==================================================*/

function startRefreshEngine(){

    refreshDashboard();

    setInterval(

        updateClock,

        APP.clockInterval

    );

    setInterval(

        refreshDashboard,

        APP.refreshInterval

    );

}
/*==================================================
SECTION 15 — HEALTH CHECK
==================================================*/

function dashboardHealthCheck(){

    console.log("====================================");

    console.log(APP.name);

    console.log("Dashboard Version:",APP.version);

    console.log("User:",APP.username);

    console.log("Dashboard Loaded Successfully");

    console.log("====================================");

}
/*==================================================
SECTION 16 — INITIALIZATION
==================================================*/

function initializeDashboard(){

    dashboardHealthCheck();

    startRefreshEngine();

}

/*==================================================
START APPLICATION
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);
