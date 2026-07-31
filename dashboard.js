"use strict";

/*==================================================
 AI LIFE ASSISTANT
 Dashboard.js Version 6.1.1
 Production Build (Fixed)
==================================================*/


/*==================================================
 SECTION 1 — APPLICATION CORE
==================================================*/

const APP = {
    name: "AI Life Assistant",
    version: "6.1.1",
    author: "Adegbite Samuel Abayomi",
    username: localStorage.getItem("profileName") || "Samuel",
    clockInterval: 1000,
    refreshInterval: 30000,
    weatherRefresh: 600000,
    debug: true
};


/*==================================================
 GLOBAL CACHE
==================================================*/

const CACHE = {
    weather: null,
    dashboard: null,
    lastRefresh: null
};


/*==================================================
 SAFE STORAGE
==================================================*/

const Storage = {
    read(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) return fallback;
            return JSON.parse(value);
        } catch (error) {
            console.error("Storage Read Error:", key, error);
            return fallback;
        }
    },

    write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Storage Write Error:", key, error);
            return false;
        }
    }
};


/*==================================================
 LOAD ALL DASHBOARD DATA
==================================================*/

function getDashboardData() {
    return {
        tasks: Storage.read("tasks", []),
        goals: Storage.read("goals", []),
        events: Storage.read("events", []),
        notes: Storage.read("notes", []),
        reminders: Storage.read("reminders", []),
        wellness: Storage.read("wellness", {}),
        habits: Storage.read("habits", []),
        xp: Storage.read("xp", { xp: 0, level: 1, total: 0 }),
        streak: Storage.read("streak", { days: 0 })
    };
}


/*==================================================
 SECTION 2 — DOM & UTILITY ENGINE
==================================================*/

function $(id) {
    return document.getElementById(id);
}

function exists(id) {
    return $(id) !== null;
}

function setText(id, value) {
    const element = $(id);
    if (!element) return;
    element.textContent = value;
}

function setHTML(id, value) {
    const element = $(id);
    if (!element) return;
    element.innerHTML = value;
}

function setWidth(id, value) {
    const element = $(id);
    if (!element) return;
    element.style.width = value;
}

function show(id) {
    const element = $(id);
    if (!element) return;
    element.style.display = "";
}

function hide(id) {
    const element = $(id);
    if (!element) return;
    element.style.display = "none";
}

function showLoading(id, text = "Loading...") {
    const element = $(id);
    if (!element) return;
    element.innerHTML = `<div class="loadingBox">⏳ ${text}</div>`;
}

function showEmpty(id, text) {
    const element = $(id);
    if (!element) return;
    element.innerHTML = `<div class="emptyBox">${text}</div>`;
}

function formatNumber(value) {
    return Number(value).toLocaleString();
}

function formatPercent(value) {
    return value + "%";
}

function today() {
    return new Date();
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function log(message) {
    if (APP.debug) {
        console.log("[AI LIFE]", message);
    }
}

function error(message, data = null) {
    console.error("[AI LIFE ERROR]", message, data);
}


/*==================================================
 SECTION 3 — CLOCK & GREETING ENGINE
==================================================*/

function updateClock() {
    const now = new Date();

    setText("todayDate", now.toDateString());

    const currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    setText("currentTime", currentTime);
}

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "🌅 Good Morning";
    if (hour < 17) return "☀️ Good Afternoon";
    if (hour < 21) return "🌇 Good Evening";
    return "🌙 Good Night";
}

function getMotivation() {
    const messages = [
        "💙 One small step today is better than no step.",
        "🚀 Progress beats perfection every single time.",
        "🌟 Your future is built by today's actions.",
        "🔥 Stay consistent. Great things take time.",
        "📈 Success is created through daily discipline.",
        "🎯 Focus on what matters most today.",
        "💡 Every task completed brings you closer to your goals."
    ];

    const index = new Date().getDate() % messages.length;
    return messages[index];
}

function updateGreeting() {
    const greeting = getGreeting();

    setText("welcomeText", `${greeting}, ${APP.username}`);

    setHTML("assistantMessage", `
        <strong>${greeting}</strong>
        <br><br>
        ${getMotivation()}
    `);
}


/*==================================================
 SECTION 4 — SMART DASHBOARD SUMMARY
==================================================*/

function updateDashboardSummary() {
    const data = getDashboardData();

    const tasks = data.tasks || [];
    const goals = data.goals || [];
    const events = data.events || [];
    const notes = data.notes || [];
    const xp = data.xp || { xp: 0, level: 1, total: 0 };

    const completedTasks = tasks.filter(task => task.done).length;
    const pendingTasks = tasks.filter(task => !task.done).length;
    const pendingGoals = goals.filter(goal => !goal.done).length;

    let productivity = 0;
    if (tasks.length > 0) {
        productivity = Math.round((completedTasks / tasks.length) * 100);
    }

    setText("taskCount", tasks.length);
    setText("goalCount", goals.length);
    setText("eventCount", events.length);
    setText("noteCount", notes.length);
    setText("xpCount", xp.xp);
    setText("levelCount", xp.level);
    setText("productivityScore", productivity + "%");
    setText("progressText", `${completedTasks} of ${tasks.length} Tasks Completed`);
    setWidth("progressBar", productivity + "%");

    const summary = $("dashboardSummary");
    if (summary) {
        summary.innerHTML = `
            📊 Dashboard Summary
            <br><br>
            ✅ Pending Tasks: <strong>${pendingTasks}</strong><br>
            🎯 Active Goals: <strong>${pendingGoals}</strong><br>
            📅 Upcoming Events: <strong>${events.length}</strong><br>
            📝 Notes: <strong>${notes.length}</strong><br>
            ⭐ XP: <strong>${xp.xp}</strong><br>
            🏆 Level: <strong>${xp.level}</strong>
        `;
    }
}


/*==================================================
 SECTION 5 — AI INTELLIGENCE ENGINE
==================================================*/

function getWellnessScore() {
    const wellness = getDashboardData().wellness || {};
    let score = 50;

    score += Math.min(wellness.water || 0, 8);
    score += Math.min(wellness.sleep || 0, 8);

    if (wellness.mood) {
        switch (wellness.mood.text) {
            case "Great": score += 20; break;
            case "Good": score += 15; break;
            case "Okay": score += 10; break;
            case "Sad": score -= 10; break;
            case "Stressed": score -= 20; break;
        }
    }

    return Math.max(0, Math.min(score, 100));
}

/* ---------- TODAY'S FOCUS (FIXED) ---------- */
function renderTodayFocus() {
    const box = $("todayFocus");
    if (!box) return;

    const tasks = getDashboardData().tasks || [];
    const pending = tasks.filter(task => !task.done);

    if (pending.length === 0) {
        box.innerHTML = `
            🎉 Excellent!<br><br>
            All your tasks are completed today.
        `;
        return;
    }

    // Sort by priority (higher first)
    pending.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    let html = "";
    pending.slice(0, 3).forEach(task => {
        html += `🔥 ${task.title || task.text}<br>`;
    });

    box.innerHTML = html;
}

/* ---------- DAILY AI BRIEFING ---------- */
function renderDailyBriefing() {
    const box = $("briefingText");
    if (!box) return;

    const data = getDashboardData();
    const pendingTasks = data.tasks.filter(task => !task.done).length;
    const pendingGoals = data.goals.filter(goal => !goal.done).length;
    const score = getWellnessScore();

    let briefing = `👋 Hello ${APP.username}!<br><br>`;
    briefing += `💙 Wellness Score: <strong>${score}%</strong><br><br>`;

    if (score >= 80) {
        briefing += "🚀 Your energy is high today. Focus on your biggest goal.<br><br>";
    } else if (score >= 60) {
        briefing += "💪 Today is a great day to finish your important tasks.<br><br>";
    } else {
        briefing += "🌿 Take things slowly today. Prioritize your health first.<br><br>";
    }

    briefing += `📌 Pending Tasks: ${pendingTasks}<br>`;
    briefing += `🎯 Active Goals: ${pendingGoals}<br>`;
    briefing += `📅 Events: ${data.events.length}`;

    box.innerHTML = briefing;
}

/* ---------- AI RECOMMENDATION ---------- */
function updateRecommendation() {
    const box = $("aiRecommendation");
    if (!box) return;

    const data = getDashboardData();
    const score = getWellnessScore();
    const pendingTasks = data.tasks.filter(task => !task.done).length;

    let message = "";

    if (score >= 90) {
        message = "🏆 You are performing at your best today. Finish your biggest project.";
    } else if (score >= 70) {
        message = `🔥 You have ${pendingTasks} task(s). Complete the hardest one first.`;
    } else if (score >= 50) {
        message = "🙂 Stay hydrated and complete one important task before relaxing.";
    } else {
        message = "💙 Rest today. Drink water, recharge and avoid burnout.";
    }

    box.innerHTML = `
        <strong>🤖 AI Recommendation</strong>
        <br><br>
        ${message}
    `;
}


/*==================================================
 SECTION 6 — WEATHER ENGINE
==================================================*/

async function loadWeather() {
    const box = $("weatherText");
    if (!box) return;

    box.innerHTML = "🌤 Loading weather...";

    if (!navigator.geolocation) {
        box.innerHTML = `
            📍 Location unavailable
            <br><br>
            Browser doesn't support GPS.
        `;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,is_day`;

                const response = await fetch(url);
                const data = await response.json();
                const current = data.current;

                let icon = "☀️";
                switch (current.weather_code) {
                    case 0: icon = "☀️"; break;
                    case 1: case 2: case 3: icon = "⛅"; break;
                    case 45: case 48: icon = "🌫️"; break;
                    case 51: case 53: case 55: icon = "🌦️"; break;
                    case 61: case 63: case 65: icon = "🌧️"; break;
                    case 71: case 73: case 75: icon = "❄️"; break;
                    case 95: icon = "⛈️"; break;
                }

                box.innerHTML = `
                    <div class="weatherCard">
                        <div style="font-size:42px">${icon}</div>
                        <h2>${current.temperature_2m}°C</h2>
                        <p>💧 Humidity ${current.relative_humidity_2m}%</p>
                        <small>Updated just now</small>
                    </div>
                `;
            } catch (err) {
                console.error(err);
                box.innerHTML = `
                    ⚠️ Unable to load weather
                    <br><br>
                    Check your internet connection.
                `;
            }
        },
        () => {
            box.innerHTML = `
                📍 Location permission denied
                <br><br>
                Enable Location Services to see live weather.
            `;
        }
    );
}


/*==================================================
 SECTION 7 — XP • LEVEL • ACHIEVEMENTS
==================================================*/

function updateXP() {
    const xpData = getDashboardData().xp;
    setText("xpCount", xpData.xp);
    setText("levelCount", xpData.level);
}

function addXP(amount) {
    const xpData = getDashboardData().xp;

    xpData.xp += amount;
    xpData.total += amount;

    while (xpData.xp >= 100) {
        xpData.xp -= 100;
        xpData.level++;
        showLevelPopup(xpData.level);
    }

    Storage.write("xp", xpData);
    updateXP();
}

function showLevelPopup(level) {
    const popup = $("levelPopup");
    if (!popup) return;

    setText("popupLevel", "Level " + level);
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}

function updateAchievement() {
    const badge = $("achievementBadge");
    const text = $("achievementText");
    if (!badge || !text) return;

    const completed = getDashboardData().tasks.filter(task => task.done).length;

    if (completed >= 100) {
        badge.textContent = "💎 Legend";
        text.textContent = "Completed over 100 tasks.";
    } else if (completed >= 50) {
        badge.textContent = "👑 Master";
        text.textContent = "Completed over 50 tasks.";
    } else if (completed >= 20) {
        badge.textContent = "🏆 Champion";
        text.textContent = "Completed over 20 tasks.";
    } else if (completed >= 10) {
        badge.textContent = "🔥 Hard Worker";
        text.textContent = "Completed over 10 tasks.";
    } else if (completed >= 1) {
        badge.textContent = "🌟 First Step";
        text.textContent = "Completed your first task.";
    } else {
        badge.textContent = "🚀 Beginner";
        text.textContent = "Complete a task to unlock achievements.";
    }
}

function updateWeeklyProgress() {
    const box = $("weeklyProgress");
    if (!box) return;

    const tasks = getDashboardData().tasks;
    const completed = tasks.filter(task => task.done).length;
    const percent = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

    box.innerHTML = `
        📈 Weekly Progress
        <br><br>
        <strong>${percent}% Complete</strong>
    `;
}

function updateAIScore() {
    const box = $("aiScore");
    if (!box) return;

    const data = getDashboardData();
    const completed = data.tasks.filter(task => task.done).length;

    let score = completed * 5;
    score += (data.streak.days || 0) * 2;
    score += (data.xp.level || 1) * 3;

    if (score > 100) score = 100;

    box.innerHTML = `
        🤖 AI Productivity Score
        <br><br>
        <strong>${score}/100</strong>
    `;
}


/*==================================================
 SECTION 8 — SMART NOTIFICATIONS & DAILY TIPS
==================================================*/

const DAILY_TIPS = [
    "💪 Start with your most important task.",
    "🚀 Progress is better than perfection.",
    "💧 Drink enough water today.",
    "📅 Always check your calendar before starting work.",
    "🎯 Finish one important task before checking social media.",
    "📚 Learn one new thing today.",
    "🌱 Small daily improvements create huge success."
];

function loadDailyTip() {
    const box = $("tipText");
    if (!box) return;

    const index = new Date().getDate() % DAILY_TIPS.length;
    box.innerHTML = DAILY_TIPS[index];
}

function loadNotifications() {
    const box = $("notificationBox");
    if (!box) return;

    const data = getDashboardData();
    const pendingTasks = data.tasks.filter(task => !task.done).length;

    let html = `🎉 Welcome back, ${APP.username}!<br><br>`;

    if (pendingTasks > 0) {
        html += `📌 You have <strong>${pendingTasks}</strong> pending task(s).<br>`;
    }
    if (data.events.length > 0) {
        html += `📅 ${data.events.length} upcoming event(s).<br>`;
    }
    if (data.goals.length > 0) {
        html += `🎯 ${data.goals.length} active goal(s).<br>`;
    }
    if (pendingTasks === 0 && data.events.length === 0) {
        html += "💙 Everything looks great today.";
    }

    box.innerHTML = html;
}

function checkReminders() {
    const reminders = Storage.read("reminders", []);
    if (reminders.length === 0) return;

    const today = new Date().toDateString();

    reminders.forEach(reminder => {
        if (reminder.date === today) {
            console.log("Reminder:", reminder.title);
        }
    });
}

function loadDailyMotivation() {
    const box = $("motivationCard");
    if (!box) return;

    const messages = [
        "🔥 Keep going. You're building something amazing.",
        "🌟 Consistency beats talent every time.",
        "🚀 Today's effort creates tomorrow's success.",
        "💙 Believe in yourself and trust the process.",
        "🎯 Stay focused on your vision."
    ];

    const index = new Date().getDay() % messages.length;
    box.innerHTML = messages[index];
}


/*==================================================
 AI INSIGHTS
==================================================*/

function renderAIInsights() {
    const box = $("aiInsights");
    if (!box) return;

    const data = getDashboardData();
    const tasks = data.tasks.filter(t => !t.done).length;
    const goals = data.goals.filter(g => !g.done).length;
    const events = data.events.length;

    let message = "";

    if (tasks > 5) {
        message = "⚠️ You have many unfinished tasks. Focus on only one today.";
    } else if (goals > 0) {
        message = "🎯 You are making progress toward your goals. Keep your momentum.";
    } else if (events > 0) {
        message = "📅 You have upcoming events. Check your calendar before starting new work.";
    } else {
        message = "🚀 You're doing great. Why not learn something new today?";
    }

    box.innerHTML = message;
}


/*==================================================
 MOTIVATION
==================================================*/

const MOTIVATION = [
    "Success is built one small task at a time.",
    "Stay consistent. Small progress beats no progress.",
    "You are building your future every single day.",
    "Your future self will thank you for today's effort.",
    "Keep going. You're closer than yesterday.",
    "Discipline creates freedom.",
    "Progress is better than perfection."
];

function renderMotivation() {
    const box = $("motivationCard");
    if (!box) return;

    const day = new Date().getDate();
    box.innerHTML = "💡 " + MOTIVATION[day % MOTIVATION.length];
}


/*==================================================
 SECTION 9 — NEXT EVENT
==================================================*/

function loadNextEvent() {
    const box = $("nextEvent");
    if (!box) return;

    const events = getDashboardData().events || [];

    if (events.length === 0) {
        box.innerHTML = "📅 No upcoming events.";
        return;
    }

    // Sort by date (soonest first)
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    const next = events[0];

    box.innerHTML = `
        <strong>${next.title}</strong><br>
        📅 ${next.date}
        ${next.time ? `<br>🕒 ${next.time}` : ""}
        ${next.location ? `<br>📍 ${next.location}` : ""}
    `;
}


/*==================================================
 SECTION 10 — PRODUCTIVITY INSIGHTS
==================================================*/

function updateProductivityInsights() {
    const box = $("productivityInsights");
    if (!box) return;

    const tasks = getDashboardData().tasks || [];
    const completed = tasks.filter(task => task.done).length;
    const pending = tasks.length - completed;

    if (tasks.length === 0) {
        box.innerHTML = "🚀 Create your first task.";
        return;
    }

    if (pending === 0) {
        box.innerHTML = "🎉 Everything is completed today!";
        return;
    }

    if (pending <= 2) {
        box.innerHTML = "🔥 You're almost finished today.";
        return;
    }

    box.innerHTML = `💪 ${pending} task(s) remaining today.`;
}


/*==================================================
 SECTION 11 — AI LIFE SCORE™
==================================================*/

function calculateLifeScore() {
    const data = getDashboardData();
    let score = 0;

    // Tasks (max 30)
    const tasks = data.tasks || [];
    const completedTasks = tasks.filter(task => task.done).length;
    if (tasks.length > 0) {
        score += Math.round((completedTasks / tasks.length) * 30);
    }

    // Goals (max 20)
    const goals = data.goals || [];
    const completedGoals = goals.filter(goal => goal.done).length;
    if (goals.length > 0) {
        score += Math.round((completedGoals / goals.length) * 20);
    }

    // Wellness
    const wellness = data.wellness || {};
    score += Math.min(wellness.water || 0, 8);
    score += Math.min(wellness.sleep || 0, 8);

    // Streak (max 10)
    score += Math.min(data.streak.days || 0, 10);

    // XP Level (max 20)
    score += Math.min((data.xp.level || 1) * 2, 20);

    return Math.min(score, 100);
}

function renderLifeScore() {
    const box = $("lifeScore");
    if (!box) return;

    const score = calculateLifeScore();
    let status = "";

    if (score >= 90) status = "🏆 Excellent";
    else if (score >= 75) status = "🚀 Great";
    else if (score >= 60) status = "👍 Good";
    else if (score >= 40) status = "🙂 Improving";
    else status = "🌱 Keep Going";

    box.innerHTML = `
        <div class="lifeScoreNumber">${score}</div>
        <div class="lifeScoreStatus">${status}</div>
    `;
}


/*==================================================
 SECTION 12 — HEALTH CHECK
==================================================*/

function dashboardHealthCheck() {
    console.log("====================================");
    console.log(APP.name);
    console.log("Dashboard Version:", APP.version);
    console.log("Author:", APP.author);
    console.log("User:", APP.username);
    console.log("Dashboard Loaded Successfully");
    console.log("====================================");
}


/*==================================================
 DASHBOARD REFRESH ENGINE
==================================================*/

function refreshDashboard() {
    try {
        updateClock();
        updateGreeting();
        updateDashboardSummary();
        renderTodayFocus();
        renderDailyBriefing();
        updateRecommendation();
        renderAIInsights();
        renderMotivation();
        renderLifeScore();
        loadNextEvent();
        loadNotifications();
        updateAchievement();
        updateProductivityInsights();
        updateWeeklyProgress();
        updateAIScore();
        updateXP();
        loadWeather();
        checkReminders();
        loadDailyTip();

        CACHE.lastRefresh = new Date();
        log("Dashboard refreshed");
    } catch (err) {
        console.error("Dashboard Refresh Error", err);
    }
}


/*==================================================
 INITIALIZATION
==================================================*/

function initializeDashboard() {
    dashboardHealthCheck();
    refreshDashboard();

    setInterval(updateClock, APP.clockInterval);
    setInterval(refreshDashboard, APP.refreshInterval);
}

document.addEventListener("DOMContentLoaded", initializeDashboard);
