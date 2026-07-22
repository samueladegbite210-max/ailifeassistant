 // ================================
// AI Life Assistant 
// ================================

// Storage
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

// ================================
// Add Message
// ================================

function addMessage(type, text){

    chat.innerHTML += `
        <div class="message ${type}">
            ${text}
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// ================================
// Send Message
// ================================

function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    addMessage("user", text);

    input.value = "";

    aiReply(text);

}

// ================================
// Enter Key
// ================================

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});

// ================================
// Smart Intent Recognition
// ================================

function hasIntent(msg, phrases){

    return phrases.some(function(phrase){

        return msg.includes(phrase);

    });

}
function hasAny(msg, words){

    return words.some(function(word){
        return msg.includes(word);
    });

}
// ================================
// AI Brain
// ================================
async function aiReply(text){

    const msg = text.toLowerCase().trim();
const goals = JSON.parse(localStorage.getItem("goals")) || [];

const goalSummary = {
    total: goals.length,
    completed: goals.filter(g => g.done).length,
    pending: goals.filter(g => !g.done).length,
    goals: goals
};
// ==========================
// Calendar Data
// ==========================

const events = JSON.parse(localStorage.getItem("events")) || [];

const today = new Date().toISOString().split("T")[0];

const todayEvents = events.filter(function(event){

    return event.date === today;

});

const upcomingEvents = events.filter(function(event){

    return event.date >= today;

});
// ==========================
// Goal Summary
// ==========================

if (
    msg.includes("how many goals") ||
    msg.includes("goal summary")
){

    addMessage(
        "ai",
`📊 Goal Summary

🎯 Total Goals: ${goalSummary.total}
✅ Completed: ${goalSummary.completed}
⏳ Pending: ${goalSummary.pending}`
    );

    return;
}

// ==========================
// Show Goals
// ==========================

if (
    msg.includes("show my goals") ||
    msg.includes("list my goals")
){

    if(goalSummary.total === 0){

        addMessage("ai","You don't have any goals yet.");

        return;
    }

    let reply = "🎯 Your Goals:\n\n";

    goalSummary.goals.forEach(function(goal){

        reply += `${goal.done ? "✅" : "🎯"} ${goal.title || goal.text}\n`;

    });

    addMessage("ai", reply);

    return;
}
 // ==========================
// Pending Goals
// ==========================

if(
    msg.includes("pending goals") ||
    msg.includes("unfinished goals")
){

    const pending = goalSummary.goals.filter(g => !g.done);

    if(pending.length === 0){

        addMessage("ai","🎉 Congratulations! You have no pending goals.");

        return;

    }

    let reply = "⏳ Pending Goals:\n\n";

    pending.forEach(function(goal){

        reply += `🎯 ${goal.title || goal.text}\n`;

    });

    addMessage("ai", reply);

    return;

}

 // ==========================
// Completed Goals
// ==========================

if(
    msg.includes("completed goals")
){

    const completed = goalSummary.goals.filter(g => g.done);

    if(completed.length === 0){

        addMessage("ai","You haven't completed any goals yet.");

        return;

    }

    let reply = "✅ Completed Goals:\n\n";

    completed.forEach(function(goal){

        reply += `✅ ${goal.title || goal.text}\n`;

    });

    addMessage("ai", reply);

    return;

}
 // ==========================
// Today's Events
// ==========================

if(
    msg.includes("today event") ||
    msg.includes("today's event") ||
    msg.includes("events today")
){

    if(todayEvents.length === 0){

        addMessage("ai","📅 You have no events scheduled for today.");

        return;

    }

    let reply = "📅 Today's Events:\n\n";

    todayEvents.forEach(function(event){

        reply += `📌 ${event.title}`;

        if(event.time){
            reply += ` (${event.time})`;
        }

        reply += "\n";

    });

    addMessage("ai", reply);

    return;

}
 // ==========================
// Upcoming Events
// ==========================

if(
    msg.includes("upcoming events") ||
    msg.includes("next event") ||
    msg.includes("show events")
){

    if(upcomingEvents.length === 0){

        addMessage("ai","📅 You have no upcoming events.");

        return;

    }

    let reply = "📅 Upcoming Events:\n\n";

    upcomingEvents.forEach(function(event){

        reply += `📌 ${event.title} - ${event.date}`;

        if(event.time){
            reply += ` ${event.time}`;
        }

        reply += "\n";

    });

    addMessage("ai", reply);

    return;

}
// ==========================
// Normal AI
// ==========================

let answer = await smartAIReply(msg);

if(answer){

    addMessage("ai", answer);

    return;

}

addMessage("ai","🤖 I'm still learning.");

}
