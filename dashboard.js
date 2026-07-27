// =====================================
// AI LIFE ASSISTANT DASHBOARD

// =====================================

// Username
const username = localStorage.getItem("profileName") || "Samuel";

// Date & Time
function updateDateTime() {

    const now = new Date();

    const date = document.getElementById("todayDate");
    const time = document.getElementById("currentTime");

    if (date) {
        date.textContent = now.toDateString();
    }

    if (time) {
        time.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
}

// Greeting
function updateGreeting() {

    const welcome = document.getElementById("welcomeText");
    const assistant = document.getElementById("assistantMessage");

    let greeting;

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

    if (welcome) {
        welcome.textContent = `${greeting}, ${username}`;
    }

    if (assistant) {
        assistant.innerHTML = `
📅 Today is a brand-new opportunity.<br><br>
I'm here to help you manage your tasks, goals and events.<br><br>
💙 Let's make today productive together!
`;
    }
}
// AI Greeting
function loadAIGreeting() {

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {
        greeting = "🌅 Good morning, Samuel!";
    } else if (hour < 18) {
        greeting = "☀️ Good afternoon, Samuel!";
    } else {
        greeting = "🌙 Good evening, Samuel!";
    }

    document.getElementById("aiGreeting").innerHTML = greeting;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];

    document.getElementById("aiRecommendation").innerHTML =
        "💡 Today you have <strong>" +
        tasks.length +
        "</strong> task(s), <strong>" +
        goals.length +
        "</strong> goal(s), and <strong>" +
        events.length +
        "</strong> event(s).<br><br>" +
        "My recommendation: Finish your most important task first.";

}

loadAIGreeting();

// Menu
const sideMenu = document.getElementById("sideMenu");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");

if (menuBtn && sideMenu) {
    menuBtn.onclick = () => sideMenu.classList.add("active");
}

if (closeBtn && sideMenu) {
    closeBtn.onclick = () => sideMenu.classList.remove("active");
}

// Start Dashboard
updateDateTime();
updateGreeting();
setInterval(updateDateTime, 1000);


// ==========================
// AI Tip of the Day
// ==========================

const tips = [

"💪 Start your day with your most important task.",

"🎯 Focus on progress, not perfection.",

"📅 Check your calendar before starting work.",

"💧 Stay hydrated and take short breaks.",

"🚀 Small steps every day create big success.",

"📚 Learn one new thing today.",

"😊 Smile—you’re building something amazing!"

];

const tip = document.getElementById("tipText");

if(tip){

    const today = new Date().getDate();

    tip.textContent = tips[today % tips.length];

}

function generateDailyBriefing(){

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];

    const today = new Date().toISOString().split("T")[0];

    const todayEvents = events.filter(e => e.date === today);
    const pendingTasks = tasks.filter(t => !t.done);
    const pendingGoals = goals.filter(g => !g.done);

    let briefing = `👋 Good day, Samuel!\n\n`;

    briefing += `📅 Today's Events: ${todayEvents.length}\n`;
    briefing += `✅ Pending Tasks: ${pendingTasks.length}\n`;
    briefing += `🎯 Pending Goals: ${pendingGoals.length}\n\n`;

    if(pendingTasks.length){

        briefing += `🔥 Focus on:\n${pendingTasks[0].text}`;

    }else{

        briefing += "🎉 You're all caught up today!";

    }

    document.getElementById("briefingText").innerText = briefing;

}
// ==========================
// Notifications
// ==========================

function loadNotifications(){

    const box = document.getElementById("notificationBox");

    if(!box) return;

    box.innerHTML = `
<p>🎉 Welcome back, ${username}!</p>
<p>🤖 AI Assistant is ready.</p>
`;

}

loadNotifications();
// ==========================
// Next Upcoming Event
// ==========================

function loadNextEvent(){

    const nextEvent = document.getElementById("nextEvent");

    if(!nextEvent) return;

    let events = JSON.parse(localStorage.getItem("events")) || [];

    if(events.length === 0){

        nextEvent.innerHTML = "<p>No upcoming events.</p>";

        return;

    }

    events.sort(function(a,b){

        return new Date(a.date + " " + (a.time || "00:00")) -
               new Date(b.date + " " + (b.time || "00:00"));

    });

    const event = events[0];

    nextEvent.innerHTML = `
        <strong>📅 ${event.title}</strong><br><br>

        📅 ${event.date}<br>

        ${event.time ? "🕒 " + event.time + "<br>" : ""}

        ${event.location ? "📍 " + event.location : ""}
    `;

}

loadNextEvent();

// ==========================
// Productivity Score and Summary
// ==========================

function refreshDashboard(){

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];

    const completed = tasks.filter(task => task.done).length;

    // Summary
    if(document.getElementById("taskCount"))
        document.getElementById("taskCount").textContent = tasks.length;

    if(document.getElementById("goalCount"))
        document.getElementById("goalCount").textContent = goals.length;

    if(document.getElementById("eventCount"))
        document.getElementById("eventCount").textContent = events.length;

    // Productivity
    const percent = tasks.length === 0
        ? 0
        : Math.round((completed / tasks.length) * 100);

    if(document.getElementById("productivityScore"))
        document.getElementById("productivityScore").textContent = percent + "%";

    if(document.getElementById("progressBar"))
        document.getElementById("progressBar").style.width = percent + "%";

    if(document.getElementById("progressText"))
        document.getElementById("progressText").textContent =
            completed + " of " + tasks.length + " Tasks Completed";

}
refreshAllDashboard();
// ==========================
// Achievement Badge
// ==========================

function updateAchievement(){

    const badge = document.getElementById("achievementBadge");
    const text = document.getElementById("achievementText");

    if(!badge || !text) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completed = tasks.filter(task => task.done).length;

    if(completed >= 20){

        badge.textContent = "👑 Productivity Master";
        text.textContent = "Outstanding! You completed 20 tasks.";

    }else if(completed >= 10){

        badge.textContent = "🏆 Task Champion";
        text.textContent = "Excellent! You completed 10 tasks.";

    }else if(completed >= 5){

        badge.textContent = "🔥 Hard Worker";
        text.textContent = "Great job! You completed 5 tasks.";

    }else if(completed >= 1){

        badge.textContent = "🌟 First Step";
        text.textContent = "Great job! You completed your first task.";

    }else{

        badge.textContent = "🚀 Ready to Begin";
        text.textContent = "Complete your first task to unlock achievements.";

    }

}
updateAchievement();



const dashboardTasks = JSON.parse(localStorage.getItem("tasks")) || [];
const dashboardGoals = JSON.parse(localStorage.getItem("goals")) || [];
const dashboardEvents = JSON.parse(localStorage.getItem("events")) || [];

let recommendation = "";

if (dashboardTasks.length > 0) {
    recommendation = "✅ Your next task is: " + dashboardTasks[0].text;
}
else if (dashboardGoals.length > 0) {
    recommendation = "🎯 Work towards your goal: " + dashboardGoals[0].text;
}
else if (dashboardEvents.length > 0) {
    recommendation = "📅 Upcoming event: " + dashboardEvents[0].title;
}
else {
    recommendation = "💙 You have nothing planned today. Let's create something productive!";
}

const recommendationBox = document.getElementById("aiRecommendation");

if (recommendationBox) {
    recommendationBox.innerHTML = recommendation;
}

generateDailyBriefing();

function updateDashboardStats(){

    const xpData = JSON.parse(localStorage.getItem("xp")) || {
        xp:0,
        level:1
    };

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    const streak = JSON.parse(localStorage.getItem("streak")) || {
        days:0
    };

    if(document.getElementById("xpCount")){
        document.getElementById("xpCount").textContent = xpData.xp;
    }

    if(document.getElementById("levelCount")){
        document.getElementById("levelCount").textContent = xpData.level;
    }

    if(document.getElementById("noteCount")){
        document.getElementById("noteCount").textContent = notes.length;
    }

    const streakBox = document.getElementById("streakCount");

    if(streakBox){

        streakBox.textContent =
            streak.days + " Day" +
            (streak.days === 1 ? "" : "s");

    }

}

updateDashboardStats();
// ================================
// Auto Refresh Dashboard
// ================================

// ================================
// Auto Refresh Dashboard
// ================================

function refreshAllDashboard(){

    refreshDashboard();
    updateAchievement();
    loadNextEvent();
    generateDailyBriefing();
    updateDashboardStats();

}


// Refresh every 5 seconds
const DASHBOARD_REFRESH_INTERVAL = 5000;
setInterval(refreshAllDashboard, DASHBOARD_REFRESH_INTERVAL);
