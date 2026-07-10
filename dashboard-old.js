// ====================================
// AI Life Assistant Dashboard
// dashboard.js
// ====================================

// Welcome Message
const username = localStorage.getItem("username") || "Samuel";

const welcomeText = document.getElementById("welcomeText");

if (welcomeText) {
    welcomeText.textContent = "👋 Welcome Back, " + username;
}

// Today's Date
const todayDate = document.getElementById("todayDate");

if (todayDate) {
    todayDate.textContent = new Date().toDateString();
}

// Live Clock
function updateClock() {

    const currentTime = document.getElementById("currentTime");

    if (currentTime) {
        currentTime.textContent =
        new Date().toLocaleTimeString();
    }

}

updateClock();

setInterval(updateClock, 1000);

// AI Tip of the Day
const tips = [
    "💪 Complete your hardest task first.",
    "📚 Learn something new every day.",
    "🎯 Focus on one task at a time.",
    "💧 Don't forget to drink water.",
    "😴 Get enough sleep to stay productive.",
    "🚀 Small progress every day leads to big success.",
    "🧠 Plan your day before you start working."
];

function updateAITip() {

    const tipText = document.getElementById("tipText");

    if (!tipText) return;

    const day = new Date().getDate();

    tipText.textContent = tips[day % tips.length];

}

const tipText = document.getElementById("tipText");

if (tipText) {

    const day = new Date().getDate();

    tipText.textContent =
    tips[day % tips.length];


}
// ===============================
// Tasks (Professional Version)
// ===============================
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

renderTasks();

function addTask() {

    const input = document.getElementById("taskInput");
    const priority = document.getElementById("taskPriority").value;

    const text = input.value.trim();

    if(text === "") return;

    tasks.push({
        text: text,
        priority: priority,
        done: false
    });

    input.value = "";

    saveTasks();

}
    

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const item = document.createElement("li");

        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.marginBottom = "10px";

        item.innerHTML = `
            <span style="cursor:pointer;">
                ${task.done ? "✅" : "⬜"} ${task.priority} ${task.text}
            </span>

            <button onclick="deleteTask(${index})">🗑️</button>
        `;

        item.querySelector("span").onclick = function () {

            tasks[index].done = !tasks[index].done;

            saveTasks();

        };

        taskList.appendChild(item);

    });

    updateTaskCount();
    updateProductivity();
}

function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

}

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

}

function updateTaskCount() {

    document.getElementById("taskCount").textContent = tasks.length;

}

function updateProductivity(){

    const completed = tasks.filter(task => task.done).length;

    const total = tasks.length;

    const score = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("productivityScore").textContent =
        score + "%";

    document.getElementById("progressBar").style.width =
        score + "%";

    document.getElementById("progressText").textContent =
        score + "% Completed";

    updateAchievement();

    
}
// ====================================
// Daily Streak
// ====================================
function updateStreak(){

    const today = new Date().toDateString();

    const lastVisit =
    localStorage.getItem("lastVisit");

    let streak =
    Number(localStorage.getItem("streak")) || 0;

    if(lastVisit !== today){

        if(lastVisit){

            const yesterday = new Date();

            yesterday.setDate(
                yesterday.getDate() - 1
            );

            if(lastVisit === yesterday.toDateString()){

                streak++;

            }else{

                streak = 1;

            }

        }else{

            streak = 1;

        }

        localStorage.setItem("streak", streak);
        localStorage.setItem("lastVisit", today);

    }

    document.getElementById("streakCount").textContent =
    streak + " Day" + (streak > 1 ? "s" : "");

}

// ==========================
// Initialize Dashboard
// ==========================

renderTasks();
renderGoals();

updateDate();
updateClock();
updateStreak();
updateAchievement();
updateTaskCount();
updateGoalCount();
updateProductivity();
updateAITip();


// ====================================
// Dashboard Statistics
// ====================================

function updateStatistics(){

    const notes =
    localStorage.getItem("notes") || "";

    const goals =
    localStorage.getItem("goals") || "";

    const events =
    localStorage.getItem("events") || "";

    document.getElementById("statsNotes").textContent =
    notes.trim() === "" ? 0 : 1;

    document.getElementById("statsGoals").textContent =
    (goals.match(/class="goal"/g) || []).length;

    document.getElementById("statsEvents").textContent =
    (events.match(/class="event"/g) || []).length;

    document.getElementById("statsTasks").textContent =
    taskList.children.length;

}

updateStatistics();
// ====================================
// Smart AI Dashboard Assistant
// ====================================

function updateAIMessage(){

    const taskCount = taskList.children.length;

    const goalCount =
    (localStorage.getItem("goals") || "")
    .split('class="goal"').length - 1;

    const eventCount =
    (localStorage.getItem("events") || "")
    .split('class="event"').length - 1;

    let message = "";

    if(taskCount === 0){

        message =
        "📝 You haven't added any tasks today. Start with one small task!";

    }else if(taskCount < 3){

        message =
        "💪 Nice start! Add a few more tasks to stay productive.";

    }else if(taskCount >= 3){

        message =
        "🚀 Great job! You're building a productive day.";

    }

    if(goalCount === 0){

        message +=
        "<br><br>🎯 Don't forget to create a goal.";

    }

    if(eventCount > 0){

        message +=
        "<br><br>📅 You have " +
        eventCount +
        " event(s) scheduled.";

    }

    document.getElementById("aiMessage").innerHTML =
    message;

}

updateAIMessage();
    // ==========================
// Daily Streak
// ==========================

function updateStreak(){

    const today = new Date().toDateString();

    const lastVisit =
    localStorage.getItem("lastVisit");

    let streak =
    Number(localStorage.getItem("streak")) || 0;

    if(lastVisit !== today){

        if(lastVisit){

            const yesterday = new Date();

            yesterday.setDate(
                yesterday.getDate() - 1
            );

            if(lastVisit === yesterday.toDateString()){

                streak++;

            }else{

                streak = 1;

            }

        }else{

            streak = 1;

        }

        localStorage.setItem("streak", streak);
        localStorage.setItem("lastVisit", today);

    }

    document.getElementById("streakCount").textContent =
    streak + " Day" + (streak > 1 ? "s" : "");

}

updateStreak();
    // ==========================
// Achievement Badge
// ==========================

function updateAchievement(){

    const completed =
    tasks.filter(task => task.done).length;

    let badge = "🌱 Beginner";
    let text = "Complete your first task.";

    if(completed >= 100){

        badge = "👑 Productivity Master";
        text = "Amazing dedication!";

    }else if(completed >= 50){

        badge = "🥇 Gold";
        text = "50 tasks completed.";

    }else if(completed >= 25){

        badge = "🥈 Silver";
        text = "25 tasks completed.";

    }else if(completed >= 10){

        badge = "🥉 Bronze";
        text = "10 tasks completed.";

    }

    document.getElementById("achievementBadge").textContent =
    badge;

    document.getElementById("achievementText").textContent =
    text;

}
// ==========================
// Goals
// ==========================
alert("Goals loaded");
let goals = JSON.parse(localStorage.getItem("goals")) || [];

const goalList = document.getElementById("goalList");

renderGoals();

function addGoal(){

    

    const input = document.getElementById("goalInput");

    const text = input.value.trim();

    if(text === ""){
        alert("Input is empty");
        return;
    }

    goals.push({
        text: text,
        done: false
    });

    input.value = "";

    saveGoals();

    


}

function renderGoals(){

    goalList.innerHTML = "";

    goals.forEach((goal,index)=>{

        const li = document.createElement("li");

        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "10px";

        li.innerHTML = `
            <span style="cursor:pointer;">
                ${goal.done ? "✅" : "🎯"} ${goal.text}
            </span>

            <div>
                <button onclick="editGoal(${index})">✏️</button>
                <button onclick="deleteGoal(${index})">🗑️</button>
            </div>
        `;

        li.querySelector("span").onclick = function(){

            goals[index].done = !goals[index].done;

            saveGoals();

        };

        goalList.appendChild(li);

    });

    updateGoalCount();

}
   function editGoal(index){

    const newGoal = prompt(
        "Edit Goal:",
        goals[index].text
    );

    if(newGoal === null) return;

    if(newGoal.trim() === "") return;

    goals[index].text = newGoal.trim();

    saveGoals();

}

function deleteGoal(index){

    goals.splice(index,1);

    saveGoals();

}

function saveGoals(){

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );

    renderGoals();

}

function updateGoalCount(){

    document.getElementById("goalCount").textContent =
    goals.length;

} 
    
const eventList = document.getElementById("eventList");

let events = JSON.parse(localStorage.getItem("events")) || [];

renderEvents();

function addEvent() {

    const title = document.getElementById("eventTitle").value.trim();
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const location = document.getElementById("eventLocation").value.trim();
    const notes = document.getElementById("eventNotes").value.trim();
    const reminder = document.getElementById("eventReminder").value;
    const repeat = document.getElementById("eventRepeat").value;

    if (title === "" || date === "") {
        alert("Please enter an event title and date.");
        return;
    }

    events.push({
        title,
        date,
        time,
        location,
        notes,
        reminder,
        repeat
    });

    localStorage.setItem("events", JSON.stringify(events));

    renderEvents();

    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventNotes").value = "";
    document.getElementById("eventReminder").value = "none";
    document.getElementById("eventRepeat").value = "none";
}

function renderEvents() {

    eventList.innerHTML = "";

    events.forEach((event) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${event.title}</strong><br>
            📅 ${event.date}
            ${event.time ? "🕒 " + event.time : ""}<br>
            ${event.location ? "📍 " + event.location + "<br>" : ""}
        `;

        eventList.appendChild(li);

    });

}
