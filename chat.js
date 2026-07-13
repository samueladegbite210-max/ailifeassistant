// =====================================
// AI Life Assistant Chat v2.0
// Part 1 - Setup
// =====================================

// Elements
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

// Add a message to the chat
function addMessage(type, text){

    chat.innerHTML += `
    <div class="message ${type}">
        ${text}
    </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// Send message
function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    addMessage("user", text);

    input.value = "";

    setTimeout(function(){

        aiReply(text);

    },600);

}

// Press Enter to Send
input.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        sendMessage();

    }

});
// =====================================
// Part 2 - AI Brain
// =====================================

function aiReply(text){

    const msg = text.toLowerCase();

    let reply = "";

    // Greetings
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

        // Open Tasks
else if(msg.includes("open tasks")){
    reply = "✅ Opening your Tasks...";
    addMessage("ai", reply);

    setTimeout(function(){
        window.location.href = "tasks.html";
    },1000);

    return;
}

// Open Goals
else if(msg.includes("open goals")){
    reply = "🎯 Opening your Goals...";
    addMessage("ai", reply);

    setTimeout(function(){
        window.location.href = "goals.html";
    },1000);

    return;
}

// Open Calendar
else if(msg.includes("open calendar")){
    reply = "📅 Opening your Calendar...";
    addMessage("ai", reply);

    setTimeout(function(){
        window.location.href = "calendar.html";
    },1000);

    return;
}

// Open Notes
else if(msg.includes("open notes")){
    reply = "📝 Opening your Notes...";
    addMessage("ai", reply);

    setTimeout(function(){
        window.location.href = "notes.html";
    },1000);

    return;
}

// Open Profile
else if(msg.includes("open profile")){
    reply = "👤 Opening your Profile...";
    addMessage("ai", reply);

    setTimeout(function(){
        window.location.href = "profile.html";
    },1000);

    return;
}
    // Motivation
    else if(msg.includes("motivate me")){
        reply = "💙 Don't give up. Small progress every day leads to big success.";
    }

    // Thank you
    else if(
        msg.includes("thank") ||
        msg.includes("thanks")
    ){
        reply = "😊 You're welcome!";
    }

    else{
        reply = "🤖 I'm still learning. More AI features are coming soon!";
    }

    addMessage("ai", reply);

}
