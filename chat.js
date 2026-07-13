// =====================================
// AI Life Assistant v3.0
// Chat System
// =====================================

// Elements
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

// Add Message
function addMessage(type, text){

    chat.innerHTML += `
        <div class="message ${type}">
            ${text}
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// Send Message
function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    addMessage("user", text);

    input.value = "";

    setTimeout(function(){

        aiReply(text);

    },500);

}

// Press Enter
input.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        sendMessage();

    }

});
// =====================================
// AI Brain
// =====================================

function aiReply(text){

    const msg = text.toLowerCase();

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const notes = localStorage.getItem("notes") || "";

    let reply = "";

    // Greetings
    if(msg.includes("hello") || msg.includes("hi")){

        reply = "👋 Hello Samuel! How can I help you today?";

    }

    else if(msg.includes("good morning")){

        reply = "🌅 Good morning! Have a productive day.";

    }

    else{

        reply = "🤖 AI Brain v3.0 is ready!";

    }

    addMessage("ai", reply);

}
