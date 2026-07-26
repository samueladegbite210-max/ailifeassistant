alert("🏅 Achievement System Loaded");

let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

function saveAchievements(){

    localStorage.setItem(
        "achievements",
        JSON.stringify(achievements)
    );

}

function unlockAchievement(name){

    if(!achievements.includes(name)){

        achievements.push(name);

        saveAchievements();

        return "🏆 Achievement Unlocked!\n\n" + name;

    }

    return null;

}

function checkAchievements(){

    let unlocked = "";

    if(xpData.level >= 5){

        let a = unlockAchievement("🥉 Bronze Learner");

        if(a) unlocked += a + "\n\n";

    }

    if(xpData.level >= 10){

        let a = unlockAchievement("🥈 Silver Learner");

        if(a) unlocked += a + "\n\n";

    }

    if(xpData.level >= 20){

        let a = unlockAchievement("🥇 Gold Learner");

        if(a) unlocked += a + "\n\n";

    }

    return unlocked;

}

function showAchievements(){

    if(achievements.length === 0){

        return "🏅 No achievements yet.";

    }

    let reply = "🏅 Your Achievements\n\n";

    achievements.forEach(function(item){

        reply += "• " + item + "\n";

    });

    return reply;

}
