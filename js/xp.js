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

    let newLevel = Math.floor(xpData.xp / 100) + 1;

    let levelUp = false;

    if(newLevel > xpData.level){

        xpData.level = newLevel;

        levelUp = true;

    }

    saveXP();

if(levelUp){

    return "🎉 Level Up!\n\n⭐ XP: " + xpData.xp +
           "\n🏆 Level: " + xpData.level;

}

    return "⭐ +" + amount + " XP\n\n⭐ Total XP: " +
           xpData.xp +
           "\n🏆 Level: " +
           xpData.level;

}

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
