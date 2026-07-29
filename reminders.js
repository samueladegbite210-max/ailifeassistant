// ===================================
// AI Life Assistant Reminder Engine
// ===================================

function checkReminders(){

    const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

    const goals =
    JSON.parse(localStorage.getItem("goals")) || [];

    const events =
    JSON.parse(localStorage.getItem("events")) || [];

    const notifications =
    JSON.parse(localStorage.getItem("notifications")) || [];

    const today =
    new Date().toISOString().split("T")[0];

    // Pending Tasks
    const pendingTasks =
    tasks.filter(task => !task.done);

    if(pendingTasks.length > 0){

        createReminder(
            "📌 You still have " +
            pendingTasks.length +
            " unfinished task(s).",
            notifications
        );

    }

    // Today's Events
    events.forEach(event=>{

        if(event.date === today){

            createReminder(

                "📅 Event today: " +

                event.title,

                notifications

            );

        }

    });

    // Goals
    goals.forEach(goal=>{

        if(!goal.done){

            createReminder(

                "🎯 Goal Reminder: " +

                goal.text,

                notifications

            );

        }

    });

}

function createReminder(message, notifications){

    const exists = notifications.find(

        note => note.text === message

    );

    if(exists) return;

    notifications.unshift({

        id: Date.now(),

        type: "Reminder",

        text: message,

        read: false,

        time: new Date().toLocaleString()

    });

    localStorage.setItem(

        "notifications",

        JSON.stringify(notifications)

    );

}
