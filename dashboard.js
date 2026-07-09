// ==========================
// AI Life Assistant Dashboard
// Version 2.0
// ==========================

// Welcome Message
const username = localStorage.getItem("username") || "Samuel";

const welcomeText = document.getElementById("welcomeText");

if (welcomeText) {
    welcomeText.textContent = "👋 Welcome Back, " + username;
}

// ==========================
// Live Date
// ==========================

function updateDate() {

    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        todayDate.textContent = new Date().toDateString();
    }

}

// ==========================
// Live Time
// ==========================

function updateClock() {

    const currentTime = document.getElementById("currentTime");

    if (currentTime) {
        currentTime.textContent = new Date().toLocaleTimeString();
    }

}

// ==========================
// AI Tip
// ==========================

const tips = [

    "💪 Complete your hardest task first.",

    "📚 Learn something new every day.",

    "🎯 Focus on one task at a time.",

    "💧 Drink more water today.",

    "😴 Sleep well to stay productive.",

    "🚀 Small progress every day leads to big success.",

    "🧠 Plan your day before you start."

];

function updateAITip() {

    const tipText = document.getElementById("tipText");

    if (!tipText) return;

    const day = new Date().getDate();

    tipText.textContent = tips[day % tips.length];

}

// ==========================
// Start Dashboard
// ==========================

updateDate();
updateClock();
updateAITip();

setInterval(updateClock, 1000);// ==========================
// Tasks
// ==========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

function renderTasks(){

    if(!taskList) return;

    taskList.innerHTML = "";

    tasks.forEach((task,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
            <span style="cursor:pointer;">
                ${task.done ? "✅" : "⬜"} ${task.text}
            </span>

            <button onclick="deleteTask(${index})">
                🗑️
            </button>
        `;

        li.querySelector("span").onclick = function(){

            tasks[index].done = !tasks[index].done;

            saveTasks();

        };

        taskList.appendChild(li);

    });

    updateTaskCount();

    updateProductivity();

}

function addTask(){

    const input = document.getElementById("taskInput");

    if(!input) return;

    const text = input.value.trim();

    if(text==="") return;

    tasks.push({

        text:text,

        done:false

    });

    input.value="";

    saveTasks();

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

function updateTaskCount(){

    const counter = document.getElementById("taskCount");

    if(counter){

        counter.textContent = tasks.length;

    }

}

function updateProductivity(){

    const completed = tasks.filter(

        task=>task.done

    ).length;

    const total = tasks.length;

    const score =

    total===0

    ?0

    :Math.round((completed/total)*100);

    document.getElementById(

        "productivityScore"

    ).textContent = score+"%";

    document.getElementById(

        "progressBar"

    ).style.width = score+"%";

    document.getElementById(

        "progressText"

    ).textContent =

        score+"% Completed";

}

// ==========================
// Goals
// ==========================

let goals = JSON.parse(localStorage.getItem("goals")) || [];

const goalList = document.getElementById("goalList");

function renderGoals(){

    if(!goalList) return;

    goalList.innerHTML = "";

    goals.forEach((goal,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
            <span style="cursor:pointer;">
                ${goal.done ? "✅" : "🎯"} ${goal.text}
            </span>

            <button onclick="deleteGoal(${index})">
                🗑️
            </button>
        `;

        li.querySelector("span").onclick = function(){

            goals[index].done = !goals[index].done;

            saveGoals();

        };

        goalList.appendChild(li);

    });

    updateGoalCount();

}

function addGoal(){

    const input = document.getElementById("goalInput");

    if(!input) return;

    const text = input.value.trim();

    if(text==="") return;

    goals.push({

        text:text,

        done:false

    });

    input.value="";

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

    const counter = document.getElementById("goalCount");

    if(counter){

        counter.textContent = goals.length;

    }

}
// ==========================
// Start Dashboard
// ==========================

updateDate();
updateClock();
updateAITip();

renderTasks();
renderGoals();

setInterval(updateClock,1000);
