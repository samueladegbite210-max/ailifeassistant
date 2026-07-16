// =======================================
// AI Life Assistant v3.0
// Chat System
// =======================================
const knowledge = {

    "what is javascript":
        "JavaScript is a programming language used to make websites interactive.",

    "what is html":
        "HTML is the language used to build the structure of websites.",

    "what is css":
        "CSS is used to style websites with colors, fonts, layouts and animations.",

    "what is ai":
        "Artificial Intelligence enables computers to perform tasks that normally require human intelligence.",

    "who are you":
        "I'm AI Life Assistant. I'm here to help you study, organize your life and answer questions.",

    "who made you":
        "I was created by Samuel with the help of ChatGPT.",

    "what can you do":
        "I can help with coding, studying, planning, writing, productivity and much more."

};

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

    aiReply(text);

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
    
alert("AI function started");
    
    const msg = text.toLowerCase();

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];
    let notes = localStorage.getItem("notes") || "";
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

        reply = "ð Hello Samuel! How can I help you today?";

    }

    else if(msg.includes("good morning")){

        reply = "ð Good morning! Have a productive day.";

    }

    else if(msg.includes("good afternoon")){

        reply = "âï¸ Good afternoon!";

    }

    else if(msg.includes("good evening")){

        reply = "ð Good evening!";

    }

    else if(msg.includes("good night")){

        reply = "ð Good night. Sleep well.";

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

    reply = "ð  Opening Home...";

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

    reply = "â Opening Tasks...";

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

    reply = "ð¯ Opening Goals...";

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

    reply = "ð Opening Notes...";

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

    reply = "ð Opening Calendar...";

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

    reply = "ð¤ Opening Profile...";

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

        reply = "â Please enter a task name.";

    }else{

        tasks.push({
            id: Date.now(),
            text: taskName,
            priority: "Medium",
            done: false
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        reply = "â Task \"" + taskName + "\" created successfully!";

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

        reply = "â Please enter a goal.";

    }else{

        goals.push({
            id: Date.now(),
            text: goalName,
            done: false
        });

        localStorage.setItem("goals", JSON.stringify(goals));

        reply = "ð¯ Goal \"" + goalName + "\" created successfully!";

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

    reply = "ð Note saved successfully!";

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

    reply = "ð Event \"" + eventTitle + "\" created successfully!";

}  
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];
let notes = localStorage.getItem("notes") || "";
    // ======================
// Show Tasks
// ======================

else if(
    msg.includes("show my tasks") ||
    msg.includes("list my tasks") ||
    msg.includes("show tasks")
){

    if(tasks.length===0){

        reply="â You don't have any tasks.";

    }else{

        reply="â <strong>Your Tasks</strong><br><br>";

        tasks.forEach(function(task,index){

            reply+=
            (task.done?"â ":"â¬ ")+
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

        reply="ð¯ You don't have any goals.";

    }else{

        reply="ð¯ <strong>Your Goals</strong><br><br>";

        goals.forEach(function(goal,index){

            reply+=
            (goal.done?"â ":"â¬ ")+
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

        reply="ð No notes found.";

    }else{

        reply=
        "<strong>ð Your Notes</strong><br><br>"+
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

        reply="ð No events found.";

    }else{

        reply="<strong>ð Your Events</strong><br><br>";

        events.forEach(function(event,index){

            reply+=
            (index+1)+". "+
            event.title+
            "<br>"+

            "ð "+event.date+

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

    reply = "â You currently have " + tasks.length + " task(s).";

}
    // ======================
// Count Goals
// ======================

else if(
    msg.includes("how many goals") ||
    msg.includes("goal count")
){

    reply = "ð¯ You currently have " + goals.length + " goal(s).";

}
    // ======================
// Count Notes
// ======================

else if(
    msg.includes("how many notes") ||
    msg.includes("note count")
){

    if(notes.trim()==""){

        reply="ð You don't have any notes.";

    }else{

        const total = notes.split("\n\n").length;

        reply="ð You currently have "+total+" note(s).";

    }

}
    // ======================
// Count Events
// ======================

else if(
    msg.includes("how many events") ||
    msg.includes("event count")
){

    reply="ð You currently have "+events.length+" event(s).";

}
    // ======================
// Next Event
// ======================

else if(
    msg.includes("next event") ||
    msg.includes("upcoming event")
){

    if(events.length===0){

        reply="ð You don't have any upcoming events.";

    }else{

        const event=events[0];

        reply=
        "ð <strong>Next Event</strong><br><br>"+
        "ð "+event.title+"<br>"+
        "ð "+event.date+"<br>"+
        "ð "+event.time+"<br>"+
        "ð "+event.location;

    }

}
    // ======================
// Complete Task
// ======================

else if(msg.startsWith("complete task ")){

    const number = parseInt(msg.replace("complete task ",""));

    if(isNaN(number) || number < 1 || number > tasks.length){

        reply = "â Task not found.";

    }else{

        tasks[number - 1].done = true;

        localStorage.setItem("tasks", JSON.stringify(tasks));

        reply = "â Task " + number + " completed.";

    }

}
    // ======================
// Complete Goal
// ======================

else if(msg.startsWith("complete goal ")){

    const number = parseInt(msg.replace("complete goal ",""));

    if(isNaN(number) || number < 1 || number > goals.length){

        reply = "â Goal not found.";

    }else{

        goals[number - 1].done = true;

        localStorage.setItem("goals", JSON.stringify(goals));

        reply = "ð¯ Goal " + number + " completed.";

    }

}
    // ======================
// Delete Task
// ======================

else if(msg.startsWith("delete task ")){

    const number = parseInt(msg.replace("delete task ",""));

    if(isNaN(number) || number < 1 || number > tasks.length){

        reply = "â Task not found.";

    }else{

        const deleted = tasks.splice(number - 1, 1);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        reply = "ðï¸ Deleted task: " + deleted[0].text;

    }

}
    // ======================
// Delete Goal
// ======================

else if(msg.startsWith("delete goal ")){

    const number = parseInt(msg.replace("delete goal ",""));

    if(isNaN(number) || number < 1 || number > goals.length){

        reply = "â Goal not found.";

    }else{

        const deleted = goals.splice(number - 1, 1);

        localStorage.setItem("goals", JSON.stringify(goals));

        reply = "ðï¸ Deleted goal: " + deleted[0].text;

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

        reply = "â No matching tasks found.";

    }else{

        reply = "â <strong>Matching Tasks</strong><br><br>";

        results.forEach(function(task,index){

            reply +=
            (task.done ? "â " : "â¬ ") +
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

        reply = "â No matching goals found.";

    }else{

        reply = "ð¯ <strong>Matching Goals</strong><br><br>";

        results.forEach(function(goal,index){

            reply +=
            (goal.done ? "â " : "â¬ ") +
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
        "ð <strong>Found in Notes</strong><br><br>" +
        notes.replace(/\n/g,"<br>");

    }else{

        reply = "â No matching notes found.";

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

        reply = "â No matching events found.";

    }else{

        reply = "ð <strong>Matching Events</strong><br><br>";

        results.forEach(function(event,index){

            reply +=
            (index+1)+". "+
            event.title+
            "<br>ð "+
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

        reply = "â Use: Rename task 1 to Finish assignment";

    }else{

        const taskNumber = parseInt(parts[1]);
        const newName = parts[2].trim();

        if(taskNumber < 1 || taskNumber > tasks.length){

            reply = "â Task not found.";

        }else{

            tasks[taskNumber - 1].text = newName;

            localStorage.setItem("tasks", JSON.stringify(tasks));

            reply = "âï¸ Task " + taskNumber + " renamed to \"" + newName + "\".";

        }

    }

}
    // ======================
// Change Task Priority
// ======================

else if(msg.startsWith("set task ")){

    const parts = text.match(/set task (\d+) priority to (high|medium|low)/i);

    if(!parts){

        reply = "â Use: Set task 1 priority to High";

    }else{

        const taskNumber = parseInt(parts[1]);
        const priority = parts[2];

        if(taskNumber < 1 || taskNumber > tasks.length){

            reply = "â Task not found.";

        }else{

            tasks[taskNumber - 1].priority =
            priority.charAt(0).toUpperCase() +
            priority.slice(1).toLowerCase();

            localStorage.setItem("tasks", JSON.stringify(tasks));

            reply =
            "â­ Task " +
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

        reply = "â Task completed!";

    }else{

        reply = "â I couldn't find that task.";

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

        reply = "ðï¸ Task deleted successfully!";

    }else{

        reply = "â I couldn't find that task.";

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

            reply = "âï¸ Task renamed successfully!";

        }else{

            reply = "â I couldn't find that task.";

        }

    }else{

        reply = "â Use: Rename old task to new task.";

    }

}
    // =========================
// Delete Goal By Name
// =========================


else if (
    msg.startsWith("delete goal ") ||
    msg.startsWith("remove goal ")
){

    let goalName = msg
        .replace("delete goal ", "")
        .replace("remove goal ", "")
        .trim()
        .toLowerCase();

    let found = false;

    goals = goals.filter(function(goal){

        if(goal.text.trim().toLowerCase() === goalName){

            found = true;
            return false;
        }

        return true;

    });

    localStorage.setItem("goals", JSON.stringify(goals));

    if(found){

        reply = "ðï¸ Goal deleted successfully!";

    }else{

        reply = "â Goal not found.";

    }

}
// =========================
// AI Knowledge
// =========================

else if(
    msg.includes("who are you") ||
    msg.includes("what are you")
){

    reply =
    "ð¤ I'm AI Life Assistant.\n\n" +
    "I'm your personal AI companion.\n\n" +
    "I can help you study, code, plan your day, answer questions, organize your life, and keep you productive.";

}

else if(msg.includes("what can you do")){

    reply =
    "ð I can help you with:\n\n" +
    "ð Studying\n" +
    "ð» Programming\n" +
    "ð Writing\n" +
    "ð Planning\n" +
    "ð¯ Productivity\n" +
    "ð¡ General questions\n" +
    "ð Motivation";

}

else if(msg.includes("who made you")){

    reply =
    "ð I was built by Samuel with the help of ChatGPT.\n\n" +
    "Together we're building AI Life Assistant.";

}

else if(
    msg.includes("how are you")
){

    reply =
    "ð I'm doing great and I'm ready to help you!";

}

else if(
    msg.includes("thank you") ||
    msg.includes("thanks")
){

    reply =
    "ð You're welcome, Samuel! I'm always here to help.";

}

else if(
    msg.includes("motivate me")
){

    reply =
    "ðª Remember:\n\n" +
    "Small progress every day becomes huge success.\n\n" +
    "Keep building AI Life Assistant. You're getting closer every day.";

}
    // =========================
// HTML
// =========================

else if(
    msg.includes("what is html")
){

    reply =
    "ð HTML stands for HyperText Markup Language.\n\n" +
    "It is used to create the structure of websites.";

}

// =========================
// CSS
// =========================

else if(
    msg.includes("what is css")
){

    reply =
    "ð¨ CSS stands for Cascading Style Sheets.\n\n" +
    "It is used to style web pages by adding colors, fonts, layouts, and animations.";

}

// =========================
// JavaScript
// =========================

else if(
    msg.includes("what is javascript")
){

    reply =
    "ð» JavaScript is the programming language of the web.\n\n" +
    "It makes websites interactive by handling buttons, forms, animations, calculations, and much more.";

}

// =========================
// AI
// =========================

else if(
    msg.includes("what is ai") ||
    msg.includes("artificial intelligence")
){

    reply =
    "ð¤ Artificial Intelligence (AI) enables computers to perform tasks that normally require human intelligence, such as learning, reasoning, understanding language, and solving problems.";

}

// =========================
// ChatGPT
// =========================

else {

    let found = false;

    for (let key in knowledge) {

        if (msg.includes(key) || key.includes(msg)) {

            reply = knowledge[key];
            found = true;
            break;

        }

    }

    if (!found) {

        reply = "ð¤ I'm still learning. More AI features are coming soon!";

    }

}

addMessage("ai", reply);

}
