// ===============================
// AI Life Assistant Dashboard 3.0
// ===============================
// ==========================
// USER INFORMATION
// ==========================

// Default user name

let username = localStorage.getItem("profileName") || "Samuel";

// Load saved tasks

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load saved goals

let goals = JSON.parse(localStorage.getItem("goals")) || [];

// Load saved events

let events = JSON.parse(localStorage.getItem("events")) || [];
// Welcome Message
const username = localStorage.getItem("username") || "Samuel";

const welcomeText = document.getElementById("welcomeText");

if (welcomeText) {
    welcomeText.textContent = "👋 Welcome Back, " + username;
}
// ==========================
// DATE & TIME
// ==========================

function updateDateTime(){

    const now = new Date();

    const dateElement = document.getElementById("todayDate");

    const timeElement = document.getElementById("currentTime");

    if(dateElement){

        dateElement.textContent =
        now.toDateString();

    }

    if(timeElement){

        timeElement.textContent =
        now.toLocaleTimeString([],{

            hour:"2-digit",

            minute:"2-digit"

        });

    }

}

updateDateTime();

setInterval(updateDateTime,1000);
// Today's Date
function updateDate() {
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        todayDate.textContent = new Date().toDateString();
    }
}

// Live Clock
function updateClock(){

    const now = new Date();

    document.getElementById("todayDate").textContent =
        now.toDateString();

    document.getElementById("currentTime").textContent =
        now.toLocaleTimeString();

}

updateClock();

setInterval(updateClock,1000);

// AI Tip
const tips = [
    "💪 Complete your hardest task first.",
    "📚 Learn something new every day.",
    "🎯 Focus on one task at a time.",
    "💧 Drink enough water.",
    "😴 Get enough sleep.",
    "🚀 Small progress every day leads to big success.",
    "🧠 Plan tomorrow today."
];

function updateTip() {

    const tipText = document.getElementById("tipText");

    if (!tipText) return;

    const day = new Date().getDate();

    tipText.textContent =
        tips[day % tips.length];
}

// Start Everything
updateDate();
updateClock();
updateTip();

setInterval(updateClock, 1000);


// ==========================
// TASKS
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

function addTask(){

    const input = document.getElementById("taskInput");

    const priority = document.getElementById("taskPriority");

    const text = input.value.trim();

    if(text === ""){

        alert("Please enter a task.");

        return;

    }

    tasks.push({

        text:text,

        priority:priority.value,

        done:false

    });

    input.value="";

    priority.value="Medium";

    saveTasks();

}

function renderTasks(){

    if(!taskList) return;

    taskList.innerHTML="";

    tasks.forEach((task,index)=>{

        const li=document.createElement("li");

        li.innerHTML=`

        <span style="cursor:pointer;">

        ${task.done ? "✅" : "⬜"}

        ${task.text}

        <small>

        (${task.priority})

        </small>

        </span>

        <button class="deleteBtn"

        onclick="deleteTask(${index})">

        🗑️

        </button>

        `;

        li.querySelector("span").onclick=function(){

            tasks[index].done=!tasks[index].done;

            saveTasks();

        };

        taskList.appendChild(li);

    });

    updateProductivity();

}

function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

}

function saveTasks(){

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

    renderTasks();

    updateAssistant();

    loadDailyBrief();

    loadNotifications();

    loadProfileStats();

}


}
// ==========================
// Productivity
// ==========================

function updateProductivity(){

    const completed =
    tasks.filter(task => task.done).length;

    const total = tasks.length;

    const score =
    total === 0
    ? 0
    : Math.round((completed / total) * 100);

    const scoreElement =
    document.getElementById("productivityScore");

    if(scoreElement){

        scoreElement.textContent =
        score + "%";

    }

    const progressBar =
    document.getElementById("progressBar");

    if(progressBar){

        progressBar.style.width =
        score + "%";

    }

    const progressText =
    document.getElementById("progressText");

    if(progressText){

        progressText.textContent =
        score + "% Completed";

    }

}
// ==========================
// Goals
// ==========================

let goals = JSON.parse(localStorage.getItem("goals")) || [];

const goalList = document.getElementById("goalList");

renderGoals();

function addGoal() {

    const input = document.getElementById("goalInput");

    const text = input.value.trim();

    if (text === "") return;

    goals.push({
        text: text,
        done: false
    });

    input.value = "";

    saveGoals();

}

function renderGoals() {

    if (!goalList) return;

    goalList.innerHTML = "";

    goals.forEach((goal, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span style="cursor:pointer;">
                ${goal.done ? "✅" : "🎯"} ${goal.text}
            </span>

            <button onclick="deleteGoal(${index})">🗑️</button>
        `;

        li.querySelector("span").onclick = function () {

            goals[index].done = !goals[index].done;

            saveGoals();

        };

        goalList.appendChild(li);

    });

    updateGoalCount();

}

function deleteGoal(index) {

    goals.splice(index, 1);

    saveGoals();

}

function saveGoals() {

    localStorage.setItem("goals", JSON.stringify(goals));

    renderGoals();

}

function updateGoalCount() {

    const goalCount = document.getElementById("goalCount");

    if (goalCount) {

        goalCount.textContent = goals.length;

    }

}

// ==========================
// Daily Streak
// ==========================

function updateStreak() {

    const today = new Date().toDateString();

    let streak = Number(localStorage.getItem("streak")) || 0;

    let lastVisit = localStorage.getItem("lastVisit");

    if (lastVisit !== today) {

        streak++;

        localStorage.setItem("streak", streak);

        localStorage.setItem("lastVisit", today);

    }

    const streakElement =
        document.getElementById("streakCount");

    if (streakElement) {

        streakElement.textContent =
            streak + " Day" + (streak === 1 ? "" : "s");

    }

}

updateStreak();
// ==========================
// Smart AI Assistant
// ==========================

// ==========================
// GREETING
// ==========================

function getGreeting(){

    const hour = new Date().getHours();

    if(hour >= 5 && hour < 12){

        return "🌅 Good Morning";

    }

    if(hour >= 12 && hour < 17){

        return "☀️ Good Afternoon";

    }

    if(hour >= 17 && hour < 21){

        return "🌇 Good Evening";

    }

    return "🌙 Good Night";



}
    const completed = tasks.filter(task => task.done).length;
const total = tasks.length;

const events = JSON.parse(localStorage.getItem("events")) || [];
const pendingTasks = total - completed;

const assistant = document.getElementById("assistantMessage");

if (assistant) {

    assistant.innerHTML = `
        <b>${greeting}, ${username}!</b><br><br>

        📅 ${events.length} Upcoming Event(s)<br>

        ✅ ${pendingTasks} Pending Task(s)<br>

        🎯 ${goals.length} Goal(s)<br><br>

        const tips = [

"💪 Start with your most important task.",

"📅 Review your calendar before starting work.",

"⏰ Finish one task completely before beginning another.",

"💧 Remember to drink water and take short breaks.",

"🎯 Small progress every day leads to big success.",

"📚 Learn something new today.",

"🚀 Stay focused. You're building something amazing!"

];

const today = new Date().getDate();

const todayTip = tips[today % tips.length];
    `;


    }

}

updateAssistant();
// ==========================
// Events
// ==========================

function renderEvents() {

    const eventList = document.getElementById("eventList");

    if (!eventList) return;

    const events = JSON.parse(localStorage.getItem("events")) || [];

    eventList.innerHTML = "";

    events.forEach((event) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${event.title}</strong><br>
            📅 ${event.date}
            ${event.time ? "<br>🕒 " + event.time : ""}
        `;

        eventList.appendChild(li);

    });

    const eventCount = document.getElementById("eventCount");

    if (eventCount) {

        eventCount.textContent = events.length;

    }

}

renderEvents();
// ==========================
// Sidebar Menu
// ==========================

function openMenu() {
    document.getElementById("sideMenu").style.left = "0";
}

function closeMenu() {
    document.getElementById("sideMenu").style.left = "-280px";
}
const sideMenu = document.getElementById("sideMenu");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");

menuBtn.onclick = function () {
    sideMenu.classList.add("active");
};

closeBtn.onclick = function () {
    sideMenu.classList.remove("active");
};
// ==========================
// Next Event
// ==========================

function loadNextEvent(){

    const nextEvent = document.getElementById("nextEvent");

    if(!nextEvent) return;

    const events = JSON.parse(localStorage.getItem("events")) || [];

    if(events.length === 0){

        nextEvent.innerHTML = "<p>No upcoming events.</p>";

        return;

    }

    events.sort((a,b)=> new Date(a.date) - new Date(b.date));

    const event = events[0];

    nextEvent.innerHTML = `
        <h2>${event.title}</h2>

        <p>📅 ${event.date}</p>

        ${event.time ? `<p>🕒 ${event.time}</p>` : ""}

        ${event.location ? `<p>📍 ${event.location}</p>` : ""}
    `;

}

loadNextEvent();
// ==========================
// Profile Statistics
// ==========================

function loadProfileStats(){

    const taskCountProfile =
    document.getElementById("taskCountProfile");

    if(taskCountProfile){

        taskCountProfile.textContent = tasks.length;

    }

    const goalCountProfile =
    document.getElementById("goalCountProfile");

    if(goalCountProfile){

        goalCountProfile.textContent = goals.length;

    }

    const eventCountProfile =
    document.getElementById("eventCountProfile");

    if(eventCountProfile){

        const events =
        JSON.parse(localStorage.getItem("events")) || [];

        eventCountProfile.textContent = events.length;

    }

    const streakProfile =
    document.getElementById("streakProfile");

    if(streakProfile){

        streakProfile.textContent =
        (localStorage.getItem("streak") || 0) + " Days";

    }

    const productivityProfile =
    document.getElementById("productivityProfile");

    if(productivityProfile){

        const completed =
        tasks.filter(task => task.done).length;

        const score =
        tasks.length === 0
        ? 0
        : Math.round((completed/tasks.length)*100);

        productivityProfile.textContent =
        score + "%";

    }

}

loadProfileStats();
// ==========================
// Profile
// ==========================

function loadProfile() {

    const savedName = localStorage.getItem("profileName");

    if (savedName) {
        document.getElementById("profileName").value = savedName;
    }

}

function saveProfile() {

    const name = document.getElementById("profileName").value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    localStorage.setItem("profileName", name);

    alert("✅ Profile saved successfully!");

}

loadProfile();
// ==========================
// Settings
// ==========================

function toggleTheme(){

    document.body.classList.toggle("light-mode");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light-mode")
    );

}

window.onload = function(){

    if(localStorage.getItem("theme") === "true"){

        document.body.classList.add("light-mode");

    }

};

function backupData(){

    alert("🚀 Backup feature coming soon!");

}
// ==========================
// Notifications
// ==========================

function loadNotifications(){

    const box = document.getElementById("notificationBox");

    if(!box) return;

    const events = JSON.parse(localStorage.getItem("events")) || [];

    const tasksDue = tasks.filter(task => !task.done);

    let html = "";

    if(tasksDue.length > 0){

        html += `<p>✅ You have <strong>${tasksDue.length}</strong> unfinished task(s).</p>`;

    }

    if(events.length > 0){

        html += `<p>📅 You have <strong>${events.length}</strong> upcoming event(s).</p>`;

    }

    if(html === ""){

        html = "<p>🎉 You're all caught up!</p>";

    }

    box.innerHTML = html;
    

}

loadNotifications();
// ==========================
// AI Daily Brief
// ==========================

function loadDailyBrief(){

    const brief = document.getElementById("dailyBrief");

    if(!brief) return;

    const events = JSON.parse(localStorage.getItem("events")) || [];

    const pendingTasks = tasks.filter(task => !task.done).length;

    const completedTasks = tasks.filter(task => task.done).length;

    const tips = [

        "💪 Start with your most important task.",

        "📅 Review your calendar before starting work.",

        "⏰ Finish one task completely before beginning another.",

        "💧 Remember to drink water and take short breaks.",

        "🎯 Small progress every day leads to big success.",

        "📚 Learn something new today.",

        "🚀 Stay focused. You're building something amazing!"

    ];

    const today = new Date().getDate();

    const todayTip = tips[today % tips.length];

    let message = "";

    if(events.length === 0 && pendingTasks === 0){

        message = `
            🎉 Amazing! You have no pending tasks or events today.<br><br>

            💡 <b>Today's AI Advice:</b><br>

            ${todayTip}
        `;

    }else{

        message = `
            📅 Upcoming Events: <b>${events.length}</b><br>

            ✅ Pending Tasks: <b>${pendingTasks}</b><br>

            🎯 Completed Tasks: <b>${completedTasks}</b><br><br>

            💡 <b>Today's AI Advice:</b><br>

            ${todayTip}
        `;

    }

    brief.innerHTML = message;

}

loadDailyBrief();
