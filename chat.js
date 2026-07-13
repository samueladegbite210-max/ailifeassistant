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

    // Load saved data
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

    else if(msg.includes("good afternoon")){
        reply = "☀️ Good afternoon!";
    }

    else if(msg.includes("good evening")){
        reply = "🌇 Good evening!";
    }

    else if(msg.includes("good night")){
        reply = "🌙 Good night. Sleep well.";
    }

    // Open Home
    else if(msg.includes("open home") || msg.includes("dashboard")){
        reply = "🏠 Opening Home...";
        addMessage("ai", reply);

        setTimeout(function(){
            window.location.href = "dashboard.html";
        },1000);

        return;
    }

    // Open Tasks
    else if(msg.includes("open task") || msg.includes("open tasks")){
        reply = "✅ Opening your Tasks...";
        addMessage("ai", reply);

        setTimeout(function(){
            window.location.href = "tasks.html";
        },1000);

        return;
    }
else if(
    msg.includes("how many goals") ||
    msg.includes("goal count") ||
    msg.includes("my goals")
){

    if(goals.length === 0){

        reply = "🎯 You don't have any goals yet.";

    }else{

        reply = "🎯 You currently have " + goals.length + " goal(s).";

    }

}
    else if(
    msg.includes("how many events") ||
    msg.includes("event count")
){

    if(events.length === 0){

        reply = "📅 You don't have any upcoming events.";

    }else{

        reply = "📅 You currently have " + events.length + " event(s).";

    }

}
    // Open Goals
    else if(msg.includes("open goal") || msg.includes("open goals")){
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
    else if(msg.includes("open note") || msg.includes("open notes")){
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

    // Notes Count
    else if(msg.includes("how many notes") || msg.includes("note count")){

        if(notes.trim() === ""){
            reply = "📝 You don't have any notes yet.";
        }else{

            const words = notes.trim().split(/\s+/).length;

            reply = "📝 You currently have 1 note with about " + words + " words.";

        }

    }

    // Next Event
    else if(
        msg.includes("next event") ||
        msg.includes("my next event") ||
        msg.includes("upcoming event")
    ){

        if(events.length === 0){

            reply = "📅 You don't have any upcoming events.";

        }else{

            const event = events[0];

            reply =
            "📅 Your next event is:<br><br>" +
            "📝 " + event.title + "<br>" +
            "📆 " + event.date + "<br>" +
            "🕒 " + event.time + "<br>" +
            "📍 " + event.location;

        }

    }

    // Motivation
    else if(msg.includes("motivate me")){
        reply = "💙 Don't give up. Small progress every day leads to big success.";
    }

    // Thank You
    else if(msg.includes("thank") || msg.includes("thanks")){
        reply = "😊 You're welcome!";
    }

// Create Task
else if(msg.startsWith("create a task called ")){

    const taskName = text.replace(/create a task called /i, "").trim();

    if(taskName === ""){

        reply = "❌ Please enter a task name.";

    }else{

        tasks.push({
            id: Date.now(),
            text: taskName,
            priority: "Medium",
            done: false
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        reply = "✅ Task \"" + taskName + "\" created successfully!";

    }

}
// Keep this LAST

else{
    reply = "🤖 I'm still learning. More AI features are coming soon!";
}

addMessage("ai", reply);

}
