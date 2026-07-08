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
