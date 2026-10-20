// ==========================
// AI Life Assistant - Habits
// Supabase + Per-User Storage
// ==========================
let habits = [];
let currentUser = null;
let habitsReady = false;
let savingHabits = false;
// Keep existing local data available for migration.
function getLegacyHabits() {
    try {
        const saved = localStorage.getItem("habits");
        if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (error) {
        console.error("Could not read existing habits:", error);
    }
    return [
        { id: 1, title: "💧 Drink Water", streak: 0, lastCompleted: null },
        { id: 2, title: "🏃 Exercise", streak: 0, lastCompleted: null },
        { id: 3, title: "📖 Read", streak: 0, lastCompleted: null },
        { id: 4, title: "😴 Sleep Before 11PM", streak: 0, lastCompleted: null },
        { id: 5, title: "🙏 Pray", streak: 0, lastCompleted: null }
    ];
}
// Remove database-only information before storing habit data.
function cleanHabit(habit) {
    return {
        id: habit.id,
        title: habit.title,
        streak: Number(habit.streak) || 0,
        lastCompleted: habit.lastCompleted || null
    };
}
// Save habits to the signed-in user's Supabase records.
async function saveHabits() {
    if (!currentUser || !habitsReady || savingHabits) return;
    savingHabits = true;
    try {
        for (const habit of habits) {
            const habitData = cleanHabit(habit);
            if (habit.dbId) {
                const { error } = await window.supabaseClient
                    .from("habits")
                    .update({ habit_data: habitData })
                    .eq("id", habit.dbId)
                    .eq("user_id", currentUser.id);
                if (error) throw error;
            } else {
                const { data, error } = await window.supabaseClient
                    .from("habits")
                    .insert({
                        user_id: currentUser.id,
                        habit_data: habitData
                    })
                    .select("id")
                    .single();
                if (error) throw error;
                habit.dbId = data.id;
            }
        }
        // Keep a local copy as a fallback; Supabase remains the main storage.
        localStorage.setItem(
            "habits",
            JSON.stringify(habits.map(cleanHabit))
        );
        renderHabits();
        updateHabitProgress();
    } catch (error) {
        console.error("Could not save habits to Supabase:", error);
        alert("Your habits could not be saved online. Please check your connection and try again.");
    } finally {
        savingHabits = false;
    }
}
// Complete a habit.
async function toggleHabit(id) {
    if (!habitsReady || !currentUser) {
        alert("Please sign in and wait for your habits to load.");
        return;
    }
    const today = new Date().toDateString();
    const habit = habits.find(item => item.id === id);
    if (!habit || habit.lastCompleted === today) return;
    habit.lastCompleted = today;
    habit.streak = (Number(habit.streak) || 0) + 1;
    // XP is still handled by the existing local storage system.
    let xp = Number(localStorage.getItem("xp")) || 0;
    xp += 10;
    localStorage.setItem("xp", String(xp));
    await saveHabits();
}
// Display habits.
function renderHabits() {
    const box = document.getElementById("habitList");
    if (!box) return;
    if (!habitsReady) {
        box.textContent = "Loading your habits...";
        return;
    }
    box.innerHTML = "";
    const today = new Date().toDateString();
    habits.forEach(habit => {
        const completedToday = habit.lastCompleted === today;
        const card = document.createElement("div");
        card.className = "card";
        const heading = document.createElement("h3");
        heading.textContent = habit.title;
        const streak = document.createElement("p");
        streak.textContent = `🔥 Streak: ${habit.streak} day(s)`;
        const button = document.createElement("button");
        button.textContent = completedToday
            ? "✅ Completed"
            : "✅ Complete";
        button.disabled = completedToday;
        button.addEventListener("click", () => toggleHabit(habit.id));
        card.append(heading, streak, button);
        box.appendChild(card);
    });
}
// Update today's progress display.
function updateHabitProgress() {
    const today = new Date().toDateString();
    const total = habits.length;
    const done = habits.filter(
        habit => habit.lastCompleted === today
    ).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const progress = document.getElementById("habitProgress");
    const text = document.getElementById("habitProgressText");
    if (progress) progress.style.width = percent + "%";
    if (text) text.textContent = `${percent}% (${done}/${total})`;
}
// Load only the signed-in user's habits and migrate old browser data
// if that user has no habits saved in Supabase yet.
async function initializeHabits() {
    habitsReady = false;
    currentUser = null;
    habits = [];
    renderHabits();
    try {
        const client = window.supabaseClient;
        if (!client) {
            throw new Error("Supabase client was not found.");
        }
        const { data: sessionData, error: sessionError } =
            await client.auth.getSession();
        if (sessionError) throw sessionError;
        currentUser = sessionData.session?.user || null;
        if (!currentUser) {
            const box = document.getElementById("habitList");
            if (box) {
                box.textContent = "Please sign in to access your habits.";
            }
            return;
        }
        const { data: rows, error: loadError } = await client
            .from("habits")
            .select("id, habit_data")
            .eq("user_id", currentUser.id);
        if (loadError) throw loadError;
        if (rows && rows.length > 0) {
            habits = rows.map(row => ({
                ...row.habit_data,
                dbId: row.id
            }));
        } else {
            // Show defaults without importing shared browser data.
            habits = [
                {
                    id: 1,
                    title: "💧 Drink Water",
                    streak: 0,
                    lastCompleted: null
                },
                {
                    id: 2,
                    title: "🏃 Exercise",
                    streak: 0,
                    lastCompleted: null
                },
                {
                    id: 3,
                    title: "📖 Read",
                    streak: 0,
                    lastCompleted: null
                },
                {
                    id: 4,
                    title: "😴 Sleep Before 11PM",
                    streak: 0,
                    lastCompleted: null
                },
                {
                    id: 5,
                    title: "🙏 Pray",
                    streak: 0,
                    lastCompleted: null
                }
            ];
        }
        habitsReady = true;
        renderHabits();
        updateHabitProgress();
    } catch (error) {
        console.error("Habits initialization failed:", error);
        const box = document.getElementById("habitList");
        if (box) {
            box.textContent =
                "Could not load habits. Please refresh and try again.";
        }
    }
}
