

// ==========================
// AI Life Assistant - Tasks
// ==========================


let tasks = [];
let tasksLoaded = false;
let tasksLoading = false;
let currentTaskUserId = null;


const taskInput     = document.getElementById("taskInput");
const taskPriority  = document.getElementById("taskPriority");
const taskList      = document.getElementById("taskList");
const searchTask    = document.getElementById("searchTask");


async function loadTasksFromSupabase() {
    if (tasksLoading) return;

    tasksLoading = true;

    try {
        if (!window.supabaseClient) {
            throw new Error("Supabase client is unavailable.");
        }

        const { data: authData, error: authError } =
            await window.supabaseClient.auth.getUser();

        if (authError) throw authError;

        if (!authData.user) {
            throw new Error("Please sign in to load your tasks.");
        }

        currentTaskUserId = authData.user.id;

        const { data, error } = await window.supabaseClient
            .from("tasks")
            .select("task_data")
            .eq("user_id", currentTaskUserId);

        if (error) throw error;

        tasks = (data || []).map(row => row.task_data);

        tasksLoaded = true;

        renderTasks();
        updateTaskSummary();
        updateTaskProgress();

    } catch (error) {
        console.error("Unable to load tasks from Supabase:", error);
        alert("Unable to load your tasks from the database. Please try again.");
    } finally {
        tasksLoading = false;
    }
}


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

async function addTask() {
    if (!tasksLoaded || !currentTaskUserId) {
        alert("Please wait for your tasks to finish loading.");
        return;
    }

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        priority: taskPriority.value,
        done: false
    };

    tasks.push(newTask);

    try {
        await saveTasks();

        createNotification("📝 New task added: " + text);
        taskInput.value = "";
    } catch (error) {
        tasks = tasks.filter(task => task.id !== newTask.id);
        renderTasks();
        updateTaskSummary();
        updateTaskProgress();
    }
}

// ==========================
// Save
// ==========================



async function saveTasks() {
    if (!tasksLoaded || !currentTaskUserId) {
        throw new Error("Your tasks are not loaded yet.");
    }

    try {
        for (const task of tasks) {
            const { data: existing, error: findError } =
                await window.supabaseClient
                    .from("tasks")
                    .select("id, task_data")
                    .eq("user_id", currentTaskUserId);

            if (findError) throw findError;

            const record = existing.find(
                row => String(row.task_data.id) === String(task.id)
            );

            if (record) {
                const { error } = await window.supabaseClient
                    .from("tasks")
                    .update({
                        task_data: {
                            id: task.id,
                            text: task.text,
                            priority: task.priority,
                            done: task.done
                        }
                    })
                    .eq("id", record.id)
                    .eq("user_id", currentTaskUserId);

                if (error) throw error;
            } else {
                const { error } = await window.supabaseClient
                    .from("tasks")
                    .insert({
                        user_id: currentTaskUserId,
                        task_data: {
                            id: task.id,
                            text: task.text,
                            priority: task.priority,
                            done: task.done
                        }
                    });

                if (error) throw error;
            }
        }

        renderTasks();
        updateTaskSummary();
        updateTaskProgress();

    } catch (error) {
        console.error("Unable to save tasks:", error);
        alert("Unable to save your tasks. Please try again.");
        throw error;
    }
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

async function toggleTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) return;

    if (!tasksLoaded || !currentTaskUserId) {
        alert("Please wait for your tasks to finish loading.");
        return;
    }

    const previousDone = task.done;

    task.done = !task.done;

    try {
        await saveTasks();

        if (task.done) {
            createNotification("✅ Task completed: " + task.text);

            if (typeof addXP === "function") {
                addXP(10);
            }
        }
    } catch (error) {
        task.done = previousDone;

        renderTasks();
        updateTaskSummary();
        updateTaskProgress();
    }
}

// ==========================
// Delete Task
// ==========================


async function deleteTask(id) {
    if (!tasksLoaded || !currentTaskUserId) {
        alert("Please wait for your tasks to finish loading.");
        return;
    }

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const { data: rows, error: findError } =
            await window.supabaseClient
                .from("tasks")
                .select("id, task_data")
                .eq("user_id", currentTaskUserId);

        if (findError) throw findError;

        const record = (rows || []).find(
            row => String(row.task_data.id) === String(id)
        );

        if (record) {
            const { error: deleteError } =
                await window.supabaseClient
                    .from("tasks")
                    .delete()
                    .eq("id", record.id)
                    .eq("user_id", currentTaskUserId);

            if (deleteError) throw deleteError;
        }

        tasks = tasks.filter(task => task.id !== id);

        renderTasks();
        updateTaskSummary();
        updateTaskProgress();

        createNotification("🗑️ Task deleted: " + task.text);

    } catch (error) {
        console.error("Unable to delete task:", error);
        alert("Unable to delete the task. Please try again.");
    }
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

async function initializeTasks() {
    await loadTasksFromSupabase();
}

initializeTasks();

 
