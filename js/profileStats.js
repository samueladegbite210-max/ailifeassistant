alert("👤 Profile Stats Loaded");

function showProfileStats(){

    let memory = JSON.parse(localStorage.getItem("memory")) || {};

    let xpData = JSON.parse(localStorage.getItem("xpData")) || {

        xp:0,
        level:1

    };

    let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

    let reply = "👤 PROFILE\n\n";

    if(memory.name){

        reply += "👤 Name: " + memory.name + "\n";

    }

    if(memory.job){

        reply += "💼 Job: " + memory.job + "\n";

    }

    if(memory.city){

        reply += "📍 City: " + memory.city + "\n";

    }

    reply += "\n";

    reply += "⭐ XP: " + xpData.xp + "\n";

    reply += "🏆 Level: " + xpData.level + "\n";

    reply += "🏅 Achievements: " + achievements.length + "\n";

    return reply;

}
