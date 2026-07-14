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

// Home
else if(
    msg.includes("open home") ||
    msg.includes("go home") ||
    msg.includes("dashboard")
){

    reply = "🏠 Opening Home...";

    addMessage("ai", reply);

    setTimeout(function(){

        window.location.href = "dashboard.html";

    },1000);

    return;

}

// Tasks
else if(
    msg.includes("open task") ||
    msg.includes("open tasks") ||
    msg.includes("go to tasks")
){

    reply = "✅ Opening Tasks...";

    addMessage("ai", reply);

    setTimeout(function(){

        window.location.href = "tasks.html";

    },1000);

    return;

}

// Goals
else if(
    msg.includes("open goal") ||
    msg.includes("open goals")
){

    reply = "🎯 Opening Goals...";

    addMessage("ai", reply);

    setTimeout(function(){

        window.location.href = "goals.html";

    },1000);

    return;

}

// Notes
else if(
    msg.includes("open note") ||
    msg.includes("open notes")
){

    reply = "📝 Opening Notes...";

    addMessage("ai", reply);

    setTimeout(function(){

        window.location.href = "notes.html";

    },1000);

    return;

}

// Calendar
else if(
    msg.includes("open calendar")
){

    reply = "📅 Opening Calendar...";

    addMessage("ai", reply);

    setTimeout(function(){

        window.location.href = "calendar.html";

    },1000);

    return;

}

// Profile
else if(
    msg.includes("open profile")
){

    reply = "👤 Opening Profile...";

    addMessage("ai", reply);

    setTimeout(function(){

        window.location.href = "profile.html";

    },1000);

    return;

}
  // ======================
// Create Task
// ======================

else if(
    msg.startsWith("create a task called ") ||
    msg.startsWith("add a task called ")
){

    let taskName = text;

    taskName = taskName.replace(/create a task called /i,"");
    taskName = taskName.replace(/add a task called /i,"");

    taskName = taskName.trim();

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
 // ======================
// Create Goal
// ======================

else if(
    msg.startsWith("create a goal called ") ||
    msg.startsWith("add a goal called ")
){

    let goalName = text;

    goalName = goalName.replace(/create a goal called /i,"");
    goalName = goalName.replace(/add a goal called /i,"");

    goalName = goalName.trim();

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
    // ======================
// Create Note
// ======================

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
// Create Event
// ======================

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
    // ======================
// Show Tasks
// ======================

else if(
    msg.includes("show my tasks") ||
    msg.includes("list my tasks") ||
    msg.includes("show tasks")
){

    if(tasks.length===0){

        reply="✅ You don't have any tasks.";

    }else{

        reply="✅ <strong>Your Tasks</strong><br><br>";

        tasks.forEach(function(task,index){

            reply+=
            (task.done?"✅ ":"⬜ ")+
            (index+1)+". "+
            task.text+
            "<br>";

        });

    }

}
    // ======================
// Show Goals
// ======================

else if(
    msg.includes("show my goals") ||
    msg.includes("list my goals") ||
    msg.includes("show goals")
){

    if(goals.length===0){

        reply="🎯 You don't have any goals.";

    }else{

        reply="🎯 <strong>Your Goals</strong><br><br>";

        goals.forEach(function(goal,index){

            reply+=
            (goal.done?"✅ ":"⬜ ")+
            (index+1)+". "+
            goal.text+
            "<br>";

        });

    }

}
    // ======================
// Show Notes
// ======================

else if(
    msg.includes("show my notes") ||
    msg.includes("show notes")
){

    if(notes.trim()===""){

        reply="📝 No notes found.";

    }else{

        reply=
        "<strong>📝 Your Notes</strong><br><br>"+
        notes.replace(/\n/g,"<br>");

    }

}
   // ======================
// Show Events
// ======================

else if(
    msg.includes("show my events") ||
    msg.includes("show events")
){

    if(events.length===0){

        reply="📅 No events found.";

    }else{

        reply="<strong>📅 Your Events</strong><br><br>";

        events.forEach(function(event,index){

            reply+=
            (index+1)+". "+
            event.title+
            "<br>"+

            "📆 "+event.date+

            "<br><br>";

        });

    }

} 
    // ======================
// Count Tasks
// ======================

else if(
    msg.includes("how many tasks") ||
    msg.includes("task count")
){

    reply = "✅ You currently have " + tasks.length + " task(s).";

}
    // ======================
// Count Goals
// ======================

else if(
    msg.includes("how many goals") ||
    msg.includes("goal count")
){

    reply = "🎯 You currently have " + goals.length + " goal(s).";

}
    // ======================
// Count Notes
// ======================

else if(
    msg.includes("how many notes") ||
    msg.includes("note count")
){

    if(notes.trim()==""){

        reply="📝 You don't have any notes.";

    }else{

        const total = notes.split("\n\n").length;

        reply="📝 You currently have "+total+" note(s).";

    }

}
    // ======================
// Count Events
// ======================

else if(
    msg.includes("how many events") ||
    msg.includes("event count")
){

    reply="📅 You currently have "+events.length+" event(s).";

}
    // ======================
// Next Event
// ======================

else if(
    msg.includes("next event") ||
    msg.includes("upcoming event")
){

    if(events.length===0){

        reply="📅 You don't have any upcoming events.";

    }else{

        const event=events[0];

        reply=
        "📅 <strong>Next Event</strong><br><br>"+
        "📝 "+event.title+"<br>"+
        "📆 "+event.date+"<br>"+
        "🕒 "+event.time+"<br>"+
        "📍 "+event.location;

    }

}
else{

        reply="🤖 I'm still learning. More AI features are coming soon!";

    }

    addMessage("ai",reply);

}
