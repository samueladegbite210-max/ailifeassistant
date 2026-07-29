/*==========================================
 AI LIFE ASSISTANT
 Notifications.js Version 4.0
==========================================*/

"use strict";

/*==========================================
 STORAGE
==========================================*/

let notifications =
JSON.parse(localStorage.getItem("notifications")) || [];

const notificationList =
document.getElementById("notificationList");

/*==========================================
 SAVE
==========================================*/

function saveNotifications(){

    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );

    renderNotifications();

    updateNotificationSummary();

}

/*==========================================
 ADD NOTIFICATION
==========================================*/

function addNotification(

    message,

    type = "AI"

){

    const exists = notifications.find(

        note =>

        note.text === message &&

        note.read === false

    );

    if(exists) return;

    notifications.unshift({

        id: Date.now(),

        type,

        text: message,

        read: false,

        time: new Date().toLocaleString()

    });

    saveNotifications();

}
/*==========================================
 SMART NOTIFICATION ENGINE
==========================================*/

function generateSmartNotifications(){

 const today =
new Date().toDateString();

const lastSmart =
localStorage.getItem("lastSmartNotification");

if(lastSmart === today){

    return;

}
    const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

    const goals =
    JSON.parse(localStorage.getItem("goals")) || [];

    const events =
    JSON.parse(localStorage.getItem("events")) || [];

    // Pending Tasks
    const pendingTasks =
    tasks.filter(task => !task.done);

    if(pendingTasks.length > 0){

        addNotification(

            `📌 You have ${pendingTasks.length} pending task(s).`,

            "Task"

        );

    }

    // Active Goals
    const activeGoals =
    goals.filter(goal => !goal.done);

    if(activeGoals.length > 0){

        addNotification(

            `🎯 ${activeGoals.length} goal(s) are still in progress.`,

            "Goal"

        );

    }

    // Upcoming Events
    if(events.length > 0){

        addNotification(

            `📅 ${events.length} upcoming event(s).`,

            "Calendar"

        );

    }

    // Greeting
    const hour = new Date().getHours();

    if(hour < 12){

        addNotification(

            "🌅 Good Morning! Let's have a productive day.",

            "AI"

        );

    }

    else if(hour < 18){

        addNotification(

            "☀️ Good Afternoon! Keep pushing forward.",

            "AI"

        );

    }

    else{

        addNotification(

            "🌙 Good Evening! Review today's progress.",

            "AI"

        );

    }

}
localStorage.setItem(

    "lastSmartNotification",

    today

);
/*==========================================
 DAILY REMINDER ENGINE
==========================================*/

function generateDailyReminders(){

    const today =
    new Date().toDateString();

    const lastReminder =
    localStorage.getItem("lastReminderDate");

    // Run only once each day
    if(lastReminder === today){

        return;

    }

    const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

    const goals =
    JSON.parse(localStorage.getItem("goals")) || [];

    const events =
    JSON.parse(localStorage.getItem("events")) || [];

    // Pending Tasks
    const pendingTasks =
    tasks.filter(task => !task.done);

    if(pendingTasks.length > 0){

        addNotification(

            `⏰ Don't forget to complete your ${pendingTasks.length} pending task(s).`,

            "Reminder"

        );

    }

    // Goals
    const validGoals = goals.filter(goal => goal.title);

if(validGoals.length > 0){

    addNotification(

        "🎯 Remember to work on your goals today.",

        "Reminder"

    );

}

    // Events
    if(events.length > 0){

        addNotification(

            "📅 Check your calendar before starting your day.",

            "Reminder"

        );

    }

    // Health reminders
    addNotification(

        "💧 Drink enough water today.",

        "Health"

    );

    addNotification(

        "🚶 Stand up and stretch every hour.",

        "Health"

    );

    addNotification(

        "😴 Get enough rest tonight.",

        "Health"

    );

    // Save today's reminder date
    localStorage.setItem(

        "lastReminderDate",

        today

    );

}

/*==========================================
 RENDER NOTIFICATIONS
==========================================*/

function renderNotifications(){

    const empty =
    document.getElementById("emptyNotifications");

    if(!notificationList) return;

    notificationList.innerHTML = "";

    if(notifications.length === 0){

        if(empty){

            empty.style.display = "block";

        }

        return;

    }

    if(empty){

        empty.style.display = "none";

    }

    notifications.forEach(note => {

        const li = document.createElement("li");

        li.className =
        "notification-item";

        li.innerHTML = `

        <div class="notification-content">

            <div>

                <strong>

                ${getNotificationIcon(note.type)}

                ${note.type}

                </strong>

                <p>${note.text}</p>

                <small>${note.time}</small>

            </div>

        </div>

        <div>

            <button
            class="deleteBtn"
            onclick="event.stopPropagation();deleteNotification(${note.id})">

            🗑

            </button>

        </div>

        `;

        li.onclick = function(){

            markRead(note.id);

        };

        if(note.read){

            li.style.opacity = "0.6";

        }

        notificationList.appendChild(li);

    });

}
function updateNotificationSummary(){

    const total = notifications.length;

    const unread = notifications.filter(

        note => !note.read

    ).length;

    const read = total - unread;

    document.getElementById("totalNotifications").textContent = total;

    document.getElementById("unreadNotifications").textContent = unread;

    document.getElementById("readNotifications").textContent = read;

}
/*==========================================
 NOTIFICATION ICONS
==========================================*/

function getNotificationIcon(type){

    switch(type){

        case "Task":
            return "📌";

        case "Goal":
            return "🎯";

        case "Calendar":
            return "📅";

        case "Reminder":
            return "⏰";

        case "Health":
            return "💧";

        case "Achievement":
            return "🏆";

        default:
            return "🤖";

    }

}
/*==========================================
UPDATE SUMMARY
==========================================*/

function updateNotificationSummary(){

    const total = notifications.length;

    const unread =
    notifications.filter(note => !note.read).length;

    const read = total - unread;

    const totalBox =
    document.getElementById("totalNotifications");

    const unreadBox =
    document.getElementById("unreadNotifications");

    const readBox =
    document.getElementById("readNotifications");

    if(totalBox) totalBox.textContent = total;

    if(unreadBox) unreadBox.textContent = unread;

    if(readBox) readBox.textContent = read;

}

/*==========================================
MARK READ
==========================================*/

function markRead(id){

    notifications = notifications.map(note=>{

        if(note.id === id){

            note.read = true;

        }

        return note;

    });

    saveNotifications();

}

/*==========================================
DELETE
==========================================*/

function deleteNotification(id){

    notifications =
    notifications.filter(note=>note.id !== id);

    saveNotifications();

}

/*==========================================
MARK ALL READ
==========================================*/

function markAllRead(){

    notifications.forEach(note=>{

        note.read = true;

    });

    saveNotifications();

}

/*==========================================
CLEAR ALL
==========================================*/

function clearNotifications(){

    if(confirm("Clear all notifications?")){

        notifications = [];

        saveNotifications();

    }

}
/*==========================================
 INITIALIZATION
==========================================*/

function initializeNotifications(){

    // Generate reminders (once per day)
    generateDailyReminders();

    // Generate smart notifications
    generateSmartNotifications();

    // Render notification list
    renderNotifications();

    // Update summary cards
    updateNotificationSummary();

    console.log("✅ Notifications Engine Loaded");

}

/*==========================================
 AUTO REFRESH
==========================================*/

function refreshNotifications(){

    renderNotifications();

    updateNotificationSummary();

}

/*==========================================
 START
==========================================*/

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeNotifications();

    }

);
