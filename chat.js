let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

function addMessage(type, text) {
    chat.innerHTML += `
        <div class="message ${type}">
            ${text}
        </div>
    `;
}

function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    addMessage("user", text);

    input.value = "";

    aiReply(text);

}
input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});
function aiReply(text){

    alert("AI is working");

    const msg = text.toLowerCase().trim();

    let reply = "🤖 I'm still learning.";


}

    // Greetings
    if(
        msg === "hi" ||
        msg === "hello" ||
        msg === "hey"
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

    else if(msg.includes("how are you")){

        reply = "😊 I'm doing great! How about you?";

    }

  else if(msg.includes("who are you")){

    reply = "🤖 I'm AI Life Assistant, your personal AI companion.";

}

else if(msg.includes("what can you do")){

    reply = "🚀 I can help with coding, studying, planning, notes, tasks, goals and much more.";

}

else if(msg.includes("who made you")){

    reply = "💙 I was built by Samuel with the help of ChatGPT.";

}

else if(msg.includes("what is html")){

    reply = "🌐 HTML is the language used to build the structure of websites.";

}

else if(msg.includes("what is css")){

    reply = "🎨 CSS is used to style websites with colors, layouts and animations.";

}

else if(msg.includes("what is javascript")){

    reply = "💻 JavaScript makes websites interactive.";

}

else if(msg.includes("what is ai") || msg.includes("artificial intelligence")){

    reply = "🤖 Artificial Intelligence enables computers to learn, reason and solve problems.";

}  
    // ======================
// Create Task
// ======================

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



// ======================
// Show Tasks
// ======================

else if(

    msg.includes("show my task") ||
    msg.includes("show my tasks") ||
    msg.includes("show task") ||
    msg.includes("show tasks") ||
    msg.includes("list my task") ||
    msg.includes("list my tasks") ||
    msg.includes("list task") ||
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
    function welcomeMessage(){

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    let events = JSON.parse(localStorage.getItem("events")) || [];

    let hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "🌅 Good morning, Samuel!";

    }
    else if(hour < 17){

        greeting = "☀️ Good afternoon, Samuel!";

    }
    else if(hour < 21){

        greeting = "🌇 Good evening, Samuel!";

    }
    else{

        greeting = "🌙 Good night, Samuel!";

    }

    let recommendation = "";

    if(tasks.length === 0){

        recommendation = "🎉 Great job! You have no pending tasks today.";

    }
    else if(tasks.length <= 3){

        recommendation = "💡 You're doing well. Try to finish all your tasks today.";

    }
    else if(tasks.length <= 10){

        recommendation = "💡 My recommendation: Finish your most important task first.";

    }
    else{

        recommendation = "⚡ You have many tasks today. Focus on your top 3 priorities.";

    }

    let message = `
<b>${greeting}</b><br><br>

Today you have:<br>

📋 <b>${tasks.length}</b> Task(s)<br>
🎯 <b>${goals.length}</b> Goal(s)<br>
📅 <b>${events.length}</b> Event(s)<br><br>

${recommendation}
`;


        
}
    addMessage("ai", message);

}
    
    
