alert("🔥 Streak System Loaded");

let streak = JSON.parse(localStorage.getItem("streak")) || {
    days: 0,
    lastVisit: ""
};

function saveStreak(){

    localStorage.setItem(
        "streak",
        JSON.stringify(streak)
    );

}

function updateStreak(){

    const today = new Date().toDateString();

    if(streak.lastVisit === ""){

        streak.days = 1;
        streak.lastVisit = today;

        saveStreak();

        return "🔥 Welcome!\n\nYou've started a 1 day streak.";

    }

    const last = new Date(streak.lastVisit);

    const now = new Date(today);

    const diff = Math.floor(
        (now - last)/(1000*60*60*24)
    );

    if(diff === 1){

        streak.days++;

        streak.lastVisit = today;

        saveStreak();

        return "🔥 Daily Streak!\n\nCurrent Streak: " + streak.days + " days.";

    }

    if(diff > 1){

        streak.days = 1;

        streak.lastVisit = today;

        saveStreak();

        return "😢 You missed a day.\n\nYour streak has restarted.";

    }

    return null;

}

function showStreak(){

    return "🔥 Current Streak\n\n" +
           streak.days +
           " day(s)";
}
