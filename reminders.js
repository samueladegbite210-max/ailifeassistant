
"use strict";

// ==========================================
// AI LIFE ASSISTANT — REMINDER ENGINE
// Supabase-backed, per-user reminders
// ==========================================

let reminderEngineUserId = null;
let reminderEngineReady = false;
let reminderEngineQueue = Promise.resolve();

async function getReminderUser() {
    const client = window.supabaseClient;

    if (!client) {
        throw new Error("Supabase client is unavailable.");
    }

    const { data, error } = await client.auth.getUser();

    if (error || !data?.user) {
        throw new Error("Please sign in to load reminders.");
    }

    return data.user;
}

async function loadSavedReminders(userId) {
    const client = window.supabaseClient;

    const { data, error } = await client
        .from("reminders")
        .select("id, reminder_data, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
}

async function saveGeneratedReminder(userId, message, type = "Reminder") {
    const client = window.supabaseClient;

    // Prevent duplicate active reminders for the same user.
    const { data, error } = await client
        .from("reminders")
        .select("id, reminder_data")
        .eq("user_id", userId);

    if (error) throw error;

    const exists = (data || []).some(function (row) {
        const reminder = row.reminder_data || {};
        return reminder.text === message &&
            reminder.date === new Date().toISOString().slice(0, 10);
    });

    if (exists) return;

    const reminderData = {
        text: message,
        title: message,
        type: type,
        date: new Date().toISOString().slice(0, 10),
        read: false,
        time: new Date().toLocaleString()
    };

    const { error: insertError } = await client
        .from("reminders")
        .insert({
            user_id: userId,
            reminder_data: reminderData
        });

    if (insertError) throw insertError;
}

// Keep this function name because dashboard.js calls it.
async function checkReminders() {
    try {
        const user = await getReminderUser();
        reminderEngineUserId = user.id;
        reminderEngineReady = true;

        const client = window.supabaseClient;

        // Read account-specific Tasks, Goals, and Events from Supabase.
        const [taskResult, goalResult, eventResult] = await Promise.all([
            client.from("tasks")
                .select("task_data")
                .eq("user_id", user.id),
            client.from("goals")
                .select("goal_data")
                .eq("user_id", user.id),
            client.from("events")
                .select("event_data")
                .eq("user_id", user.id)
        ]);

        if (taskResult.error) throw taskResult.error;
        if (goalResult.error) throw goalResult.error;
        if (eventResult.error) throw eventResult.error;

        const tasks = (taskResult.data || []).map(row => row.task_data || {});
        const goals = (goalResult.data || []).map(row => row.goal_data || {});
        const events = (eventResult.data || []).map(row => row.event_data || {});

        const today = new Date().toISOString().slice(0, 10);

        const pendingTasks = tasks.filter(task => !task.done);

        if (pendingTasks.length > 0) {
            await saveGeneratedReminder(
                user.id,
                "📌 You still have " + pendingTasks.length +
                " unfinished task(s).",
                "Task"
            );
        }

        events.forEach(function (event) {
            if (event.date === today) {
                reminderEngineQueue = reminderEngineQueue.then(() =>
                    saveGeneratedReminder(
                        user.id,
                        "📅 Event today: " + (event.title || "Untitled event"),
                        "Calendar"
                    )
                );
            }
        });

        goals.filter(goal => !goal.done).forEach(function (goal) {
            reminderEngineQueue = reminderEngineQueue.then(() =>
                saveGeneratedReminder(
                    user.id,
                    "🎯 Goal Reminder: " +
                    (goal.text || goal.title || goal.name || "Your goal"),
                    "Goal"
                )
            );
        });

        await reminderEngineQueue;

        console.log("Reminder engine loaded for signed-in user.");
    } catch (error) {
        console.error("Reminder engine failed:", error);
    }
}

// Optional helper for checking this account's saved reminders.
async function getSavedReminders() {
    try {
        const user = await getReminderUser();
        return await loadSavedReminders(user.id);
    } catch (error) {
        console.error("Could not load saved reminders:", error);
        return [];
    }
}
