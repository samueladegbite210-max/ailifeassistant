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

    addMessage("ai", reply);

}
