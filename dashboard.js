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
    "Complete your hardest task first.",
    "Take a 5-minute break after every hour of work.",
    "Review your goals every morning.",
    "Finish one task before starting another.",
    "Small daily progress leads to big success.",
    "Stay organized and plan tomorrow before sleeping."
];

const tipText = document.getElementById("tipText");

if (tipText) {

    const day = new Date().getDate();

    tipText.textContent =
    tips[day % tips.length];
// ===============================
// Tasks (Professional Version)
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

renderTasks();

function addTask() {

    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

    tasks.push({
        text: text,
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
                ${task.done ? "✅" : "⬜"} ${task.text}
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

function updateProductivity() {

    const completed = tasks.filter(task => task.done).length;

    const total = tasks.length;

    const score = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("productivityScore").textContent = score + "%";

    document.getElementById("progressBar").style.width = score + "%";

    document.getElementById("progressText").textContent = score + "% Completed";

}
}
// ====================================
// Tasks
// ====================================

const taskList = document.getElementById("taskList");

if(taskList){

    taskList.innerHTML =
    localStorage.getItem("tasks") || "";

    restoreTaskEvents();

updateTaskCount();
updateProductivity();
updateBadge();
updateStatistics();
updateAIMessage();
}

function addTask(){

    const input =
    document.getElementById("taskInput");

    const task =
    input.value.trim();

    if(task === "") return;

    const item =
    document.createElement("li");

    item.innerHTML = `
        <span>⬜ ${task}</span>
        <button class="deleteBtn">🗑️</button>
    `;

    taskList.appendChild(item);

    attachTaskEvents(item);

    input.value = "";

    saveTasks();

}

function attachTaskEvents(item){

    item.querySelector("span").onclick = function(){

        this.textContent =
        this.textContent.startsWith("⬜")
        ? this.textContent.replace("⬜","✅")
        : this.textContent.replace("✅","⬜");

        saveTasks();

    };

    item.querySelector(".deleteBtn").onclick = function(){

        item.remove();

        saveTasks();

    };

}

function restoreTaskEvents(){

    document.querySelectorAll("#taskList li")
    .forEach(function(item){

        attachTaskEvents(item);

    });

}

function saveTasks(){

    localStorage.setItem(
        "tasks",
        taskList.innerHTML
    );

    updateTaskCount();

    updateProductivity();

}

function updateTaskCount(){

    const taskCount =
    document.getElementById("taskCount");

    if(taskCount){

        taskCount.textContent =
        taskList.children.length;

    }

}

function updateProductivity(){

    let completed = 0;

    for(let i=0;i<taskList.children.length;i++){

        if(taskList.children[i].innerHTML.includes("✅")){

            completed++;

        }

    }

    const total =
    taskList.children.length;

    const score =
    total===0
    ?0
    :Math.round((completed/total)*100);

    document.getElementById("productivityScore").textContent =
    score + "%";

    document.getElementById("progressBar").style.width =
    score + "%";

    document.getElementById("progressText").textContent =
    score + "% Completed";

}
// ====================================
// Daily Streak
// ====================================

function updateStreak(){

    const today =
    new Date().toDateString();

    let lastVisit =
    localStorage.getItem("lastVisit");

    let streak =
    Number(localStorage.getItem("streak")) || 0;

    if(lastVisit !== today){

        const yesterday =
        new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        if(lastVisit === yesterday.toDateString()){

            streak++;

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
