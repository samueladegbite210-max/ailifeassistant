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
        tasks.filter(task => !task.done);

    const pendingGoals =
        goals.filter(goal => !goal.done);

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
