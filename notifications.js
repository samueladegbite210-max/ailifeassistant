
/* ==========================================
   AI LIFE ASSISTANT
   Notifications — Supabase Version 5.0
   Per-user storage with legacy preservation
========================================== */

"use strict";

let notifications = [];
let notificationsUserId = null;
let notificationsReady = false;
let notificationSaveQueue = Promise.resolve();
let notificationEngineStarting = false;

const notificationList =
    document.getElementById("notificationList");

const LEGACY_NOTIFICATIONS_KEY = "notifications";
const NOTIFICATION_MIGRATION_KEY =
    "aiLifeAssistant_notifications_migrated_v1";

function getNotificationClient() {
    const client = window.supabaseClient;

    if (!client) {
        throw new Error("Supabase client is unavailable.");
    }

    return client;
}

function getUserDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function notificationDateDifference(dateString) {
    if (!dateString) return null;

    const match = String(dateString).match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) return null;

    const target = Date.UTC(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
    );

    const todayString = getUserDateString();
    const todayParts = todayString.split("-").map(Number);

    const today = Date.UTC(
        todayParts[0],
        todayParts[1] - 1,
        todayParts[2]
    );

    return Math.round((target - today) / 86400000);
}

/* ==========================================
   LOAD FROM SUPABASE
========================================== */

async function loadNotificationsFromSupabase() {
    const client = getNotificationClient();

    const { data: authData, error: authError } =
        await client.auth.getUser();

    if (authError) throw authError;

    if (!authData?.user) {
        throw new Error("Please sign in to view notifications.");
    }

    const userId = authData.user.id;

    const { data, error } = await client
        .from("notifications")
        .select("id, notification_data, created_at, updated_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;

    notificationsUserId = userId;

    notifications = (data || []).map(row => {
        const note = row.notification_data || {};

        return {
            ...note,
            id: note.id ?? row.id,
            _dbId: row.id,
            type: note.type || "AI",
            text: note.text || "",
            read: Boolean(note.read),
            time: note.time || row.created_at || ""
        };
    });

    notificationsReady = true;
}

/* ==========================================
   SAVE ONE NOTIFICATION
========================================== */

async function persistNotification(note) {
    if (!notificationsReady || !notificationsUserId) {
        throw new Error("Notifications are not ready.");
    }

    const client = getNotificationClient();

    const savedData = { ...note };
    delete savedData._dbId;

    if (note._dbId) {
        const { data, error } = await client
            .from("notifications")
            .update({
                notification_data: savedData,
                updated_at: new Date().toISOString()
            })
            .eq("id", note._dbId)
            .eq("user_id", notificationsUserId)
            .select("id")
            .maybeSingle();

        if (error) throw error;

        if (data?.id) return data.id;

        throw new Error(
            "Notification update was not confirmed. No new row was inserted."
        );
    }

    const { data, error } = await client
        .from("notifications")
        .insert({
            user_id: notificationsUserId,
            notification_data: savedData
        })
        .select("id")
        .single();

    if (error) throw error;

    return data.id;
}

/* ==========================================
   SAVE CHANGES
========================================== */

function saveNotifications() {
    renderNotifications();
    updateNotificationSummary();

    if (!notificationsReady || !notificationsUserId) {
        console.warn("Notifications are not ready to save.");
        return notificationSaveQueue;
    }

    const snapshot = notifications.slice();

    notificationSaveQueue = notificationSaveQueue.then(async () => {
        for (const note of snapshot) {
            const current = notifications.find(
                item => String(item.id) === String(note.id)
            );

            if (!current) continue;

            try {
                const dbId = await persistNotification(current);
                current._dbId = dbId;
            } catch (error) {
                console.error(
                    "Could not save notification:",
                    error
                );
                throw error;
            }
        }
    });

    notificationSaveQueue = notificationSaveQueue.catch(error => {
        console.error("Notification save queue failed:", error);
    });

    return notificationSaveQueue;
}

/* ==========================================
   MIGRATE LEGACY BROWSER NOTIFICATIONS
   Original localStorage data is never deleted.
========================================== */

async function migrateLegacyNotifications() {
    const client = getNotificationClient();

    const marker = localStorage.getItem(
        NOTIFICATION_MIGRATION_KEY
    );

    // The old shared browser data belongs to the first account
    // that successfully imports it. Never import it into another account.
    if (marker) return;

    let legacy = [];

    try {
        legacy = JSON.parse(
            localStorage.getItem(LEGACY_NOTIFICATIONS_KEY)
        ) || [];
    } catch (error) {
        console.error("Could not read legacy notifications:", error);
        return;
    }

    if (!Array.isArray(legacy) || legacy.length === 0) {
        return;
    }

    const { data: existingRows, error: readError } = await client
        .from("notifications")
        .select("notification_data")
        .eq("user_id", notificationsUserId);

    if (readError) throw readError;

    const existingKeys = new Set(
        (existingRows || []).map(row => {
            const note = row.notification_data || {};
            return `${note.type || "AI"}|${note.text || ""}|${note.time || ""}`;
        })
    );

    for (const oldNote of legacy) {
        if (!oldNote || typeof oldNote !== "object") continue;

        const note = {
            id: oldNote.id ?? Date.now() + Math.floor(Math.random() * 1000),
            type: oldNote.type || "AI",
            text: String(oldNote.text || ""),
            read: Boolean(oldNote.read),
            time: oldNote.time || new Date().toLocaleString()
        };

        if (!note.text) continue;

        const key = `${note.type}|${note.text}|${note.time}`;

        if (existingKeys.has(key)) continue;

        const { data, error } = await client
            .from("notifications")
            .insert({
                user_id: notificationsUserId,
                notification_data: note
            })
            .select("id, notification_data, created_at")
            .single();

        if (error) throw error;

        notifications.push({
            ...data.notification_data,
            _dbId: data.id
        });

        existingKeys.add(key);
    }

    // Mark the migration complete only after all inserts succeed.
    // The original localStorage key remains untouched.
    localStorage.setItem(
        NOTIFICATION_MIGRATION_KEY,
        notificationsUserId
    );
}

/* ==========================================
   ADD NOTIFICATION
========================================== */

async function addNotification(message, type = "AI") {
    const text = String(message || "").trim();

    if (!text || !notificationsReady) return;

    const exists = notifications.some(note =>
        note.text === text &&
        note.type === type &&
        !note.read
    );

    if (exists) return;

    const note = {
        id: (crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`),
        type,
        text,
        read: false,
        time: new Date().toLocaleString()
    };

    // Add immediately to the UI; save it to Supabase.
    notifications.unshift(note);
    renderNotifications();
    updateNotificationSummary();

    await saveNotifications();
}

/* ==========================================
   LOAD USER TASKS, GOALS, EVENTS
========================================== */

async function loadNotificationSourceData() {
    const client = getNotificationClient();
    const userId = notificationsUserId;

    const [taskResult, goalResult, eventResult] =
        await Promise.all([
            client.from("tasks")
                .select("task_data")
                .eq("user_id", userId),

            client.from("goals")
                .select("goal_data")
                .eq("user_id", userId),

            client.from("events")
                .select("event_data")
                .eq("user_id", userId)
        ]);

    if (taskResult.error) throw taskResult.error;
    if (goalResult.error) throw goalResult.error;
    if (eventResult.error) throw eventResult.error;

    return {
        tasks: (taskResult.data || []).map(row => row.task_data || {}),
        goals: (goalResult.data || []).map(row => row.goal_data || {}),
        events: (eventResult.data || []).map(row => row.event_data || {})
    };
}

/* ==========================================
   SMART NOTIFICATIONS
========================================== */

async function generateSmartNotifications(source) {
    const today = getUserDateString();
    const key = `aiLifeAssistant_lastSmart_${notificationsUserId}`;

    if (localStorage.getItem(key) === today) return;

    const tasks = source.tasks || [];
    const goals = source.goals || [];
    const events = source.events || [];

    const pendingTasks = tasks.filter(task => !task.done);
    const activeGoals = goals.filter(goal => !goal.done);

    if (pendingTasks.length) {
        await addNotification(
            `📌 You have ${pendingTasks.length} pending task(s).`,
            "Task"
        );
    }

    if (activeGoals.length) {
        await addNotification(
            `🎯 ${activeGoals.length} goal(s) are still in progress.`,
            "Goal"
        );
    }

    if (events.length) {
        await addNotification(
            `📅 ${events.length} calendar event(s) on record.`,
            "Calendar"
        );
    }

    const hour = new Date().getHours();

    if (hour < 12) {
        await addNotification(
            "🌅 Good Morning! Let's have a productive day.",
            "AI"
        );
    } else if (hour < 18) {
        await addNotification(
            "☀️ Good Afternoon! Keep pushing forward.",
            "AI"
        );
    } else {
        await addNotification(
            "🌙 Good Evening! Review today's progress.",
            "AI"
        );
    }

    localStorage.setItem(key, today);
}

/* ==========================================
   DAILY DEADLINE AND HEALTH REMINDERS
========================================== */

async function generateDailyReminders(source) {
    const today = getUserDateString();
    const key = `aiLifeAssistant_lastReminder_${notificationsUserId}`;

   console.log("Reminder flag key:", key);
console.log("Reminder flag value:", localStorage.getItem(key));
   
    if (localStorage.getItem(key) === today) return;

    const tasks = source.tasks || [];
    const goals = source.goals || [];
    const events = source.events || [];

    for (const task of tasks) {
        if (!task.deadline || task.done) continue;

        const diff = notificationDateDifference(task.deadline);
        const title = task.title || task.text || "Untitled task";

        if (diff === 0) {
            await addNotification(`📌 Task Due Today: ${title}`, "Task");
        } else if (diff === 1) {
            await addNotification(`📌 Task Due Tomorrow: ${title}`, "Task");
        } else if (diff < 0) {
            await addNotification(`🚨 Task Overdue: ${title}`, "Task");
        }
    }

    for (const goal of goals) {
        if (!goal.deadline || goal.done) continue;

        const diff = notificationDateDifference(goal.deadline);
        const title = goal.title || goal.text || goal.name || "Untitled goal";

        if (diff === 0) {
            await addNotification(`🎯 Goal Due Today: ${title}`, "Reminder");
        } else if (diff === 1) {
            await addNotification(`⏳ Goal Due Tomorrow: ${title}`, "Reminder");
        } else if (diff < 0) {
            await addNotification(`🚨 Goal Overdue: ${title}`, "Reminder");
        }
    }

    for (const event of events) {
        if (!event.date) continue;

        const diff = notificationDateDifference(event.date);
        const title = event.title || "Untitled event";

        if (diff === 0) {
            await addNotification(`📅 Event Today: ${title}`, "Calendar");
        } else if (diff === 1) {
            await addNotification(`📅 Event Tomorrow: ${title}`, "Calendar");
        }
    }

    await addNotification("💧 Drink enough water today.", "Health");
    await addNotification("🚶 Stand up and stretch every hour.", "Health");
    await addNotification("😴 Get enough rest tonight.", "Health");

    localStorage.setItem(key, today);
}

/* ==========================================
   RENDER NOTIFICATIONS
========================================== */

function renderNotifications() {
    const empty = document.getElementById("emptyNotifications");

    if (!notificationList) return;

    notificationList.innerHTML = "";

    if (notifications.length === 0) {
        if (empty) empty.style.display = "block";
        return;
    }

    if (empty) empty.style.display = "none";

    notifications.forEach(note => {
        const li = document.createElement("li");
        li.className = "notification-item";

        const content = document.createElement("div");
        content.className = "notification-content";

        const details = document.createElement("div");
        const heading = document.createElement("strong");
        heading.textContent =
            `${getNotificationIcon(note.type)} ${note.type}`;

        const message = document.createElement("p");
        message.textContent = note.text;

        const time = document.createElement("small");
        time.textContent = note.time;

        details.append(heading, message, time);
        content.appendChild(details);

        const actions = document.createElement("div");
        const deleteButton = document.createElement("button");
        deleteButton.className = "deleteBtn";
        deleteButton.textContent = "🗑";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", event => {
            event.stopPropagation();
            deleteNotification(note.id);
        });

        actions.appendChild(deleteButton);
        li.append(content, actions);

        li.addEventListener("click", () => markRead(note.id));

        if (note.read) li.style.opacity = "0.6";

        notificationList.appendChild(li);
    });
}

/* ==========================================
   SUMMARY
========================================== */

function updateNotificationSummary() {
    const total = notifications.length;
    const unread = notifications.filter(note => !note.read).length;
    const read = total - unread;

    const totalBox = document.getElementById("totalNotifications");
    const unreadBox = document.getElementById("unreadNotifications");
    const readBox = document.getElementById("readNotifications");

    if (totalBox) totalBox.textContent = total;
    if (unreadBox) unreadBox.textContent = unread;
    if (readBox) readBox.textContent = read;
}

/* ==========================================
   NOTIFICATION ICONS
========================================== */

function getNotificationIcon(type) {
    switch (type) {
        case "Task": return "📌";
        case "Goal": return "🎯";
        case "Calendar": return "📅";
        case "Reminder": return "⏰";
        case "Health": return "💧";
        case "Achievement": return "🏆";
        default: return "🤖";
    }
}

/* ==========================================
   MARK READ
========================================== */

async function markRead(id) {
    const note = notifications.find(
        item => String(item.id) === String(id)
    );

    if (!note || note.read) return;

    note.read = true;
    renderNotifications();
    updateNotificationSummary();

    try {
        await saveNotifications();
    } catch (error) {
        note.read = false;
        renderNotifications();
        updateNotificationSummary();
        console.error("Could not mark notification as read:", error);
    }
}

/* ==========================================
   DELETE ONE NOTIFICATION
========================================== */

async function deleteNotification(id) {
    const note = notifications.find(
        item => String(item.id) === String(id)
    );

    if (!note) return;

    if (!notificationsReady || !notificationsUserId) return;

    try {
        await notificationSaveQueue;

        if (note._dbId) {
            const client = getNotificationClient();

            const { error } = await client
                .from("notifications")
                .delete()
                .eq("id", note._dbId)
                .eq("user_id", notificationsUserId);

            if (error) throw error;
        }

        notifications = notifications.filter(
            item => String(item.id) !== String(id)
        );

        renderNotifications();
        updateNotificationSummary();
    } catch (error) {
        console.error("Could not delete notification:", error);
        alert("The notification could not be deleted. Please try again.");
    }
}

/* ==========================================
   MARK ALL READ
========================================== */

async function markAllRead() {
    notifications.forEach(note => {
        note.read = true;
    });

    await saveNotifications();
}

/* ==========================================
   CLEAR ALL
========================================== */

async function clearNotifications() {
    if (!confirm("Clear all notifications for this account?")) return;

    if (!notificationsReady || !notificationsUserId) return;

    try {
        await notificationSaveQueue;

        const client = getNotificationClient();

        const { error } = await client
            .from("notifications")
            .delete()
            .eq("user_id", notificationsUserId);

        if (error) throw error;

        notifications = [];
        renderNotifications();
        updateNotificationSummary();
    } catch (error) {
        console.error("Could not clear notifications:", error);
        alert("Notifications could not be cleared. Please try again.");
    }
}

/* ==========================================
   INITIALIZE
========================================== */

async function initializeNotifications() {
    if (notificationEngineStarting) return;
    notificationEngineStarting = true;

    notificationsReady = false;

    try {
        await loadNotificationsFromSupabase();

        await migrateLegacyNotifications();

        // Reload to ensure migrated records have database IDs.
        await loadNotificationsFromSupabase();

        const source = await loadNotificationSourceData();

        renderNotifications();
        updateNotificationSummary();

        await generateDailyReminders(source);
        await generateSmartNotifications(source);

        renderNotifications();
        updateNotificationSummary();

        
console.log("Notifications loaded for the signed-in user.");

    } catch (error) {
        notificationsReady = false;

        const errorMessage =
            error?.message || String(error) || "Unknown error";

        console.error("Notifications initialization failed:", error);

        if (notificationList) {
            notificationList.innerHTML = "";

            const errorItem = document.createElement("li");
            errorItem.textContent =
                "Notifications error: " + errorMessage;

            notificationList.appendChild(errorItem);
        }
    } finally {

        notificationEngineStarting = false;
    }
}

/* ==========================================
   REFRESH
========================================== */

async function refreshNotifications() {
    if (!notificationsReady) {
        await initializeNotifications();
        return;
    }

    try {
        await loadNotificationsFromSupabase();
        renderNotifications();
        updateNotificationSummary();
    } catch (error) {
        console.error("Could not refresh notifications:", error);
    }
}

/* ==========================================
   START
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    initializeNotifications();
});
