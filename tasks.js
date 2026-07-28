// ==========================
// AI Life Assistant - Tasks
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");

// Add Task
function addTask(){

    const text = taskInput.value.trim();

    if(text === ""){

        alert("Please enter a task.");

        return;

    }

    tasks.push({

        id: Date.now(),

        text: text,

        priority: taskPriority.value,

        done: false

    });

    saveTasks();

    taskInput.value = "";

}

// Save Tasks
function saveTasks(){

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    updateTaskSummary();

    updateTaskProgress();

}

// Render Tasks
function renderTasks(){

    taskList.innerHTML = "";

    if(tasks.length === 0){

        taskList.innerHTML = "<p>No tasks yet.</p>";

        return;

    }

    tasks.forEach(task=>{

        const li = document.createElement("li");

        li.innerHTML = `

        <span
        onclick="toggleTask(${task.id})"
        style="
        cursor:pointer;
        text-decoration:${task.done ? "line-through" : "none"};
        ">

        ${task.done ? "✅" : "⬜"}

        ${task.text}

        <small>(${task.priority})</small>

        </span>

        <button
        class="deleteBtn"
        onclick="deleteTask(${task.id})">

        🗑️

        </button>

        `;

        taskList.appendChild(li);

    });

}

// Complete Task
function toggleTask(id){

    tasks = tasks.map(task=>{

        if(task.id === id){

            if(!task.done){

    task.done = true;

    addXP(10);

}

        return task;

    });

    saveTasks();

}

// Delete Task
function deleteTask(id){

    if(!confirm("Delete this task?")) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

}
function updateTaskSummary(){

    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;
    const pending = total - completed;

    const totalBox = document.getElementById("totalTasks");
    const completedBox = document.getElementById("completedTasks");
    const pendingBox = document.getElementById("pendingTasks");

    if(totalBox) totalBox.textContent = total;
    if(completedBox) completedBox.textContent = completed;
    if(pendingBox) pendingBox.textContent = pending;

}
function updateTaskProgress(){

    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const bar =
document.getElementById("taskProgressBar");

if(bar){

    bar.style.width = percent + "%";

}

    document.getElementById("taskProgressText").textContent =
        percent + "% Completed";

}
function getTaskSummary(){

    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;
    const pending = total - completed;

    return {
        total,
        completed,
        pending,
        tasks
    };

}
// Start
renderTasks();
updateTaskSummary();
updateTaskProgress();
