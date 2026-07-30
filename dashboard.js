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

