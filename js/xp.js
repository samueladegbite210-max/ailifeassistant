alert("⭐ XP System Loaded");

let xpData = JSON.parse(localStorage.getItem("xpData")) || {

    xp: 0,
    level: 1

};

function saveXP(){

    localStorage.setItem(
        "xpData",
        JSON.stringify(xpData)
    );

}

function addXP(amount){

    xpData.xp += amount;

    let newLevel = Math.floor(xpData.xp / 20) + 1;

    let levelUp = false;

    if(newLevel > xpData.level){

        xpData.level = newLevel;

        levelUp = true;

    }

    saveXP();

let achievementMessage = checkAchievements();

if(levelUp){

    let reply =
        "🎉 Level Up!\n\n" +
        "⭐ XP: " + xpData.xp +
        "\n🏆 Level: " + xpData.level;

    if(achievementMessage){

        reply += "\n\n" + achievementMessage;

    }

    return reply;

}

    let reply =
    "⭐ +" + amount + " XP\n\n" +
    "⭐ Total XP: " + xpData.xp +
    "\n🏆 Level: " + xpData.level;

if(achievementMessage){

    reply += "\n\n" + achievementMessage;

}

return reply;
    
function showXP(){

    return "⭐ XP: " + xpData.xp +
           "\n🏆 Level: " + xpData.level;

}

function resetXP(){

    xpData.xp = 0;

    xpData.level = 1;

    saveXP();

    return "🔄 XP has been reset.";

}
