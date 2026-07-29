// ==========================
// AI Life Assistant
// Notifications
// ==========================

let notifications =
JSON.parse(localStorage.getItem("notifications")) || [];

const notificationList =
document.getElementById("notificationList");

// --------------------------
// Save Notifications
// --------------------------
function saveNotifications(){

    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );

    renderNotifications();

    updateNotificationSummary();

}

// --------------------------
// Add Notification
// --------------------------
function addNotification(message){

    notifications.unshift({

        id: Date.now(),

        text: message,

        read:false,

        time:new Date().toLocaleString()

    });

    saveNotifications();

}

// --------------------------
// Render Notifications
// --------------------------
function renderNotifications(){

    notificationList.innerHTML="";

    const empty =
    document.getElementById("emptyNotifications");

    if(notifications.length===0){

        empty.style.display="block";

        return;

    }

    empty.style.display="none";

    notifications.forEach(note=>{

        const li=document.createElement("li");

        li.className="notification-item";

        li.innerHTML=`

        <div class="notification-content">

            <strong>
            ${note.read ? "📖" : "🔔"}
            </strong>

            <div>

                <p>${note.text}</p>

                <small>${note.time}</small>

            </div>

        </div>

        <button
        class="deleteBtn"
        onclick="deleteNotification(${note.id})">

        🗑

        </button>

        `;

        li.onclick=function(){

            markRead(note.id);

        };

        notificationList.appendChild(li);

    });

}

// --------------------------
// Mark Read
// --------------------------
function markRead(id){

    notifications=notifications.map(note=>{

        if(note.id===id){

            note.read=true;

        }

        return note;

    });

    saveNotifications();

}

// --------------------------
// Mark All Read
// --------------------------
function markAllRead(){

    notifications.forEach(note=>{

        note.read=true;

    });

    saveNotifications();

}

// --------------------------
// Delete Notification
// --------------------------
function deleteNotification(id){

    notifications=
    notifications.filter(note=>note.id!==id);

    saveNotifications();

}

// --------------------------
// Clear All
// --------------------------
function clearNotifications(){

    if(confirm("Clear all notifications?")){

        notifications=[];

        saveNotifications();

    }

}

// --------------------------
// Summary
// --------------------------
function updateNotificationSummary(){

    const total=notifications.length;

    const unread=
    notifications.filter(n=>!n.read).length;

    const read=total-unread;

    document.getElementById(
        "totalNotifications"
    ).textContent=total;

    document.getElementById(
        "unreadNotifications"
    ).textContent=unread;

    document.getElementById(
        "readNotifications"
    ).textContent=read;

}

// --------------------------
// Start
// --------------------------
renderNotifications();

updateNotificationSummary();
