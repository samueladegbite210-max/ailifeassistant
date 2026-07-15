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
    msg === "hi" ||
    msg === "hello" ||
    msg.startsWith("hi ") ||
    msg.startsWith("hello ")
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
    // ======================
// Complete Task
// ======================

else if(msg.startsWith("complete task ")){

    const number = parseInt(msg.replace("complete task ",""));

    if(isNaN(number) || number < 1 || number > tasks.length){

        reply = "❌ Task not found.";

    }else{

        tasks[number - 1].done = true;

        localStorage.setItem("tasks", JSON.stringify(tasks));

        reply = "✅ Task " + number + " completed.";

    }

}
    // ======================
// Complete Goal
// ======================

else if(msg.startsWith("complete goal ")){

    const number = parseInt(msg.replace("complete goal ",""));

    if(isNaN(number) || number < 1 || number > goals.length){

        reply = "❌ Goal not found.";

    }else{

        goals[number - 1].done = true;

        localStorage.setItem("goals", JSON.stringify(goals));

        reply = "🎯 Goal " + number + " completed.";

    }

}
    // ======================
// Delete Task
// ======================

else if(msg.startsWith("delete task ")){

    const number = parseInt(msg.replace("delete task ",""));

    if(isNaN(number) || number < 1 || number > tasks.length){

        reply = "❌ Task not found.";

    }else{

        const deleted = tasks.splice(number - 1, 1);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        reply = "🗑️ Deleted task: " + deleted[0].text;

    }

}
    // ======================
// Delete Goal
// ======================

else if(msg.startsWith("delete goal ")){

    const number = parseInt(msg.replace("delete goal ",""));

    if(isNaN(number) || number < 1 || number > goals.length){

        reply = "❌ Goal not found.";

    }else{

        const deleted = goals.splice(number - 1, 1);

        localStorage.setItem("goals", JSON.stringify(goals));

        reply = "🗑️ Deleted goal: " + deleted[0].text;

    }

}
    // ======================
// Search Tasks
// ======================

else if(msg.startsWith("search tasks for ")){

    const keyword = msg.replace("search tasks for ","").trim();

    const results = tasks.filter(task =>
        task.text.toLowerCase().includes(keyword)
    );

    if(results.length === 0){

        reply = "❌ No matching tasks found.";

    }else{

        reply = "✅ <strong>Matching Tasks</strong><br><br>";

        results.forEach(function(task,index){

            reply +=
            (task.done ? "✅ " : "⬜ ") +
            (index+1) + ". " +
            task.text + "<br>";

        });

    }

}
    // ======================
// Search Goals
// ======================

else if(msg.startsWith("search goals for ")){

    const keyword = msg.replace("search goals for ","").trim();

    const results = goals.filter(goal =>
        goal.text.toLowerCase().includes(keyword)
    );

    if(results.length === 0){

        reply = "❌ No matching goals found.";

    }else{

        reply = "🎯 <strong>Matching Goals</strong><br><br>";

        results.forEach(function(goal,index){

            reply +=
            (goal.done ? "✅ " : "⬜ ") +
            (index+1) + ". " +
            goal.text + "<br>";

        });

    }

}
    // ======================
// Search Notes
// ======================

else if(msg.startsWith("search notes for ")){

    const keyword = msg.replace("search notes for ","").trim();

    if(notes.toLowerCase().includes(keyword)){

        reply =
        "📝 <strong>Found in Notes</strong><br><br>" +
        notes.replace(/\n/g,"<br>");

    }else{

        reply = "❌ No matching notes found.";

    }

}
    // ======================
// Search Events
// ======================

else if(msg.startsWith("search events for ")){

    const keyword = msg.replace("search events for ","").trim();

    const results = events.filter(event =>
        event.title.toLowerCase().includes(keyword)
    );

    if(results.length === 0){

        reply = "❌ No matching events found.";

    }else{

        reply = "📅 <strong>Matching Events</strong><br><br>";

        results.forEach(function(event,index){

            reply +=
            (index+1)+". "+
            event.title+
            "<br>📆 "+
            event.date+
            "<br><br>";

        });

    }

}
    // ======================
// Rename Task
// ======================

else if(msg.startsWith("rename task ")){

    const parts = text.match(/rename task (\d+) to (.+)/i);

    if(!parts){

        reply = "❌ Use: Rename task 1 to Finish assignment";

    }else{

        const taskNumber = parseInt(parts[1]);
        const newName = parts[2].trim();

        if(taskNumber < 1 || taskNumber > tasks.length){

            reply = "❌ Task not found.";

        }else{

            tasks[taskNumber - 1].text = newName;

            localStorage.setItem("tasks", JSON.stringify(tasks));

            reply = "✏️ Task " + taskNumber + " renamed to \"" + newName + "\".";

        }

    }

}
    // ======================
// Change Task Priority
// ======================

else if(msg.startsWith("set task ")){

    const parts = text.match(/set task (\d+) priority to (high|medium|low)/i);

    if(!parts){

        reply = "❌ Use: Set task 1 priority to High";

    }else{

        const taskNumber = parseInt(parts[1]);
        const priority = parts[2];

        if(taskNumber < 1 || taskNumber > tasks.length){

            reply = "❌ Task not found.";

        }else{

            tasks[taskNumber - 1].priority =
            priority.charAt(0).toUpperCase() +
            priority.slice(1).toLowerCase();

            localStorage.setItem("tasks", JSON.stringify(tasks));

            reply =
            "⭐ Task " +
            taskNumber +
            " priority changed to " +
            tasks[taskNumber - 1].priority + ".";

        }

    }

}
   
// Complete Task By Name
// =========================

else if(
    msg.startsWith("finish ") ||
    msg.startsWith("complete ")
){

    let taskName = msg
        .replace("finish ", "")
        .replace("complete ", "")
        .trim();

    let found = false;

    tasks.forEach(function(task){

        if(task.text.toLowerCase().includes(taskName)){

            task.done = true;
            found = true;

        }

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    if(found){

        reply = "✅ Task completed!";

    }else{

        reply = "❌ I couldn't find that task.";

    }

}
    // =========================
// Delete Task By Name
// =========================

else if(
    msg.startsWith("delete ") ||
    msg.startsWith("remove ")
){

    let taskName = msg
        .replace("delete ", "")
        .replace("remove ", "")
        .replace("task ", "")
        .trim();

    let originalLength = tasks.length;

    const updatedTasks = tasks.filter(function(task){

        return !task.text.toLowerCase().includes(taskName);

    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    if(updatedTasks.length < originalLength){

        reply = "🗑️ Task deleted successfully!";

    }else{

        reply = "❌ I couldn't find that task.";

    }

}
    // =========================
// Rename Task
// =========================

else if(
    msg.startsWith("rename ") ||
    msg.startsWith("change ")
){

    let command = msg;

    command = command.replace("rename ", "");
    command = command.replace("change ", "");

    if(command.includes(" to ")){

        let parts = command.split(" to ");

        let oldName = parts[0].trim();
        let newName = parts[1].trim();

        let found = false;

        tasks.forEach(function(task){

            if(task.text.toLowerCase().includes(oldName)){

                task.text = newName;
                found = true;

            }

        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        if(found){

            reply = "✏️ Task renamed successfully!";

        }else{

            reply = "❌ I couldn't find that task.";

        }

    }else{

        reply = "❌ Use: Rename old task to new task.";

    }

}
    // =========================
// Delete Goal By Name
// =========================


else if (
    msg.startsWith("delete goal ") ||
    msg.startsWith("remove goal ") ||
    msg.startsWith("delete ") ||
    msg.startsWith("remove ")
) {

    let goalName = msg
        .replace("delete goal ", "")
        .replace("remove goal ", "")
        .replace("delete ", "")
        .replace("remove ", "")
        .trim()
        .toLowerCase();

    let originalLength = goals.length;

    const updatedGoals = goals.filter(function(goal){
        return goal.text.toLowerCase() !== goalName;
    });

    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    if(updatedGoals.length < originalLength){
        reply = "🗑️ Goal deleted successfully!";
    }else{
        reply = "❌ I couldn't find that goal.";
    }
}
else{

    reply = "🤖 I'm still learning. More AI features are coming soon!";

}

addMessage("ai", reply);

}
