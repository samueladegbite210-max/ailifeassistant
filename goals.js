// ==========================
// AI Life Assistant - Goals
// ==========================

let goals = JSON.parse(localStorage.getItem("goals")) || [];

const goalTitle = document.getElementById("goalTitle");
const goalDescription = document.getElementById("goalDescription");
const goalDeadline = document.getElementById("goalDeadline");
const goalCategory = document.getElementById("goalCategory");

const goalList = document.getElementById("goalList");
// Add Goal
function saveGoal(){

    const title = goalTitle.value.trim();
    const description = goalDescription.value.trim();
    const deadline = goalDeadline.value;
    const category = goalCategory.value;

    if(title === ""){

        alert("Please enter a goal title.");

        return;

    }

    goals.push({

        id: Date.now(),

        title: title,

        description: description,

        deadline: deadline,

        category: category,

        done: false

    });

    saveGoals();

    goalTitle.value = "";
    goalDescription.value = "";
    goalDeadline.value = "";
    goalCategory.value = "Personal";

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

        updateGoalSummary();

        return;

    }

    goals.forEach(function(goal){

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <h3>${goal.done ? "✅" : "🎯"} ${goal.title}</h3>

        ${goal.description ? `<p>${goal.description}</p>` : ""}

        ${goal.category ? `<p>📂 ${goal.category}</p>` : ""}

        ${goal.deadline ? `<p>📅 ${goal.deadline}</p>` : ""}

        <button onclick="toggleGoal(${goal.id})">

            ${goal.done ? "↩ Mark Pending" : "✅ Complete"}

        </button>

        <button onclick="deleteGoal(${goal.id})">

            🗑 Delete

        </button>

        `;

        goalList.appendChild(card);

    });

    updateGoalSummary();

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
function updateGoalSummary(){

    const total = goals.length;

    const completed = goals.filter(goal => goal.done).length;

    const pending = total - completed;

    document.getElementById("totalGoals").textContent = total;

    document.getElementById("completedGoals").textContent = completed;

    document.getElementById("pendingGoals").textContent = pending;

}

// Start
renderGoals();
