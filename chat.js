// =======================================
// AI Life Assistant v3.0
// Chat System
// =======================================

const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

// ======================
// Add Message
// ======================

function addMessage(type, text){

    chat.innerHTML += `
        <div class="message ${type}">
            ${text}
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// ======================
// Send Message
// ======================

function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    addMessage("user", text);

    input.value = "";

    setTimeout(function(){

        aiReply(text);

    },500);

}

// ======================
// Enter Key
// ======================

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});
// =======================================
// AI Brain
// =======================================

function aiReply(text){

    const msg = text.toLowerCase();

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const notes = localStorage.getItem("notes") || "";

    let reply = "";

    // ======================
    // Greetings
    // ======================

    if(
        msg.includes("hello") ||
        msg.includes("hi")
    ){

        reply = "👋 Hello Samuel! How can I help you today?";

    }

    else if(msg.includes("good morning")){

        reply = "🌅 Good morning! Have a productive day.";

    }

    else if(msg.includes("good afternoon")){

        reply = "☀️ Good afternoon!";

    }

    else if(msg.includes("good evening")){

        reply = "🌇 Good evening!";

    }

    else if(msg.includes("good night")){

        reply = "🌙 Good night. Sleep well.";

    }

    // ======================
    // Navigation
    // ======================

    else if(
        msg.includes("open home") ||
        msg.includes("go home") ||
        msg.includes("dashboard")
    ){

        reply="🏠 Opening Home...";

        addMessage("ai",reply);

        setTimeout(function(){

            window.location.href="dashboard.html";

        },1000);

        return;

    }

    else if(
        msg.includes("open task") ||
        msg.includes("open tasks") ||
        msg.includes("go to tasks")
    ){

        reply="✅ Opening Tasks...";

        addMessage("ai",reply);

        setTimeout(function(){

            window.location.href="tasks.html";

        },1000);

        return;

    }

    else if(
        msg.includes("open goal") ||
        msg.includes("open goals")
    ){

        reply="🎯 Opening Goals...";

        addMessage("ai",reply);

        setTimeout(function(){

            window.location.href="goals.html";

        },1000);

        return;

    }

    else if(
        msg.includes("open calendar")
    ){

        reply="📅 Opening Calendar...";

        addMessage("ai",reply);

        setTimeout(function(){

            window.location.href="calendar.html";

        },1000);

        return;

    }

    else if(
        msg.includes("open note") ||
        msg.includes("open notes")
    ){

        reply="📝 Opening Notes...";

        addMessage("ai",reply);

        setTimeout(function(){

            window.location.href="notes.html";

        },1000);

        return;

    }

    else if(
        msg.includes("open profile")
    ){

        reply="👤 Opening Profile...";

        addMessage("ai",reply);

        setTimeout(function(){

            window.location.href="profile.html";

        },1000);

        return;

    }

    else{

        reply="🤖 I'm still learning. More AI features are coming soon!";

    }

    addMessage("ai",reply);

}
