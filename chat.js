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
// Normal AI
// ==========================

let answer = await smartAIReply(msg);

if(answer){

    addMessage("ai", answer);

    return;

}

addMessage("ai","🤖 I'm still learning.");

}
