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

    localStorage.setItem(

        "goals",

        JSON.stringify(goals)

    );

    renderGoals();

    updateGoalSummary();

    updateGoalProgress();
   refreshNotifications();
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

        <h3>${goal.done ? "✅" : "🎯"} ${goal.title || goal.text}</h3>

        ${goal.description ? `<p>${goal.description}</p>` : ""}

        ${goal.category ? `<p>📂 ${goal.category}</p>` : ""}

        ${goal.deadline ? `<p>📅 ${goal.deadline}</p>` : ""}

    

<button onclick="editGoal(${goal.id})">
✏️ Edit
</button>

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

            if(!goal.done){

                goal.done = true;

                if(typeof addXP === "function"){

                    addXP(20);

                }

                if(typeof addNotification === "function"){

                    addNotification(
                        `🎯 Goal Completed: ${goal.title}`,
                        "Achievement"
                    );

                }

            }else{

                goal.done = false;

            }

        }

        return goal;

    });

    saveGoals();

}
refreshNotifications();

// Delete Goal
function deleteGoal(id){

    if(!confirm("Delete this goal?")) return;

    goals = goals.filter(goal => goal.id !== id);

    saveGoals();



}
refreshNotifications();
function updateGoalSummary(){

    const total = goals.length;
    const completed = goals.filter(goal => goal.done).length;
    const pending = total - completed;

    const totalBox = document.getElementById("totalGoals");
    const completedBox = document.getElementById("completedGoals");
    const pendingBox = document.getElementById("pendingGoals");

    if(totalBox) totalBox.textContent = total;
    if(completedBox) completedBox.textContent = completed;
    if(pendingBox) pendingBox.textContent = pending;

}
// ==========================
// Edit Goal
// ==========================

function editGoal(id){

    const goal = goals.find(g => g.id === id);

    if(!goal) return;

    goalTitle.value = goal.title;
    goalDescription.value = goal.description;
    goalDeadline.value = goal.deadline;
    goalCategory.value = goal.category;

    goals = goals.filter(g => g.id !== id);

    saveGoals();

}
// ==========================
// Search Goals
// ==========================

document.getElementById("searchGoal").addEventListener("input", function(){

    const keyword = this.value.toLowerCase().trim();

    if(keyword === ""){
        renderGoals();
        return;
    }

    goalList.innerHTML = "";

    goals
    .filter(function(goal){

        return (

            (goal.title || "").toLowerCase().includes(keyword) ||

            (goal.description || "").toLowerCase().includes(keyword) ||

            (goal.category || "").toLowerCase().includes(keyword)

        );

    })

    .forEach(function(goal){

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <h3>${goal.done ? "✅" : "🎯"} ${goal.title || goal.text}</h3>

        ${goal.description ? `<p>${goal.description}</p>` : ""}

        ${goal.category ? `<p>📂 ${goal.category}</p>` : ""}

        ${goal.deadline ? `<p>📅 ${goal.deadline}</p>` : ""}

        <button onclick="editGoal(${goal.id})">
✏️ Edit
</button>

<button onclick="toggleGoal(${goal.id})">
${goal.done ? "↩ Mark Pending" : "✅ Complete"}
</button>

<button onclick="deleteGoal(${goal.id})">
🗑 Delete
</button>

        `;

        goalList.appendChild(card);

    });

    if(goalList.innerHTML === ""){

        goalList.innerHTML = "<p>❌ No matching goals found.</p>";

    }

});
// ==========================
// Goal Progress
// ==========================

function updateGoalProgress(){

    const total = goals.length;

    const completed = goals.filter(goal => goal.done).length;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const bar = document.getElementById("goalProgressBar");
    const text = document.getElementById("goalProgressText");

    if(bar){

        bar.style.width = percent + "%";

    }

    if(text){

        text.textContent = percent + "% Completed";

    }

}
// ==========================
// AI Access to Goals
// ==========================

function getGoals() {
    return JSON.parse(localStorage.getItem("goals")) || [];
}
function getGoalSummary(){

    const goals = getGoals();

    const total = goals.length;
    const completed = goals.filter(g => g.done).length;
    const pending = total - completed;

    return {
        total,
        completed,
        pending,
        goals
    };

}
// Start

function initializeGoals(){

    renderGoals();

    updateGoalSummary();

    updateGoalProgress();

    console.log("✅ Goals Engine Loaded");

}

document.addEventListener(

    "DOMContentLoaded",

    initializeGoals

);

async function migrateGoalsToSupabase() {
    try {
        const { data: { user }, error: authError } =
            await window.supabaseClient.auth.getUser();

        if (authError) throw authError;

        if (!user) {
            alert("Please sign in before backing up your goals.");
            return;
        }

        const localGoals = JSON.parse(
            localStorage.getItem("goals") || "[]"
        );

        if (!Array.isArray(localGoals) || localGoals.length === 0) {
            alert("No existing browser goals were found to back up.");
            return;
        }

        const { data: existingGoals, error: readError } =
            await window.supabaseClient
                .from("goals")
                .select("goal_data")
                .eq("user_id", user.id);

        if (readError) throw readError;

        const existingTitles = new Set(
            (existingGoals || []).map(row =>
                row.goal_data?.title || row.goal_data?.text || ""
            )
        );

        const goalsToInsert = localGoals.filter(goal => {
            const title = goal.title || goal.text || "";
            return title && !existingTitles.has(title);
        });

        if (goalsToInsert.length === 0) {
            alert("Your goals are already backed up. No duplicates were added.");
            return;
        }

        const rows = goalsToInsert.map(goal => ({
            user_id: user.id,
            goal_data: goal
        }));

        const { error: insertError } = await window.supabaseClient
            .from("goals")
            .insert(rows);

        if (insertError) throw insertError;

        alert(
            "Success! " + goalsToInsert.length +
            " goals backed up to Supabase.\n" +
            "Your original browser goals remain untouched."
        );

    } catch (error) {
        console.error("Goals backup failed:", error);
        alert("Goals backup failed: " + error.message);
    }
}

