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
// ==========================
// AI Memory
// ==========================

function getMemory(){

    return JSON.parse(localStorage.getItem("aiMemory")) || {};

}

function saveMemory(memory){

    localStorage.setItem("aiMemory", JSON.stringify(memory));

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
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const notes = JSON.parse(localStorage.getItem("allNotes")) || [];
    
const goalSummary = {
    total: goals.length,
    completed: goals.filter(g => g.done).length,
    pending: goals.filter(g => !g.done).length,
    goals: goals
};
 

// ==========================
// Calendar Data
// ==========================

const events = JSON.parse(localStorage.getItem("events")) || [];

const today = new Date().toISOString().split("T")[0];

const todayEvents = events.filter(function(event){

    return event.date === today;

});

const upcomingEvents = events.filter(function(event){

    return event.date >= today;

});
    

    // ==========================
// AI Daily Planner
// ==========================

if(

    msg.includes("good morning") ||

    msg.includes("daily summary") ||

    msg.includes("how am i doing today")

){

    const pendingTasks = tasks.filter(task => !task.done).length;

    const activeGoals = goals.filter(goal => !goal.done).length;

    let reply = `🌅 Good Morning!

📅 Events Today: ${todayEvents.length}

✅ Pending Tasks: ${pendingTasks}

🎯 Active Goals: ${activeGoals}

📝 Notes Saved: ${notes.length}
`;

    if(pendingTasks > 0){

        reply += `\n💡 Today's Focus:\nFinish your pending tasks first.`;

    }else{

        reply += `\n🎉 Great job! You're all caught up today.`;

    }

    addMessage("ai", reply);

    return;

}
    // ==========================
// AI Priority Assistant
// ==========================

if(

    msg.includes("what should i do first") ||

    msg.includes("what's my priority") ||

    msg.includes("what should i focus on") ||

    msg.includes("priority today")

){

    const pendingTasks = tasks.filter(task => !task.done);

    if(pendingTasks.length === 0){

        addMessage(
            "ai",
            "🎉 Fantastic! You have no pending tasks today."
        );

        return;

    }

    // Sort by priority
    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    pendingTasks.sort(function(a, b){

        return priorityOrder[a.priority] - priorityOrder[b.priority];

    });

    let reply = "🔥 Today's Top Priorities\n\n";

    pendingTasks.slice(0,3).forEach(function(task, index){

        const priority = task.priority || "Normal";

reply += `${index + 1}. ${task.text} (${priority})\n`;

    });

    reply += "\n💡 I recommend starting with the highest-priority task.";

    addMessage("ai", reply);

    return;

}
    
    

// ==========================
// Deadlines
// ==========================

if(
    msg.includes("deadline") ||
    msg.includes("deadlines") ||
    msg.includes("due")
){

    const today = new Date().toISOString().split("T")[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    let results = [];

    if(msg.includes("today")){

        results = goals.filter(goal => goal.deadline === today);

    }

    else if(msg.includes("tomorrow")){

        results = goals.filter(goal => goal.deadline === tomorrowStr);

    }

    else{

        results = goals.filter(goal => goal.deadline);

    }

    if(results.length === 0){

        if(msg.includes("today")){

            addMessage("ai","📅 Nothing is due today.");

        }

        else if(msg.includes("tomorrow")){

            addMessage("ai","📅 Nothing is due tomorrow.");

        }

        else{

            addMessage("ai","📅 You don't have any deadlines.");

        }

        return;

    }

    let reply = "📅 Upcoming Deadlines 🎯\n\n";

    results.forEach(goal=>{

        reply += `🎯 ${goal.title}\n`;
        reply += `📅 ${goal.deadline}\n\n`;

    });

    addMessage("ai", reply);

    return;

}
 // ==========================
// Note Count
// ==========================

if(
    msg.includes("how many notes") ||
    msg.includes("note summary")
){

    addMessage(
        "ai",
        `📝 You currently have ${notes.length} note(s).`
    );

    return;

}
 // ==========================
// Show Notes
// ==========================

if(
    msg.includes("show my notes") ||
    msg.includes("list my notes")
){

    if(notes.length === 0){

        addMessage("ai","📝 You don't have any notes yet.");

        return;

    }

    let reply = "📝 Your Notes:\n\n";

    notes.forEach(function(note){

        reply += `📄 ${note.title}\n`;

    });

    addMessage("ai", reply);

    return;

}
 // ==========================
// Last Note
// ==========================

if(
    msg.includes("last note") ||
    msg.includes("recent note")
){

    if(notes.length === 0){

        addMessage("ai","📝 You don't have any notes.");

        return;

    }

    const last = notes[notes.length - 1];

    addMessage(
        "ai",
`📝 ${last.title}

${last.content}`
    );

    return;

}
 // ==========================
// Search Notes
// ==========================

if(msg.includes("find note") || msg.includes("search note")){

    const keyword = msg
        .replace("find note","")
        .replace("search note","")
        .trim();

    const results = notes.filter(function(note){

        return (
            (note.title || "").toLowerCase().includes(keyword) ||
            (note.content || "").toLowerCase().includes(keyword)
        );

    });

    if(results.length === 0){

        addMessage("ai","❌ I couldn't find any note about \"" + keyword + "\".");

        return;

    }

    let reply = "📝 Search Results\n\n";

    results.forEach(function(note){

        reply += `📄 ${note.title}\n`;

    });

    addMessage("ai", reply);

    return;

}
 
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
// Smart Task Detection
// ==========================

if(
    msg.startsWith("remind me to ") ||
    msg.startsWith("i need to ") ||
    msg.startsWith("don't let me forget ")
){

    let task = msg
        .replace("remind me to","")
        .replace("i need to","")
        .replace("don't let me forget","")
        .trim();

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({
        id: Date.now(),
        text: task,
        priority: "Medium",
        done: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    addMessage(
        "ai",
        "✅ I'll remember that.\n\n📌 Task added:\n" + task
    );

    return;

}
 // ==========================
// AI Add Task
// ==========================

if(
    msg.startsWith("add task ") ||
    msg.startsWith("create task ")
){

    const title = msg
        .replace("add task","")
        .replace("create task","")
        .trim();

    if(title === ""){

        addMessage("ai","❌ Please tell me the task.");

        return;

    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({

        id: Date.now(),

        text: title,

        priority: "Medium",

        done: false

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    addMessage(
        "ai",
        "✅ Task added successfully:\n\n📌 " + title
    );

    return;

}
 // ==========================
// AI Add Goal
// ==========================

if(
    msg.startsWith("add goal ") ||
    msg.startsWith("create goal ")
){

    const title = msg
        .replace("add goal","")
        .replace("create goal","")
        .trim();

    if(title === ""){

        addMessage("ai","❌ Please tell me the goal.");

        return;

    }

    const goals = JSON.parse(localStorage.getItem("goals")) || [];

    goals.push({

        id: Date.now(),

        title: title,

        description: "",

        deadline: "",

        category: "Personal",

        done: false

    });

    localStorage.setItem("goals", JSON.stringify(goals));

    addMessage(
        "ai",
        "🎯 Goal added successfully!\n\n🎯 " + title
    );

    return;

}
 // ==========================
// Smart Goal Detection
// ==========================

if(

    msg.startsWith("i want to ") ||

    msg.startsWith("my goal is to ") ||

    msg.startsWith("i plan to ")

){

    let goal = msg

        .replace("i want to","")

        .replace("my goal is to","")

        .replace("i plan to","")

        .trim();

    const goals = JSON.parse(localStorage.getItem("goals")) || [];

    goals.push({

        id: Date.now(),

        title: goal,

        description: "",

        deadline: "",

        category: "Personal",

        done: false

    });

    localStorage.setItem("goals", JSON.stringify(goals));

    addMessage(

        "ai",

        "🎯 Great goal!\n\nI've added it:\n🎯 " + goal

    );

    return;

}
 

// ==========================

// Smart Note Detection

// ==========================

if(

    msg.includes("remember that") ||

    msg.includes("take note that") ||

    msg.includes("write this down")

){

    let note = msg;

    note = note.replace("remember that","");

    note = note.replace("take note that","");

    note = note.replace("write this down","");

    note = note.trim();

    const notes = JSON.parse(localStorage.getItem("allNotes")) || [];

    notes.push({

        title: "Quick Note",

        content: note

    });

    localStorage.setItem("allNotes", JSON.stringify(notes));

    addMessage(

        "ai",

        "📝 I've saved that note for you."

    );

    return;

}
// ==========================
// Remember Anything
// ==========================

if(msg.startsWith("remember that ")){

    const fact = text.replace(/remember that/i,"").trim();

    let memory = JSON.parse(localStorage.getItem("aiFacts")) || [];

    memory.push(fact);

    localStorage.setItem("aiFacts", JSON.stringify(memory));

    addMessage("ai","🧠 I'll remember that!");

    return;

}
// ===
 // ==========================
// AI Add Note
// ==========================

if(
    msg.startsWith("add note ") ||
    msg.startsWith("create note ")
){

    const title = "Quick Note";

    const content = msg
        .replace("add note","")
        .replace("create note","")
        .trim();

    if(content === ""){

        addMessage("ai","❌ Please tell me the note.");

        return;

    }

    const notes = JSON.parse(localStorage.getItem("allNotes")) || [];

    notes.push({

        title: title,
        content: content

    });

    localStorage.setItem("allNotes", JSON.stringify(notes));

    addMessage(
        "ai",
        "📝 Note saved successfully!"
    );

    return;

}
 
// ==========================
// Smart Event Detection
// ==========================

if(

    msg.includes("meeting") ||

    msg.includes("appointment") ||

    msg.includes("training") ||

    msg.includes("class") ||

    msg.includes("event")

){

    let title = text;

    let date = "";

    let today = new Date();

    if(msg.includes("today")){

        date = today.toISOString().split("T")[0];

    }

    if(msg.includes("tomorrow")){

        today.setDate(today.getDate()+1);

        date = today.toISOString().split("T")[0];

    }

    const events = JSON.parse(localStorage.getItem("events")) || [];

    events.push({

        title:title,

        date:date,

        time:"",

        location:"",

        notes:"",

        reminder:"none",

        repeat:"none"

    });

    localStorage.setItem("events",JSON.stringify(events));

    addMessage(

        "ai",

        "📅 I've added that to your calendar."

    );

    return;

}
// ==========================
// AI Add Event (Smart)
// ==========================

if(
    msg.startsWith("add event ") ||
    msg.startsWith("create event ")
){

    let text = msg
        .replace("add event","")
        .replace("create event","")
        .trim();

    let date = "";
    let today = new Date();

    if(text.includes("today")){
        date = today.toISOString().split("T")[0];
        text = text.replace("today","").trim();
    }

    if(text.includes("tomorrow")){
        today.setDate(today.getDate()+1);
        date = today.toISOString().split("T")[0];
        text = text.replace("tomorrow","").trim();
    }

    const events = JSON.parse(localStorage.getItem("events")) || [];

    events.push({
        title: text,
        date: date,
        time: "",
        location: "",
        notes: "",
        reminder: "none",
        repeat: "none"
    });

    localStorage.setItem("events", JSON.stringify(events));

    addMessage(
        "ai",
        "📅 Event added successfully!\n\n📌 " + text +
        (date ? "\n📅 " + date : "")
    );

    return;

}
 // ==========================
// Tasks Summary
// ==========================

if(hasAny(msg, ["task","tasks"])){

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskSummary = {
    total: tasks.length,
    completed: tasks.filter(task => task.done).length,
    pending: tasks.filter(task => !task.done).length,
    tasks: tasks
};

    addMessage(
        "ai",
`📋 Task Summary

📝 Total Tasks: ${taskSummary.total}
✅ Completed: ${taskSummary.completed}
⏳ Pending: ${taskSummary.pending}`
    );

    return;
}
 // ==========================
// Pending Goals
// ==========================

if(
    msg.includes("pending goals") ||
    msg.includes("unfinished goals")
){

    const pending = goalSummary.goals.filter(g => !g.done);

    if(pending.length === 0){

        addMessage("ai","🎉 Congratulations! You have no pending goals.");

        return;

    }

    let reply = "⏳ Pending Goals:\n\n";

    pending.forEach(function(goal){

        reply += `🎯 ${goal.title || goal.text}\n`;

    });

    addMessage("ai", reply);

    return;

}

 // ==========================
// Completed Goals
// ==========================

if(
    msg.includes("completed goals")
){

    const completed = goalSummary.goals.filter(g => g.done);

    if(completed.length === 0){

        addMessage("ai","You haven't completed any goals yet.");

        return;

    }

    let reply = "✅ Completed Goals:\n\n";

    completed.forEach(function(goal){

        reply += `✅ ${goal.title || goal.text}\n`;

    });

    addMessage("ai", reply);

    return;

}
 // ==========================
// Today's Events
// ==========================

if (

    (msg.includes("event") || msg.includes("events"))

    &&

    msg.includes("today")

){

    if(todayEvents.length === 0){

        addMessage("ai","📅 You have no events scheduled for today.");

        return;

    }

    let reply = "📅 Today's Events:\n\n";

    todayEvents.forEach(function(event){

        reply += `📌 ${event.title}`;

        if(event.time){
            reply += ` (${event.time})`;
        }

        reply += "\n";

    });

    addMessage("ai", reply);

    return;

}
 // ==========================
// Upcoming Events
// ==========================

if(
    msg.includes("upcoming events") ||
    msg.includes("next event") ||
    msg.includes("show events")
){

    if(upcomingEvents.length === 0){

        addMessage("ai","📅 You have no upcoming events.");

        return;

    }

    let reply = "📅 Upcoming Events:\n\n";

    upcomingEvents.forEach(function(event){

        reply += `📌 ${event.title} - ${event.date}`;

        if(event.time){
            reply += ` ${event.time}`;
        }

        reply += "\n";

    });

    addMessage("ai", reply);

    return;

}
// ==========================
// Learn About User
// ==========================

const memory = getMemory();

if(msg.startsWith("my favorite color is ")){

    memory.favoriteColor = text.replace(/my favorite color is/i,"").trim();

    saveMemory(memory);

    addMessage("ai","💙 I'll remember that! Your favorite color is " + memory.favoriteColor + ".");

    return;

}

if(msg.startsWith("my birthday is ")){

    memory.birthday = text.replace(/my birthday is/i,"").trim();

    saveMemory(memory);

    addMessage("ai","🎂 Got it! I'll remember your birthday.");

    return;

}

if(msg.startsWith("i work at ")){

    memory.work = text.replace(/i work at/i,"").trim();

    saveMemory(memory);

    addMessage("ai","💼 Nice! I'll remember where you work.");

    return;

}

if(msg.startsWith("my name is ")){

    memory.name = text.replace(/my name is/i,"").trim();

    saveMemory(memory);

    addMessage("ai","😊 Nice to meet you, " + memory.name + "! I'll remember your name.");

    return;

}
// ==========================
// Recall Memory
// ==========================

if(msg.includes("what is my favorite color")){

    addMessage("ai",
        memory.favoriteColor
        ? "💙 Your favorite color is " + memory.favoriteColor + "."
        : "I don't know your favorite color yet."
    );

    return;

}

if(msg.includes("when is my birthday")){

    addMessage("ai",
        memory.birthday
        ? "🎂 Your birthday is " + memory.birthday + "."
        : "I don't know your birthday yet."
    );

    return;

}

if(msg.includes("where do i work")){

    addMessage("ai",
        memory.work
        ? "💼 You work at " + memory.work + "."
        : "I don't know where you work yet."
    );

    return;

}

if(msg.includes("what is my name")){

    addMessage("ai",
        memory.name
        ? "😊 Your name is " + memory.name + "."
        : "I don't know your name yet."
    );

    return;

}
  

    // ==========================
// Show Memory
// ==========================

if(

    msg.includes("what do you remember about me") ||

    msg.includes("what do you know about me")

){

    let memory = JSON.parse(localStorage.getItem("aiFacts")) || [];

    if(memory.length === 0){

        addMessage("ai","🧠 I don't know much about you yet.");

        return;

    }

    let reply = "🧠 Here's what I remember:\n\n";

    memory.forEach(function(item){

        reply += "• " + item + "\n";

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
