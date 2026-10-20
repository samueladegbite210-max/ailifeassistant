



/* =========================================
   AI Life Assistant - Goals
   Supabase user-specific storage
========================================= */

let goals = [];
let currentUserId = null;
let editingGoalId = null;
let goalsLoaded = false;

const goalTitle = document.getElementById("goalTitle");
const goalDescription = document.getElementById("goalDescription");
const goalDeadline = document.getElementById("goalDeadline");
const goalCategory = document.getElementById("goalCategory");
const goalList = document.getElementById("goalList");

const goalsClient = window.supabaseClient;

// Get the signed-in user
async function getGoalsUser() {
    const { data, error } =
        await goalsClient.auth.getUser();

    if (error) throw error;

    if (!data.user) {
        throw new Error("Please sign in to access your goals.");
    }

    return data.user;
}

// Load only this user's goals
async function loadGoals() {
    try {
        if (!goalsClient) {
            throw new Error("Supabase client is not available.");
        }

        const user = await getGoalsUser();
        currentUserId = user.id;

        const { data, error } = await goalsClient
            .from("goals")
            .select("id, goal_data")
            .eq("user_id", currentUserId);

        if (error) throw error;

        goals = (data || []).map(row => ({
            ...row.goal_data,
            dbId: row.id
        }));

        goalsLoaded = true;

        renderGoals();
        updateGoalSummary();
        updateGoalProgress();

    } catch (error) {
        console.error("Failed to load goals:", error);
        alert("Could not load goals: " + error.message);
    }
}

// Save a new goal or update an existing goal
async function saveGoal() {
    if (!goalsLoaded || !currentUserId) {
        alert("Your goals are still loading. Please try again.");
        return;
    }

    const title = goalTitle.value.trim();
    const description = goalDescription.value.trim();
    const deadline = goalDeadline.value;
    const category = goalCategory.value;

    if (!title) {
        alert("Please enter a goal title.");
        return;
    }

    const existingGoal = editingGoalId
        ? goals.find(goal => goal.dbId === editingGoalId)
        : null;

    const goalData = {
        ...(existingGoal || {}),
        title,
        description,
        deadline,
        category,
        done: existingGoal ? existingGoal.done : false
    };

    delete goalData.dbId;

    try {
        if (existingGoal) {
            const { error } = await goalsClient
                .from("goals")
                .update({ goal_data: goalData })
                .eq("id", existingGoal.dbId)
                .eq("user_id", currentUserId);

            if (error) throw error;

            goals = goals.map(goal =>
                goal.dbId === existingGoal.dbId
                    ? { ...goalData, dbId: goal.dbId }
                    : goal
            );

        } else {
            const { data, error } = await goalsClient
                .from("goals")
                .insert({
                    user_id: currentUserId,
                    goal_data: goalData
                })
                .select("id, goal_data")
                .single();

            if (error) throw error;

            goals.push({
                ...data.goal_data,
                dbId: data.id
            });
        }

        editingGoalId = null;
        goalTitle.value = "";
        goalDescription.value = "";
        goalDeadline.value = "";
        goalCategory.value = "Personal";

        renderGoals();
        updateGoalSummary();
        updateGoalProgress();

    } catch (error) {
        console.error("Failed to save goal:", error);
        alert("Could not save goal: " + error.message);
    }
}

// Render goals safely
function renderGoals(filteredGoals = goals) {
    if (!goalList) return;

    goalList.replaceChildren();

    if (filteredGoals.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No goals yet.";
        goalList.appendChild(message);
        return;
    }

    filteredGoals.forEach(goal => {
        const card = document.createElement("div");
        card.className = "card";

        const heading = document.createElement("h3");
        heading.textContent =
            `${goal.done ? "✅" : "🎯"} ${goal.title || goal.text || ""}`;
        card.appendChild(heading);

        if (goal.description) {
            const description = document.createElement("p");
            description.textContent = goal.description;
            card.appendChild(description);
        }

        if (goal.category) {
            const category = document.createElement("p");
            category.textContent = `📂 ${goal.category}`;
            card.appendChild(category);
        }

        if (goal.deadline) {
            const deadline = document.createElement("p");
            deadline.textContent = `📅 ${goal.deadline}`;
            card.appendChild(deadline);
        }

        const editButton = document.createElement("button");
        editButton.textContent = "✏️ Edit";
        editButton.addEventListener("click", () => editGoal(goal.dbId));
        card.appendChild(editButton);

        const completeButton = document.createElement("button");
        completeButton.textContent = goal.done
            ? "↩ Mark Pending"
            : "✅ Complete";
        completeButton.addEventListener(
            "click",
            () => toggleGoal(goal.dbId)
        );
        card.appendChild(completeButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";
        deleteButton.addEventListener(
            "click",
            () => deleteGoal(goal.dbId)
        );
        card.appendChild(deleteButton);

        goalList.appendChild(card);
    });
}

// Edit without deleting the original goal
function editGoal(dbId) {
    const goal = goals.find(item => item.dbId === dbId);
    if (!goal) return;

    editingGoalId = dbId;

    goalTitle.value = goal.title || goal.text || "";
    goalDescription.value = goal.description || "";
    goalDeadline.value = goal.deadline || "";
    goalCategory.value = goal.category || "Personal";

    goalTitle.focus();
}

// Complete or reopen a goal
async function toggleGoal(dbId) {
    const goal = goals.find(item => item.dbId === dbId);
    if (!goal || !currentUserId) return;

    const updatedGoal = { ...goal, done: !goal.done };
    delete updatedGoal.dbId;

    try {
        const { error } = await goalsClient
            .from("goals")
            .update({ goal_data: updatedGoal })
            .eq("id", dbId)
            .eq("user_id", currentUserId);

        if (error) throw error;

        goals = goals.map(item =>
            item.dbId === dbId
                ? { ...updatedGoal, dbId }
                : item
        );

        if (updatedGoal.done) {
            if (typeof addXP === "function") {
                addXP(20);
            }

            if (typeof addNotification === "function") {
                addNotification(
                    `🎯 Goal Completed: ${updatedGoal.title || updatedGoal.text || ""}`,
                    "Achievement"
                );
            }
        }

        renderGoals();
        updateGoalSummary();
        updateGoalProgress();

        if (typeof refreshNotifications === "function") {
            refreshNotifications();
        }

    } catch (error) {
        console.error("Failed to update goal:", error);
        alert("Could not update goal: " + error.message);
    }
}

// Delete a goal belonging to this user
async function deleteGoal(dbId) {
    if (!confirm("Delete this goal?")) return;
    if (!currentUserId) return;

    try {
        const { error } = await goalsClient
            .from("goals")
            .delete()
            .eq("id", dbId)
            .eq("user_id", currentUserId);

        if (error) throw error;

        goals = goals.filter(goal => goal.dbId !== dbId);

        if (editingGoalId === dbId) {
            editingGoalId = null;
            goalTitle.value = "";
            goalDescription.value = "";
            goalDeadline.value = "";
            goalCategory.value = "Personal";
        }

        renderGoals();
        updateGoalSummary();
        updateGoalProgress();

    } catch (error) {
        console.error("Failed to delete goal:", error);
        alert("Could not delete goal: " + error.message);
    }
}

// Search goals
const searchGoal = document.getElementById("searchGoal");

if (searchGoal) {
    searchGoal.addEventListener("input", function () {
        const keyword = this.value.toLowerCase().trim();

        const filteredGoals = goals.filter(goal =>
            (goal.title || goal.text || "").toLowerCase().includes(keyword) ||
            (goal.description || "").toLowerCase().includes(keyword) ||
            (goal.category || "").toLowerCase().includes(keyword)
        );

        renderGoals(filteredGoals);

        if (filteredGoals.length === 0) {
            goalList.replaceChildren();
            const message = document.createElement("p");
            message.textContent = "❌ No matching goals found.";
            goalList.appendChild(message);
        }
    });
}

// Update goal counters
function updateGoalSummary() {
    const total = goals.length;
    const completed = goals.filter(goal => goal.done).length;
    const pending = total - completed;

    const totalBox = document.getElementById("totalGoals");
    const completedBox = document.getElementById("completedGoals");
    const pendingBox = document.getElementById("pendingGoals");

    if (totalBox) totalBox.textContent = total;
    if (completedBox) completedBox.textContent = completed;
    if (pendingBox) pendingBox.textContent = pending;
}

// Update progress bar
function updateGoalProgress() {
    const total = goals.length;
    const completed = goals.filter(goal => goal.done).length;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const bar = document.getElementById("goalProgressBar");
    const text = document.getElementById("goalProgressText");

    if (bar) bar.style.width = percent + "%";
    if (text) text.textContent = percent + "% Completed";
}

// AI access to the currently loaded goals
function getGoals() {
    return goals.map(goal => {
        const { dbId, ...goalData } = goal;
        return goalData;
    });
}

function getGoalSummary() {
    const total = goals.length;
    const completed = goals.filter(goal => goal.done).length;

    return {
        total,
        completed,
        pending: total - completed,
        goals: getGoals()
    };
}

// Initialize after the page loads
document.addEventListener("DOMContentLoaded", loadGoals);


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

        
const existingIds = new Set(
    (existingGoals || [])
        .map(row => row.goal_data?.id)
        .filter(id => id !== undefined && id !== null)
        .map(id => String(id))
);

const goalsToInsert = localGoals.filter(goal => {
    return (
        goal.id !== undefined &&
        goal.id !== null &&
        !existingIds.has(String(goal.id))
    );
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

