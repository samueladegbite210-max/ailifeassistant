alert("📊 Dashboard Loaded");

function updateDashboard(){

    // XP
    let xp = JSON.parse(localStorage.getItem("xp")) || {
        xp:0,
        level:1
    };

    // Streak
    let streak = JSON.parse(localStorage.getItem("streak")) || {
        days:0
    };

    // Notes
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Goals
    let goals = JSON.parse(localStorage.getItem("goals")) || [];

    // Events
    let events = JSON.parse(localStorage.getItem("events")) || [];

    if(document.getElementById("xpCount"))
        document.getElementById("xpCount").textContent = xp.xp;

    if(document.getElementById("levelCount"))
        document.getElementById("levelCount").textContent = xp.level;

    if(document.getElementById("streakCount"))
        document.getElementById("streakCount").textContent = streak.days;

    if(document.getElementById("noteCount"))
        document.getElementById("noteCount").textContent = notes.length;

    if(document.getElementById("taskCount"))
        document.getElementById("taskCount").textContent = tasks.length;

    if(document.getElementById("goalCount"))
        document.getElementById("goalCount").textContent = goals.length;

    if(document.getElementById("eventCount"))
        document.getElementById("eventCount").textContent = events.length;

}
