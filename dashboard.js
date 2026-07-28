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
function safeRead(key) {

    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
        return [];
    }

}
function getDashboardData() {

    return {

        tasks: safeRead("tasks"),

        goals: safeRead("goals"),

        events: safeRead("events"),

        notes: safeRead("notes"),

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
/*==================================================
 AI GREETING
==================================================*/

function loadAIGreeting() {

    const aiGreeting = getElement("aiGreeting");
    const recommendation = getElement("aiRecommendation");

    if (!aiGreeting || !recommendation) return;

    const { tasks, goals, events } = getDashboardData();

    const pendingTasks = tasks.filter(task => !task.done);

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "🌅 Good Morning";

    } else if (hour < 18) {

        greeting = "☀️ Good Afternoon";

    } else {

        greeting = "🌙 Good Evening";

    }

    aiGreeting.innerHTML = `${greeting}, ${username}!`;

    recommendation.innerHTML = `
        📊 Dashboard Summary<br><br>

        ✅ Pending Tasks:
        <strong>${pendingTasks.length}</strong><br>

        🎯 Goals:
        <strong>${goals.length}</strong><br>

        📅 Events:
        <strong>${events.length}</strong>
    `;

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

    const tip = getElement("tipText");

    if (!tip) return;

    const today = new Date().getDate();

    tip.textContent =
        DAILY_TIPS[today % DAILY_TIPS.length];

}

/*==================================================
 WEATHER SYSTEM
==================================================*/

async function loadWeather() {

    const weatherBox = document.getElementById("weatherText");

    if (!weatherBox) return;

    if (!navigator.geolocation) {

        weatherBox.innerHTML =
        `
        <h3>Location unavailable</h3>
        <p>Your browser doesn't support GPS.</p>
        `;

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try{

                const url =
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`;

                const response = await fetch(url);

                const data = await response.json();

                weatherBox.innerHTML = `
                    <h2>${data.current.temperature_2m}°C</h2>

                    <p>Humidity: ${data.current.relative_humidity_2m}%</p>

                    <p>Weather updated successfully.</p>
                `;

            }

            catch(error){

                weatherBox.innerHTML =
                `
                <h3>Weather unavailable</h3>

                <p>Unable to load weather.</p>
                `;

            }

        },

        ()=>{

            weatherBox.innerHTML =
            `
            <h3>Location permission denied</h3>

            <p>Please enable location services.</p>
            `;

        }

    );

}
/*==================================================
 DAILY AI BRIEFING
==================================================*/

function generateDailyBriefing() {

    const { tasks, goals, events } =
        getDashboardData();

    const briefingBox =
        getElement("briefingText");

    if (!briefingBox) return;

    const today =
        new Date().toISOString().split("T")[0];

    const todayEvents =
        events.filter(event => event.date === today);

    const pendingTasks =
        tasks.filter(task => task.done !== true)

    const pendingGoals =
goals.filter(goal => goal.done !== true);
 
    let briefing =
        `👋 Good day, ${username}!\n\n`;

    briefing +=
        `📅 Today's Events: ${todayEvents.length}\n`;

    briefing +=
        `✅ Pending Tasks: ${pendingTasks.length}\n`;

    briefing +=
        `🎯 Pending Goals: ${pendingGoals.length}\n\n`;

    if (pendingTasks.length > 0) {

        briefing +=
            `🔥 Focus on:\n${pendingTasks[0].text}`;

    } else if (pendingGoals.length > 0) {

        briefing +=
            "🎯 Great job finishing your tasks.\nNow focus on your remaining goals.";

    } else {

        briefing +=
            "🎉 Fantastic!\nYou're completely caught up today.";

    }

    briefingBox.innerText = briefing;

}


/*==================================================
 SMART NOTIFICATIONS
==================================================*/

function loadNotifications() {

    const box =
        getElement("notificationBox");

    if (!box) return;

    const { tasks, events } =
        getDashboardData();

    const pending =
        tasks.filter(task => !task.done).length;

    let html =
        `🎉 Welcome back, ${username}!<br><br>`;

    if (pending > 0) {

        html +=
            `📌 ${pending} pending task(s).<br>`;

    }

    if (events.length > 0) {

        html +=
            `📅 ${events.length} upcoming event(s).<br>`;

    }

    if (pending === 0 && events.length === 0) {

        html +=
            "💙 Nothing urgent today. Enjoy your day!";

    }

    box.innerHTML = html;

}
/*==================================================
 NEXT UPCOMING EVENT
==================================================*/

function loadNextEvent() {

    const nextEvent = getElement("nextEvent");

    if (!nextEvent) return;

    const events = [...getDashboardData().events];

    if (events.length === 0) {

        nextEvent.innerHTML = "<p>No upcoming events.</p>";
        return;

    }

    events.sort((a, b) => {

        return (
            new Date(a.date + " " + (a.time || "00:00")) -
            new Date(b.date + " " + (b.time || "00:00"))
        );

    });

    const event = events[0];

    nextEvent.innerHTML = `
        <strong>📅 ${event.title}</strong><br><br>

        📅 ${event.date}<br>

        ${event.time ? `🕒 ${event.time}<br>` : ""}

        ${event.location ? `📍 ${event.location}` : ""}
    `;

}


/*==================================================
 DASHBOARD SUMMARY
==================================================*/

function refreshDashboard() {

    const { tasks, goals, events } =
        getDashboardData();

    const completed =
        tasks.filter(task => task.done).length;

    setText("taskCount", tasks.length);
    setText("goalCount", goals.length);
    setText("eventCount", events.length);

    const percent =
        tasks.length === 0
            ? 0
            : Math.round((completed / tasks.length) * 100);

    setText(
        "productivityScore",
        percent + "%"
    );

    setWidth(
        "progressBar",
        percent + "%"
    );

    setText(
        "progressText",
        `${completed} of ${tasks.length} Tasks Completed`
    );

}


/*==================================================
 ACHIEVEMENT SYSTEM
==================================================*/

function updateAchievement() {

    const badge =
        getElement("achievementBadge");

    const text =
        getElement("achievementText");

    if (!badge || !text) return;

    const { tasks } =
        getDashboardData();

    const completed =
        tasks.filter(task => task.done).length;

    if (completed >= 50) {

        badge.textContent = "💎 Legend";

        text.textContent =
            "You've completed over 50 tasks.";

    }

    else if (completed >= 20) {

        badge.textContent =
            "👑 Productivity Master";

        text.textContent =
            "Outstanding! You completed 20 tasks.";

    }

    else if (completed >= 10) {

        badge.textContent =
            "🏆 Task Champion";

        text.textContent =
            "Excellent! You completed 10 tasks.";

    }

    else if (completed >= 5) {

        badge.textContent =
            "🔥 Hard Worker";

        text.textContent =
            "Great job! You completed 5 tasks.";

    }

    else if (completed >= 1) {

        badge.textContent =
            "🌟 First Step";

        text.textContent =
            "Great job! You completed your first task.";

    }

    else {

        badge.textContent =
            "🚀 Ready To Begin";

        text.textContent =
            "Complete your first task to unlock achievements.";

    }

}

/*==================================================
 SMART AI RECOMMENDATION
==================================================*/

function updateRecommendation() {

    const { tasks, goals, events } = getDashboardData();

    const box = getElement("aiRecommendation");

    if (!box) return;

    const pendingTasks =
        tasks.filter(task => !task.done);

    let message = "";

    if (pendingTasks.length > 0) {

        message =
            `✅ Start with:<br><strong>${pendingTasks[0].text}</strong>`;

    }

    else if (events.length > 0) {

        message =
            `📅 You have <strong>${events.length}</strong> upcoming event(s).`;

    }

    else if (goals.length > 0) {

       
         message =
`🎯 Continue working on:<br><strong>${goals[0].text || goals[0].title || "Your Goal"}</strong>`;

    }

    else {

        const ideas = [

            "💡 Learn something new today.",

            "🚀 Create a new goal.",

            "📒 Write a new note.",

            "💙 Enjoy your productive day.",

            "🌟 You're doing amazing."

        ];

        message =
            ideas[Math.floor(Math.random() * ideas.length)];

    }

    box.innerHTML = message;

}


/*==================================================
 DASHBOARD STATS
==================================================*/

function updateDashboardStats() {

    const { xp, notes, streak } =
        getDashboardData();

    setText("xpCount", xp.xp);

    setText("levelCount", xp.level);

    setText("noteCount", notes.length);

    setText(
        "streakCount",
        `${streak.days} Day${streak.days === 1 ? "" : "s"}`
    );

}


/*==================================================
 PRODUCTIVITY INSIGHTS
==================================================*/

function updateProductivityInsights() {

    const { tasks } =
        getDashboardData();

    const box =
        getElement("productivityInsights");

    if (!box) return;

    const completed =
        tasks.filter(task => task.done).length;

    const pending =
        tasks.length - completed;

    let message = "";

    if (tasks.length === 0) {

        message =
            "🚀 No tasks yet. Create your first task to begin.";

    }

    else if (completed === tasks.length) {

        message =
            "🎉 Amazing! Every task has been completed today.";

    }

    else if (pending <= 2) {

        message =
            "🔥 You're almost done. Keep going!";

    }

    else {

        message =
            `💪 ${pending} task(s) remain today. Stay focused.`;

    }

    box.innerHTML = message;

}


/*==================================================
 WEEKLY PROGRESS
==================================================*/

function updateWeeklyProgress() {

    const box =
        getElement("weeklyProgress");

    if (!box) return;

    const { tasks } =
        getDashboardData();

    const completed =
        tasks.filter(task => task.done).length;

    const percent =
        tasks.length === 0
            ? 0
            : Math.round(
                (completed / tasks.length) * 100
            );

    box.innerHTML = `
        📈 Weekly Progress

        <br><br>

        <strong>${percent}% Complete</strong>
    `;

}


/*==================================================
 AI PRODUCTIVITY SCORE
==================================================*/

function updateAIScore() {

    const score =
        getElement("aiScore");

    if (!score) return;

    const { tasks, streak } =
        getDashboardData();

    const completed =
        tasks.filter(task => task.done).length;

    let total = completed * 5;

    total += streak.days * 2;

    if (total > 100)
        total = 100;

    score.innerHTML = `
        🤖 AI Productivity Score

        <br><br>

        <strong>${total}/100</strong>
    `;

}
/*==================================================
 REFRESH ENGINE
==================================================*/

function refreshAllDashboard() {

    updateDateTime();

    updateGreeting();

    loadAIGreeting();

    loadDailyTip();

    refreshDashboard();

    updateAchievement();

    updateRecommendation();

    updateDashboardStats();

      loadWeather();
 
    updateProductivityInsights();

    updateWeeklyProgress();

    updateAIScore();

    loadNextEvent();

    generateDailyBriefing();

    loadNotifications();

}


/*==================================================
 AUTO SAVE
==================================================*/

function autoSaveDashboard() {

    localStorage.setItem(

        "dashboardLastOpened",

        new Date().toISOString()

    );

}


/*==================================================
 DASHBOARD HEALTH CHECK
==================================================*/

function dashboardHealthCheck() {

    console.log("================================");

    console.log(`${APP.name} v${APP.version}`);

    console.log("Dashboard Loaded Successfully");

    console.log("User:", username);

    const data = getDashboardData();

    console.log("Tasks:", data.tasks.length);

    console.log("Goals:", data.goals.length);

    console.log("Events:", data.events.length);

    console.log("Notes:", data.notes.length);

    console.log("XP:", data.xp.xp);

    console.log("Level:", data.xp.level);

    console.log("Streak:", data.streak.days);

    console.log("================================");

}


/*==================================================
 MENU
==================================================*/

function initializeMenu() {

    const sideMenu = getElement("sideMenu");

    const menuBtn = getElement("menuBtn");

    const closeBtn = getElement("closeBtn");

    if (menuBtn && sideMenu) {

        menuBtn.onclick = () => {

            sideMenu.classList.add("active");

        };

    }

    if (closeBtn && sideMenu) {

        closeBtn.onclick = () => {

            sideMenu.classList.remove("active");

        };

    }

}


/*==================================================
 INITIALIZATION
==================================================*/

function initializeDashboard() {

    dashboardHealthCheck();

    initializeMenu();

    autoSaveDashboard();

    refreshAllDashboard();

    setInterval(

        updateDateTime,

        APP.clockInterval

    );

    setInterval(() => {

        autoSaveDashboard();

        refreshAllDashboard();

    }, APP.refreshInterval);

}


/*==================================================
 START APP
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);
