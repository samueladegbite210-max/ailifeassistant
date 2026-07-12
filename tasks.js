// ==========================
// AI Life Assistant
// Tasks System
// ==========================

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");

// Add a new task
function addTask(){

    const text = taskInput.value.trim();

    if(text === ""){

        alert("Please enter a task.");

        return;

    }

    tasks.push({

        text: text,

        priority: taskPriority.value,

        done: false

    });

    saveTasks();

    taskInput.value = "";

    taskPriority.value = "Medium";

}

// Save tasks
function saveTasks(){

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

}

// Show tasks
function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach((task,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `

        <span onclick="toggleTask(${index})">

        ${task.done ? "✅" : "⬜"}

        ${task.text}

        <small>(${task.priority})</small>

        </span>

        <button class="deleteBtn"
        onclick="deleteTask(${index})">

        🗑️

        </button>

        `;

        taskList.appendChild(li);

    });

}

// Complete task
function toggleTask(index){

    tasks[index].done = !tasks[index].done;

    saveTasks();

}

// Delete task
function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

}

// Load tasks when page opens
renderTasks();
