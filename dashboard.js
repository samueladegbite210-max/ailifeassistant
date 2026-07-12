// ==========================
// AI Life Assistant Dashboard
// ==========================

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
// Dashboard Summary
// ==========================

function updateSummary(){

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];

    const completed = tasks.filter(task => task.done).length;

    if(document.getElementById("taskCount")){
        document.getElementById("taskCount").textContent = tasks.length;
    }

    if(document.getElementById("goalCount")){
        document.getElementById("goalCount").textContent = goals.length;
    }

    if(document.getElementById("eventCount")){
        document.getElementById("eventCount").textContent = events.length;
    }

    const score = document.getElementById("productivityScore");

    if(score){

        const percent = tasks.length === 0
            ? 0
            : Math.round((completed / tasks.length) * 100);

        score.textContent = percent + "%";

    }

}

updateSummary();
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
// ==========================
// AI Daily Brief
// ==========================

function loadDailyBrief(){

    const brief = document.getElementById("dailyBrief");

    if(!brief) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];

    let message = "";

    if(tasks.length === 0 && goals.length === 0 && events.length === 0){

        message = `
🎉 Welcome, ${username}!<br><br>

You don't have any tasks, goals or events yet.<br><br>

Start by adding your first task to begin your productive journey. 🚀
`;

    }else{

        message = `
👋 ${username}<br><br>

📋 Tasks: ${tasks.length}<br>

🎯 Goals: ${goals.length}<br>

📅 Events: ${events.length}<br><br>

💪 Keep making progress every day!
`;

    }

    brief.innerHTML = message;

}

loadDailyBrief();
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
// Productivity Score
// ==========================

function updateProductivity(){

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const score = document.getElementById("productivityScore");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    if(!score || !progressBar || !progressText) return;

    if(tasks.length === 0){

        score.textContent = "0%";
        progressBar.style.width = "0%";
        progressText.textContent = "0% Completed";

        return;

    }

    const completed = tasks.filter(task => task.done).length;

    const percent = Math.round((completed / tasks.length) * 100);

    score.textContent = percent + "%";

    progressBar.style.width = percent + "%";

    progressText.textContent =
        completed + " of " + tasks.length + " Tasks Completed";

}

updateProductivity();
// ==========================
// Achievement Badge
// ==========================

function updateAchievement(){

    const badge = document.getElementById("achievementBadge");
    const text = document.getElementById("achievementText");

    if(!badge || !text) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const completed = tasks.filter(task => task.done).length;

    if(completed >= 10){

        badge.textContent = "👑 Productivity Master";
        text.textContent = "Amazing! You completed 10 tasks.";

    }else if(completed >= 5){

        badge.textContent = "🔥 Task Champion";
        text.textContent = "Fantastic! You completed 5 tasks.";

    }else if(completed >= 1){

        badge.textContent = "🌟 First Step";
        text.textContent = "Great job! You completed your first task.";

    }else{

        badge.textContent = "🚀 Ready to Begin";
        text.textContent = "Complete your first task to unlock achievements.";

    }

}

updateAchievement();
// ==========================
// Daily Streak
// ==========================

function updateDailyStreak(){

    const streakCount = document.getElementById("streakCount");
    const streakMessage = document.getElementById("streakMessage");

    if(!streakCount || !streakMessage) return;

    const today = new Date().toDateString();

    let streak = parseInt(localStorage.getItem("dailyStreak")) || 0;
    const lastVisit = localStorage.getItem("lastVisit");

    if(lastVisit !== today){

        streak++;

        localStorage.setItem("dailyStreak", streak);
        localStorage.setItem("lastVisit", today);

    }

    streakCount.textContent = streak + (streak === 1 ? " Day" : " Days");

    if(streak >= 30){

        streakMessage.textContent = "🏆 Incredible! 30-day streak!";

    }else if(streak >= 7){

        streakMessage.textContent = "🔥 Amazing! Keep your streak alive!";

    }else{

        streakMessage.textContent = "💪 Keep opening the app every day!";

    }

}

updateDailyStreak();
// ==========================
// Daily Streak
// ==========================

function updateDailyStreak(){

    const streakCount = document.getElementById("streakCount");
    const streakMessage = document.getElementById("streakMessage");

    if(!streakCount || !streakMessage) return;

    const today = new Date().toDateString();

    let streak = parseInt(localStorage.getItem("dailyStreak")) || 0;
    const lastVisit = localStorage.getItem("lastVisit");

    if(lastVisit !== today){

        streak++;

        localStorage.setItem("dailyStreak", streak);
        localStorage.setItem("lastVisit", today);

    }

    streakCount.textContent = streak + (streak === 1 ? " Day" : " Days");

    if(streak >= 30){

        streakMessage.textContent = "🏆 Incredible! 30-day streak!";

    }else if(streak >= 7){

        streakMessage.textContent = "🔥 Amazing! Keep your streak alive!";

    }else{

        streakMessage.textContent = "💪 Keep opening the app every day!";

    }

}

updateDailyStreak();
function clearNote(){

    if(confirm("Delete this note?")){

        notes.value = "";

        localStorage.removeItem("notes");

        alert("🗑 Note Deleted");

    }

}
document
.getElementById("searchNote")
.addEventListener("input", function(){

    const keyword =
    this.value.toLowerCase();

    const text =
    notes.value.toLowerCase();

    if(keyword.length === 0){

        notes.style.border = "none";

        return;

    }

    if(text.includes(keyword)){

        notes.style.border =
        "3px solid #22C55E";

    }else{

        notes.style.border =
        "3px solid #EF4444";

    }

});

<script>
function sendMessage(){

const input=document.getElementById("userInput");

const chat=document.getElementById("chatBox");

if(input.value.trim()=="") return;

chat.innerHTML +=
"<p><strong>🙂 You:</strong> "+input.value+"</p>";

chat.innerHTML +=
"<p><strong>🤖 AI:</strong> I'm still learning. My full AI brain is coming soon.</p>";

chat.scrollTop=chat.scrollHeight;

input.value="";

}
</script>
