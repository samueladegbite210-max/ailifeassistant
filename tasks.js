// ==========================
// AI Life Assistant - Tasks
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");

// ==========================
// Notifications
// ==========================
function createNotification(message){

    let notifications =
    JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.unshift({

        id: Date.now(),

        text: message,

        read: false,

        time: new Date().toLocaleString()

    });

    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );

}
// ==========================
// Add Task
// ==========================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        priority: taskPriority.value,
        done: false
    });
createNotification("📝 New task added: " + text);
    taskInput.value = "";

    saveTasks();

}

// ==========================
// Save
// ==========================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
    updateTaskSummary();
    updateTaskProgress();

}

// ==========================
// Render Tasks
// ==========================

function renderTasks() {

    taskList.innerHTML = "";

    const empty = document.getElementById("emptyTasks");

    if (tasks.length === 0) {

        empty.style.display = "block";

        return;

    }

    empty.style.display = "none";

    tasks.forEach(task => {

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

// ==========================
// Complete Task
// ==========================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            if(!task.done){

    task.done = true;

    if(typeof addXP === "function"){

        addXP(10);

    }

    createNotification(
        "✅ Task completed: " + task.text
    );

}else{

    task.done = false;

}

        return task;

    });

    saveTasks();

}

// ==========================
// Delete Task
// ==========================

function deleteTask(id){

    if(!confirm("Delete this task?")) return;

    const deleted =
    tasks.find(task => task.id === id);

    tasks =
    tasks.filter(task => task.id !== id);

    if(deleted){

        createNotification(
            "🗑 Deleted task: " + deleted.text
        );

    }

    saveTasks();

}

// ==========================
// Summary
// ==========================

function updateTaskSummary() {

    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

}

// ==========================
// Progress
// ==========================

function updateTaskProgress() {

    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("taskProgressBar").style.width = percent + "%";

    if (percent === 0) {

        document.getElementById("taskProgressText").textContent =
            "Nothing completed yet.";

    } else {

        document.getElementById("taskProgressText").textContent =
            percent + "% Completed";

    }

}

// ==========================
// Search
// ==========================

if (searchTask) {

    searchTask.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll("#taskList li").forEach(item => {

            item.style.display =
                item.textContent.toLowerCase().includes(value)
                    ? "flex"
                    : "none";

        });

    });

}

// ==========================
// Task Summary for AI
// ==========================

function getTaskSummary() {

    return {

        total: tasks.length,

        completed: tasks.filter(task => task.done).length,

        pending: tasks.filter(task => !task.done).length,

        tasks

    };

}

// ==========================
// Start
// ==========================

function initializeTasks() {

    renderTasks();
    updateTaskSummary();
    updateTaskProgress();

}

initializeTasks();
