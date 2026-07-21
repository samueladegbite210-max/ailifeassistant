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
const goalSummary = getGoalSummary();
 // ==========================
// Goal Summary
// ==========================

if (
    msg.includes("how many goals") ||
    msg.includes("goal summary")
){

    aiReply(
`📊 Goal Summary

🎯 Total Goals: ${goalSummary.total}
✅ Completed: ${goalSummary.completed}
⏳ Pending: ${goalSummary.pending}`
    );

    return;
}
 if (
    msg.includes("show my goals") ||
    msg.includes("list my goals")
){

    if(goalSummary.total === 0){

        aiReply("You don't have any goals yet.");

        return;
    }

    let text = "🎯 Your Goals:\n\n";

    goalSummary.goals.forEach(function(goal){

        text += `${goal.done ? "✅" : "🎯"} ${goal.title}\n`;

    });

    aiReply(text);

    return;
}
    let answer = await smartAIReply(msg);

    if(answer){
        addMessage("ai", answer);
        return;
    }

    addMessage("ai","🤖 I'm still learning.");

}
    window.addEventListener("load", function () {
    startVoiceRecognition();
});
 function startVoiceRecognition(){

    if(!("webkitSpeechRecognition" in window)){
        alert("❌ Your browser doesn't support voice recognition.");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event){

        const text = event.results[0][0].transcript;

        input.value = text;

        sendMessage();

    };

    recognition.start();

}
