

// ==========================
// AI Life Assistant - Tasks
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput     = document.getElementById("taskInput");
const taskPriority  = document.getElementById("taskPriority");
const taskList      = document.getElementById("taskList");
const searchTask    = document.getElementById("searchTask");

// ==========================
// Notifications
// ==========================
function createNotification(message) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.unshift({
        id: Date.now(),
        text: message,
        read: false,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));
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
        if (empty) empty.style.display = "block";
        return;
    }

    if (empty) empty.style.display = "none";

    tasks.forEach(task => {
        const li = document.createElement("li");

        // Safer than raw innerHTML for user-entered text
        const span = document.createElement("span");
        span.style.cursor = "pointer";
        span.style.textDecoration = task.done ? "line-through" : "none";
        span.onclick = () => toggleTask(task.id);
        span.innerHTML = `
            ${task.done ? "✅" : "⬜"}
            ${escapeHtml(task.text)}
            <small>(${escapeHtml(task.priority)})</small>
        `;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "deleteBtn";
        deleteBtn.textContent = "🗑️";
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Simple HTML-escape helper (prevents XSS from task text)
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================
// Complete / Uncomplete Task
// ==========================
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            if (!task.done) {
                task.done = true;

                if (typeof addXP === "function") {
                    addXP(10);
                }

                createNotification("✅ Task completed: " + task.text);
            } else {
                task.done = false;
            }
        }
        return task;          // ← always return the task
    });

    saveTasks();
}

// ==========================
// Delete Task
// ==========================
function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    const deleted = tasks.find(task => task.id === id);

    tasks = tasks.filter(task => task.id !== id);

    if (deleted) {
        createNotification("🗑 Deleted task: " + deleted.text);
    }

    saveTasks();
}

// ==========================
// Summary
// ==========================
function updateTaskSummary() {
    const total     = tasks.length;
    const completed = tasks.filter(task => task.done).length;
    const pending   = total - completed;

    const totalEl     = document.getElementById("totalTasks");
    const completedEl = document.getElementById("completedTasks");
    const pendingEl   = document.getElementById("pendingTasks");

    if (totalEl)     totalEl.textContent     = total;
    if (completedEl) completedEl.textContent = completed;
    if (pendingEl)   pendingEl.textContent   = pending;
}

// ==========================
// Progress
// ==========================
function updateTaskProgress() {
    const total     = tasks.length;
    const completed = tasks.filter(task => task.done).length;
    const percent   = total === 0 ? 0 : Math.round((completed / total) * 100);

    const bar  = document.getElementById("taskProgressBar");
    const text = document.getElementById("taskProgressText");

    if (bar)  bar.style.width = percent + "%";
    if (text) {
        text.textContent = percent === 0
            ? "Nothing completed yet."
            : percent + "% Completed";
    }
}

// ==========================
// Search
// ==========================
if (searchTask) {
    searchTask.addEventListener("input", function () {
        const value = this.value.toLowerCase();

        document.querySelectorAll("#taskList li").forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(value)
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
        total:     tasks.length,
        completed: tasks.filter(task => task.done).length,
        pending:   tasks.filter(task => !task.done).length,
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
