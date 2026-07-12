// ==========================
// AI Life Assistant - Goals
// ==========================

let goals = JSON.parse(localStorage.getItem("goals")) || [];

const goalInput = document.getElementById("goalInput");
const goalList = document.getElementById("goalList");

// Add Goal
function addGoal(){

    const text = goalInput.value.trim();

    if(text === ""){

        alert("Please enter a goal.");

        return;

    }

    goals.push({

        id: Date.now(),

        text: text,

        done: false

    });

    saveGoals();

    goalInput.value = "";

}

// Save Goals
function saveGoals(){

    localStorage.setItem("goals", JSON.stringify(goals));

    renderGoals();

}

// Render Goals
function renderGoals(){

    goalList.innerHTML = "";

    if(goals.length === 0){

        goalList.innerHTML = "<p>No goals yet.</p>";

        return;

    }

    goals.forEach(goal=>{

        const li = document.createElement("li");

        li.innerHTML = `

        <span
        onclick="toggleGoal(${goal.id})"
        style="
        cursor:pointer;
        text-decoration:${goal.done ? "line-through" : "none"};
        ">

        ${goal.done ? "🎯✅" : "🎯"}

        ${goal.text}

        </span>

        <button
        class="deleteBtn"
        onclick="deleteGoal(${goal.id})">

        🗑️

        </button>

        `;

        goalList.appendChild(li);

    });

}

// Complete Goal
function toggleGoal(id){

    goals = goals.map(goal=>{

        if(goal.id === id){

            goal.done = !goal.done;

        }

        return goal;

    });

    saveGoals();

}

// Delete Goal
function deleteGoal(id){

    goals = goals.filter(goal=>goal.id !== id);

    saveGoals();

}

// Start
renderGoals();
