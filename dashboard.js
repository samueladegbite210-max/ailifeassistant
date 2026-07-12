// ========================================
// AI LIFE ASSISTANT
// Version 2.5
// ========================================

// ---------- USER ----------

const username =
localStorage.getItem("profileName") || "Samuel";


// ---------- DATE & TIME ----------

function updateDateTime(){

    const now = new Date();

    const date =
    document.getElementById("todayDate");

    const time =
    document.getElementById("currentTime");

    if(date){

        date.textContent =
        now.toDateString();

    }

    if(time){

        time.textContent =
        now.toLocaleTimeString([],{

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit"

        });

    }

}

setInterval(updateDateTime,1000);

updateDateTime();


// ---------- GREETING ----------

function updateGreeting(){

    const welcome = document.getElementById("welcomeText");
    const assistant = document.getElementById("assistantMessage");

    if(!welcome) return;

    const hour = new Date().getHours();

    let greeting = "";

    if(hour >= 5 && hour < 12){

        greeting = "🌅 Good Morning";

    }else if(hour >= 12 && hour < 17){

        greeting = "☀️ Good Afternoon";

    }else if(hour >= 17 && hour < 21){

        greeting = "🌇 Good Evening";

    }else{

        greeting = "🌙 Good Night";

    }

    assistant.innerHTML = `
📅 Today is a brand-new opportunity.<br><br>

I'm here to help you manage your tasks, goals, and events.

💙 Let's make today productive together!
`;

    }

}

updateGreeting();
