// ===============================
// AI Life Assistant Dashboard 3.0
// ===============================

// Welcome Message
const username = localStorage.getItem("username") || "Samuel";

const welcomeText = document.getElementById("welcomeText");

if (welcomeText) {
    welcomeText.textContent = "👋 Welcome Back, " + username;
}

// Today's Date
function updateDate() {
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        todayDate.textContent = new Date().toDateString();
    }
}

// Live Clock
function updateClock() {
    const currentTime = document.getElementById("currentTime");

    if (currentTime) {
        currentTime.textContent =
            new Date().toLocaleTimeString();
    }
}

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
// Tasks
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

renderTasks();

function addTask(){

    const input = document.getElementById("taskInput");

    const priority =
    document.getElementById("taskPriority").value;

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

function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach((task,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
        <span style="cursor:pointer;">
        ${task.done ? "✅" : "⬜"}
        ${task.priority}
        ${task.text}
        </span>

        <button onclick="deleteTask(${index})">
        🗑️
        </button>
        `;

        li.querySelector("span").onclick = function(){

            tasks[index].done =
            !tasks[index].done;

            saveTasks();

        };

        taskList.appendChild(li);

    });

    document.getElementById("taskCount").textContent =
    tasks.length;

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

}
