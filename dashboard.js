"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   Dashboard.js Version 4.0
========================================== */

/* ==========================================
   CONFIG
========================================== */

const APP = {
    username: localStorage.getItem("profileName") || "Samuel",
    refreshTime: 30000
};

/* ==========================================
   STORAGE
========================================== */

function readStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function getDashboardData() {
    return {
        tasks: readStorage("tasks"),
        goals: readStorage("goals"),
        events: readStorage("events"),
        notes: readStorage("notes"),
        wellness: JSON.parse(localStorage.getItem("wellness")) || {},
        xp: JSON.parse(localStorage.getItem("xp")) || {
            xp: 0,
            level: 1,
            total: 0
        },
        streak: JSON.parse(localStorage.getItem("streak")) || {
            days: 0
        }
    };
}

/* ==========================================
   HELPERS
========================================== */

function $(id){
    return document.getElementById(id);
}

function setText(id,text){
    const el=$(id);
    if(el) el.textContent=text;
}

function setHTML(id,html){
    const el=$(id);
    if(el) el.innerHTML=html;
}
/* ==========================================
   CLOCK
========================================== */

function updateClock(){

    const now = new Date();

    setText("todayDate", now.toDateString());

    const time = now.toLocaleTimeString([],{

        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit"

    });

    setText("currentTime", time);

}


/* ==========================================
   GREETING
========================================== */

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
        📅 Today is a brand-new opportunity.<br><br>

        Stay organized, complete your tasks,
        and make progress toward your goals.
        `

    );

}
/* ==========================================
   DASHBOARD SUMMARY
========================================== */

function updateDashboardSummary(){

    const data = getDashboardData();

    const tasks = data.tasks || [];
    const goals = data.goals || [];
    const events = data.events || [];
    const notes = data.notes || [];
    const xp = data.xp || { xp:0, level:1 };

    const completedTasks = tasks.filter(task => task.done).length;

    const productivity = tasks.length === 0
        ? 0
        : Math.round((completedTasks / tasks.length) * 100);

    setText("taskCount", tasks.length);

    setText("goalCount", goals.length);

    setText("eventCount", events.length);

    setText("noteCount", notes.length);

    setText("xpCount", xp.xp);

    setText("levelCount", xp.level);

    setText("productivityScore", productivity + "%");

    setText(

        "progressText",

        `${completedTasks} of ${tasks.length} Tasks Completed`

    );

    const progressBar = $("progressBar");

    if(progressBar){

        progressBar.style.width = productivity + "%";

    }

}

/* ==========================================
   TODAY'S FOCUS
========================================== */

function renderTodayFocus(){

    const box = $("todayFocus");

    if(!box) return;

    const tasks = getDashboardData().tasks;

    const pending = tasks.filter(task => !task.done);

    if(pending.length === 0){

        box.innerHTML =
        "🎉 Everything is completed today!";

        return;

    }

    const priority = pending.slice(0,3);

    let html = "";

    priority.forEach(task=>{

        html += `🔥 ${task.text || task.title}<br>`;

    });

    box.innerHTML = html;

}


/* ==========================================
   DAILY AI BRIEFING
========================================== */

function renderDailyBriefing(){

    const box = $("briefingText");

    if(!box) return;

    const data = getDashboardData();

    const tasks = data.tasks;

    const goals = data.goals;

    const events = data.events;

    const pendingTasks =
    tasks.filter(task=>!task.done).length;

    const pendingGoals =
    goals.filter(goal=>!goal.done).length;

    let message = "";

    message += `👋 Good to see you, ${APP.username}!<br><br>`;

    message += `✅ Pending Tasks: ${pendingTasks}<br>`;

    message += `🎯 Goals: ${pendingGoals}<br>`;

    message += `📅 Events: ${events.length}<br><br>`;

    if(pendingTasks>0){

        message +=
        "🔥 Your first priority today is completing your most important task.";

    }

    else if(pendingGoals>0){

        message +=
        "🎯 Great! Now spend some time on your goals.";

    }

    else{

        message +=
        "🎉 You're all caught up today. Enjoy your day!";

    }

    box.innerHTML = message;

}

/* ==========================================
   AI RECOMMENDATION
========================================== */

function updateRecommendation(){

    const box = $("aiRecommendation");

    if(!box) return;

    const data = getDashboardData();

    const tasks = data.tasks;
    const goals = data.goals;
    const events = data.events;

    const wellness =
    JSON.parse(localStorage.getItem("wellness")) || {};

    const pendingTasks =
    tasks.filter(task=>!task.done);

    let score = 50;

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

    score += Math.min(wellness.sleep || 0,8);

    score += Math.min(wellness.water || 0,8);

    if(score>100) score=100;

    if(score<0) score=0;

    let message = `<strong>💙 Wellness Score: ${score}%</strong><br><br>`;

    if(score>=80){

        message +=
        "🚀 You're in great shape today. Finish your biggest goal first.";

    }

    else if(score>=60){

        message +=
        `✅ You have ${pendingTasks.length} pending task(s). Complete one important task today.`;

    }

    else{

        message +=
        "😴 Your energy seems low today. Drink water, rest if needed, and don't overload yourself.";

    }

    if(events.length){

        message += `<br><br>📅 Upcoming Events: ${events.length}`;

    }

    if(goals.length){

        message += `<br>🎯 Active Goals: ${goals.length}`;

    }

    box.innerHTML = message;

}
