// ================================
// AI Life Assistant 
// ================================

// Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

// Elements
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
// AI Brain
// ================================

function aiReply(text){

    const msg = text.toLowerCase().trim();

    let reply = "🤖 I'm still learning.";

    // Greetings

    if(
        msg === "hi" ||
        msg === "hello" ||
        msg === "hey"
    ){

        reply = "👋 Hello Samuel! How can I help you today?";

    }

    else if(msg.includes("good morning")){

        reply = "🌅 Good morning, Samuel!";

    }

    else if(msg.includes("good afternoon")){

        reply = "☀️ Good afternoon, Samuel!";

    }

    else if(msg.includes("good evening")){

        reply = "🌇 Good evening, Samuel!";

    }

    else if(msg.includes("good night")){

        reply = "🌙 Good night, Samuel!";

    }

    else if(msg.includes("how are you")){

        reply = "😊 I'm doing great! How about you?";

    }

    else if(msg.includes("who are you")){

        reply = "🤖 I'm AI Life Assistant, your personal AI companion.";

    }

    else if(msg.includes("who made you")){

        reply = "💙 I was built by Samuel with the help of ChatGPT.";

    }

    else if(msg.includes("what can you do")){

        reply = "🚀 I can help with coding, studying, planning, notes, tasks, goals and much more.";

    }

    else if(msg.includes("what is html")){

        reply = "🌐 HTML stands for HyperText Markup Language. It builds the structure of websites.";

    }

    else if(msg.includes("what is css")){

        reply = "🎨 CSS styles websites using colors, layouts and animations.";

    }

    else if(msg.includes("what is javascript")){

        reply = "💻 JavaScript makes websites interactive.";

    }

    else if(
        msg.includes("what is ai") ||
        msg.includes("artificial intelligence")
    ){

        reply = "🤖 Artificial Intelligence enables computers to learn, reason and solve problems.";

    }
    else if(

    msg.includes("i need to") ||
    msg.includes("remind me to") ||
    msg.includes("don't let me forget to")

){

    let taskName = text;

    taskName = taskName
        .replace(/i need to/i,"")
        .replace(/remind me to/i,"")
        .replace(/don't let me forget to/i,"")
        .trim();

    tasks.push({
        id: Date.now(),
        text: taskName,
        done: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    reply = "✅ I've created a task: \"" + taskName + "\"";

}

// ================================
// Create Task
// ================================

else if(msg.startsWith("create a task called ")){

    let taskName = text.replace(/create a task called /i,"").trim();

    if(taskName === ""){

        reply = "❌ Please enter a task name.";

    }else{

        tasks.push({
            id: Date.now(),
            text: taskName,
            done: false
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        reply = "✅ Task \"" + taskName + "\" created successfully!";

    }

}

// ================================
// Show Tasks
// ================================

else if(

    msg.includes("show my tasks") ||
    msg.includes("show tasks") ||
    msg.includes("list my tasks") ||
    msg.includes("list tasks")

){

    if(tasks.length === 0){

        reply = "📋 You don't have any tasks.";

    }else{

        reply = "📋 <strong>Your Tasks</strong><br><br>";

        tasks.forEach(function(task,index){

            reply +=
            (task.done ? "✅ " : "⬜ ") +
            (index + 1) +
            ". " +
            task.text +
            "<br>";

        });

    }

}

// ================================
// Task Count
// ================================

else if(

    msg.includes("how many tasks") ||
    msg.includes("task count")

){

    reply = "📋 You currently have " + tasks.length + " task(s).";

}
// ================================
// Create Goal
// ================================

else if(msg.startsWith("create a goal called ")){

    let goalName = text.replace(/create a goal called /i,"").trim();

    if(goalName === ""){

        reply = "❌ Please enter a goal.";

    }else{

        goals.push({
            id: Date.now(),
            text: goalName,
            done: false
        });

        localStorage.setItem("goals", JSON.stringify(goals));

        reply = "🎯 Goal \"" + goalName + "\" created successfully!";

    }

}

// ================================
// Show Goals
// ================================

else if(

    msg.includes("show my goals") ||
    msg.includes("show goals") ||
    msg.includes("list my goals") ||
    msg.includes("list goals")

){

    if(goals.length === 0){

        reply = "🎯 You don't have any goals.";

    }else{

        reply = "🎯 <strong>Your Goals</strong><br><br>";

        goals.forEach(function(goal,index){

            reply +=
            (goal.done ? "✅ " : "⬜ ") +
            (index + 1) +
            ". " +
            goal.text +
            "<br>";

        });

    }

}

// ================================
// Goal Count
// ================================

else if(

    msg.includes("how many goals") ||
    msg.includes("goal count")

){

    reply = "🎯 You currently have " + goals.length + " goal(s).";

}
  // ======================
// Create Note
// ======================
else if(

    msg.includes("i have") &&
    (
        msg.includes("tomorrow") ||
        msg.includes("today") ||
        msg.includes("monday") ||
        msg.includes("tuesday") ||
        msg.includes("wednesday") ||
        msg.includes("thursday") ||
        msg.includes("friday") ||
        msg.includes("saturday") ||
        msg.includes("sunday")
    )

){

    events.push({

        title: text,

        date: new Date().toISOString().split("T")[0],

        time: "",

        location: "",

        notes: "",

        reminder: "none",

        repeat: "none"

    });

    localStorage.setItem("events", JSON.stringify(events));

    reply = "📅 I've added that to your events.";

}
else if(
    msg.startsWith("create a note called ") ||
    msg.startsWith("save a note called ") ||
    msg.startsWith("add a note called ")
){

    let noteText = text;

    noteText = noteText.replace(/create a note called /i,"");
    noteText = noteText.replace(/save a note called /i,"");
    noteText = noteText.replace(/add a note called /i,"");

    noteText = noteText.trim();

    let currentNotes = localStorage.getItem("notes") || "";

    if(currentNotes !== ""){
        currentNotes += "\n\n";
    }

    currentNotes += noteText;

    localStorage.setItem("notes", currentNotes);

    reply = "📝 Note saved successfully!";

}

// ======================
// Show Notes
// ======================

else if(
    msg.includes("show my note") ||
    msg.includes("show my notes") ||
    msg.includes("show note") ||
    msg.includes("show notes") ||
    msg.includes("list my notes")
){

    let notes = localStorage.getItem("notes") || "";

    if(notes.trim() === ""){

        reply = "📝 No notes found.";

    }else{

        reply =
        "<strong>📝 Your Notes</strong><br><br>" +
        notes.replace(/\n/g,"<br>");

    }

}

// ======================
// Count Notes
// ======================

else if(
    msg.includes("how many notes") ||
    msg.includes("note count")
){

    let notes = localStorage.getItem("notes") || "";

    if(notes.trim() === ""){

        reply = "📝 You don't have any notes.";

    }else{

        const total = notes.split("\n\n").length;

        reply = "📝 You currently have " + total + " note(s).";

    }

}

// ======================
// Search Notes
// ======================

else if(msg.startsWith("search notes for ")){

    let notes = localStorage.getItem("notes") || "";

    const keyword = msg.replace("search notes for ","").trim();

    if(notes.toLowerCase().includes(keyword.toLowerCase())){

        reply =
        "<strong>📝 Found in Notes</strong><br><br>" +
        notes.replace(/\n/g,"<br>");

    }else{

        reply = "❌ No matching notes found.";

    }

}
    // ================================
// Create Event
// ================================

else if(
    msg.startsWith("create an event called ") ||
    msg.startsWith("add an event called ")
){

    let eventTitle = text;

    eventTitle = eventTitle.replace(/create an event called /i,"");
    eventTitle = eventTitle.replace(/add an event called /i,"");

    eventTitle = eventTitle.trim();

    events.push({

        title: eventTitle,
        date: new Date().toISOString().split("T")[0],
        time: "",
        location: "",
        notes: "",
        reminder: "none",
        repeat: "none"

    });

    localStorage.setItem("events", JSON.stringify(events));

    reply = "📅 Event \"" + eventTitle + "\" created successfully!";

}

// ================================
// Show Events
// ================================

else if(

    msg.includes("show my event") ||
    msg.includes("show my events") ||
    msg.includes("show event") ||
    msg.includes("show events") ||
    msg.includes("list my events")

){

    if(events.length === 0){

        reply = "📅 No events found.";

    }else{

        reply = "📅 <strong>Your Events</strong><br><br>";

        events.forEach(function(event,index){

            reply +=
                (index + 1) + ". " +
                event.title +
                "<br>" +
                "📆 " + event.date +
                "<br><br>";

        });

    }

}

// ================================
// Event Count
// ================================

else if(

    msg.includes("how many events") ||
    msg.includes("event count")

){

    reply = "📅 You currently have " + events.length + " event(s).";

}

// ================================
// Next Event
// ================================

else if(

    msg.includes("next event") ||
    msg.includes("upcoming event")

){

    if(events.length === 0){

        reply = "📅 You don't have any upcoming events.";

    }else{

        const event = events[0];

        reply =
        "📅 <strong>Next Event</strong><br><br>" +
        "📝 " + event.title + "<br>" +
        "📆 " + event.date + "<br>" +
        "🕒 " + (event.time || "No time") + "<br>" +
        "📍 " + (event.location || "No location");

    }

}

// ================================
// Search Events
// ================================

else if(msg.startsWith("search events for ")){

    const keyword = msg.replace("search events for ","").trim();

    const results = events.filter(function(event){

        return event.title.toLowerCase().includes(keyword.toLowerCase());

    });

    if(results.length === 0){

        reply = "❌ No matching events found.";

    }else{

        reply = "📅 <strong>Matching Events</strong><br><br>";

        results.forEach(function(event,index){

            reply +=
                (index + 1) + ". " +
                event.title +
                "<br>" +
                "📆 " + event.date +
                "<br><br>";

        });

    }

}
    addMessage("ai", reply);

}
