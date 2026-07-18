 // ================================
// AI Life Assistant 
// ================================

// Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];
let notes = localStorage.getItem("notes") || "";
let memory = JSON.parse(localStorage.getItem("memory")) || {
    name: "",
    birthday: "",
    favoriteColor: "",
    favoriteFood: "",
    favoriteDrink: "",
    favoriteMovie: "",
    favoriteMusic: "",
    favoriteSport: "",
    job: "",
    school: "",
    country: "",
    city: "",
    relationship: "",
    dream: "",
    phone: "",
    language: ""
};
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
    msg.includes("list tasks") ||
    msg.includes("do i have any tasks") ||
    msg.includes("what's on my to-do list") ||
    msg.includes("what is on my to-do list") ||
    msg.includes("to-do list") ||
    msg.includes("todo list")


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
    msg.includes("list goals") ||
    msg.includes("do i have any goals") ||
    msg.includes("any goals") ||
    msg.includes("what are my goals") ||
    msg.includes("what's on my goals") ||
    msg.includes("goal list")

){

    if(goals.length === 0){

        reply = "🎯 You don't have any goals yet.";

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

    msg.includes("show my notes") ||
    msg.includes("show notes") ||
    msg.includes("list my notes") ||
    msg.includes("list notes") ||
    msg.includes("do i have any notes") ||
    msg.includes("any notes")

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

    msg.includes("show my events") ||
    msg.includes("show events") ||
    msg.includes("list my events") ||
    msg.includes("list events") ||
    msg.includes("do i have any events") ||
    msg.includes("any events") ||
    msg.includes("upcoming events")


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
    // ======================
// Remember Information
// ======================

else if(msg.startsWith("my name is ")){

    let name = text.replace(/my name is /i,"").trim();

    memory.name = name;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "😊 Nice to meet you, " + name + ". I'll remember your name.";

}

else if(msg.startsWith("my favorite color is ")){

    let color = text.replace(/my favorite color is /i,"").trim();

    memory.favoriteColor = color;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "🎨 I'll remember that your favorite color is " + color + ".";

}

else if(msg.startsWith("my birthday is ")){

    let birthday = text.replace(/my birthday is /i,"").trim();

    memory.birthday = birthday;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "🎂 I'll remember that your birthday is " + birthday + ".";

}
// ======================
// Recall Memory

else if(msg.includes("what is my name")){

    reply = memory.name
        ? "😊 Your name is " + memory.name + "."
        : "I don't know your name yet.";

}

else if(msg.includes("what is my favorite color")){

    reply = memory.favoriteColor
        ? "🎨 Your favorite color is " + memory.favoriteColor + "."
        : "I don't know your favorite color yet.";

}

else if(msg.includes("when is my birthday")){

    reply = memory.birthday
        ? "🎂 Your birthday is " + memory.birthday + "."
        : "I don't know your birthday yet.";

}
    // ================================
// General Knowledge
// ================================

else if(msg.includes("what is nigeria")){

    reply = "🇳🇬 Nigeria is a country in West Africa with 36 states and the Federal Capital Territory, Abuja.";

}

else if(msg.includes("capital of nigeria")){

    reply = "🏛️ The capital of Nigeria is Abuja.";

}

else if(msg.includes("president of nigeria")){

    reply = "🇳🇬 The President of Nigeria is Bola Ahmed Tinubu.";

}

else if(msg.includes("what is programming")){

    reply = "💻 Programming is the process of writing instructions that tell a computer what to do.";

}

else if(msg.includes("what is python")){

    reply = "🐍 Python is one of the world's most popular programming languages. It is easy to learn and is used for AI, web development, automation and data science.";

}

else if(msg.includes("what is java")){

    reply = "☕ Java is a programming language used for Android apps, websites and enterprise software.";

}

else if(msg.includes("what is coding")){

    reply = "💻 Coding means writing instructions that computers can understand.";

}

else if(msg.includes("who is albert einstein")){

    reply = "🧠 Albert Einstein was a famous physicist who developed the Theory of Relativity.";

}

else if(msg.includes("what is the internet")){

    reply = "🌍 The Internet is a worldwide network that connects billions of computers.";

}

else if(msg.includes("what is electricity")){

    reply = "⚡ Electricity is the flow of electric charge that powers lights, machines and electronic devices.";

}

else if(msg.includes("what is love")){

    reply = "❤️ Love is a deep feeling of care, affection and commitment toward someone or something.";

}

else if(msg.includes("tell me a joke")){

    reply = "😂 Why do programmers prefer dark mode? Because light attracts bugs!";

}

else if(msg.includes("motivate me")){

    reply = "💪 Every expert was once a beginner. Keep learning and never give up—you are building something amazing.";

}

else if(msg.includes("thank you")){

    reply = "😊 You're welcome, Samuel! I'm always here to help.";

}

else if(msg.includes("who is samuel")){

    reply = "💙 Samuel is my creator and the developer of AI Life Assistant.";
}

  // ================================
// Calculator
// ================================

else if (/^[0-9+\-*/(). x]+$/i.test(msg)) {

    try {

        let expression = msg.replace(/x/gi, "*");

        let result = eval(expression);

        reply = "🧮 Answer: <strong>" + result + "</strong>";

    } catch (error) {

        reply = "❌ Sorry, I couldn't calculate that.";

    }

}
    



// ================================
// Date & Time
// ================================

else if(

    msg.includes("date") ||
    msg.includes("today's date") ||
    msg.includes("today date") ||
    msg.includes("current date") ||
    msg.includes("what is today's date") ||
    msg.includes("what's today's date") ||
    msg.includes("what is the date") ||
    msg.includes("what's the date")

){

    reply = "📅 Today is " + new Date().toDateString();

}

else if(

    msg.includes("time") ||
    msg.includes("what time is it") ||
    msg.includes("current time") ||
    msg.includes("time now") ||
    msg.includes("tell me the time")

){

    reply = "🕒 The current time is " + new Date().toLocaleTimeString();

}

else if(

    msg.includes("day") ||
    msg.includes("what day is today") ||
    msg.includes("today is what day") ||
    msg.includes("current day")

){

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    reply = "📆 Today is " + days[new Date().getDay()];

}

else if(

    msg.includes("month") ||
    msg.includes("what month is it") ||
    msg.includes("current month") ||
    msg.includes("what month is this")

){

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    reply = "📅 This month is " + months[new Date().getMonth()];

}

else if(

    msg.includes("year") ||
    msg.includes("what year is it") ||
    msg.includes("current year")

){

    reply = "📅 The current year is " + new Date().getFullYear();

}
   
// ================================
// Natural Conversation
// ================================

// TIRED
else if(
    msg.includes("tired") ||
    msg.includes("exhausted") ||
    msg.includes("sleepy")
){

    reply = "😴 You sound tired. Get some rest, drink water, and take care of yourself.";

}

// HUNGRY
else if(
    msg.includes("hungry") ||
    msg.includes("need food") ||
    msg.includes("starving")
){

    reply = "🍽️ Sounds like you're hungry. Go grab something delicious to eat!";

}

// HAPPY
else if(
    msg.includes("happy") ||
    msg.includes("excited") ||
    msg.includes("feeling good") ||
    msg.includes("i feel good")
){

    reply = "😊 That's wonderful! I'm really happy you're feeling good today.";

}

// SAD
else if(
    msg.includes("sad") ||
    msg.includes("upset") ||
    msg.includes("depressed") ||
    msg.includes("feeling down")
){

    reply = "💙 I'm sorry you're feeling that way. I'm here if you want to talk.";

}

// BORED
else if(
    msg.includes("bored")
){

    reply = "🎮 You're bored? Let's learn something new, review your goals, or create a new project.";

}

// WORK
else if(
    msg.includes("going to work") ||
    msg.includes("at work") ||
    msg.includes("i'm working") ||
    msg.includes("working now") ||
    msg.includes("im working")
){

    reply = "💼 Have a productive day! Stay safe and do your best.";

}

// THANK YOU
else if(
    msg.includes("thank you") ||
    msg.includes("thanks") ||
    msg.includes("thank u") ||
    msg.includes("thx")
){

    reply = "❤️ You're very welcome! I'm always here whenever you need me.";

}

// GOOD LUCK
else if(
    msg.includes("good luck")
){

    reply = "🍀 Thank you! I wish you success in everything you do.";

}

// I LOVE YOU
else if(
    msg.includes("i love you") ||
    msg.includes("love you")
){

    reply = "❤️ Thank you! I appreciate you too. I'll always be here to help you.";

}

// GOOD JOB
else if(
    msg.includes("good job") ||
    msg.includes("well done") ||
    msg.includes("nice work")
){

    reply = "😊 Thank you! That really means a lot.";

}

// BYE
else if(
    msg.includes("bye") ||
    msg.includes("goodbye") ||
    msg.includes("see you") ||
    msg.includes("see you later")
){

    reply = "👋 Goodbye! Have a wonderful day. I'll be here whenever you need me.";

}
    // ================================
// Weather
// ================================

else if(

    msg.includes("weather") ||
    msg.includes("is it raining") ||
    msg.includes("is it sunny") ||
    msg.includes("temperature") ||
    msg.includes("forecast")

){

    reply = "🌤️ I can't check live weather yet, but that feature is coming soon! In Version 2.0 I'll be able to show real-time weather for any city.";

}
    


// ================================
// Smart Memory
// ================================

// Save Name
else if(
    msg.startsWith("my name is ") ||
    msg.startsWith("i am ") ||
    msg.startsWith("i'm ")
){

    let name = text
        .replace(/my name is/i,"")
        .replace(/i am/i,"")
        .replace(/i'm/i,"")
        .trim();

    memory.name = name;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "😊 Nice to meet you, " + name + ". I'll remember your name.";

}

// Save Location
else if(
    msg.includes("i live in") ||
    msg.includes("i do live in") ||
    msg.includes("i'm from") ||
    msg.includes("im from") ||
    msg.includes("i come from")
){

    let city = text
        .replace(/i do live in/i,"")
        .replace(/i live in/i,"")
        .replace(/i'm from/i,"")
        .replace(/im from/i,"")
        .replace(/i come from/i,"")
        .trim();

    memory.city = city;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "📍 I'll remember that you live in " + city + ".";

}

// Save Job
else if(
    msg.startsWith("i work as ") ||
    msg.startsWith("my job is ") ||
    msg.startsWith("i am a ")
){

    let job = text
        .replace(/i work as/i,"")
        .replace(/my job is/i,"")
        .replace(/i am a/i,"")
        .trim();

    memory.job = job;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "💼 I'll remember that you work as " + job + ".";

}

// Save Favorite Food
else if(
    msg.startsWith("my favorite food is ") ||
    msg.startsWith("i like to eat ")
){

    let food = text
        .replace(/my favorite food is/i,"")
        .replace(/i like to eat/i,"")
        .trim();

    memory.favoriteFood = food;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "🍕 I'll remember your favorite food is " + food + ".";

}

// Save Phone
else if(
    msg.startsWith("i use ") ||
    msg.startsWith("my phone is ")
){

    let phone = text
        .replace(/i use/i,"")
        .replace(/my phone is/i,"")
        .trim();

    memory.phone = phone;

    localStorage.setItem("memory", JSON.stringify(memory));

    reply = "📱 I'll remember that you use " + phone + ".";

}

// ================================
// Recall Memory
// ================================

// Name
else if(
    msg.includes("what is my name") ||
    msg.includes("who am i")
){

    reply = memory.name
        ? "😊 Your name is " + memory.name + "."
        : "I don't know your name yet.";

}

// City
else if(
    msg.includes("where do i live") ||
    msg.includes("where am i from")
){

    reply = memory.city
        ? "📍 You live in " + memory.city + "."
        : "I don't know where you live yet.";

}

// Job
else if(
    msg.includes("what is my job") ||
    msg.includes("where do i work")
){

    reply = memory.job
        ? "💼 You work as " + memory.job + "."
        : "I don't know your job yet.";

}

// Favorite Food
else if(
    msg.includes("what is my favorite food") ||
    msg.includes("what food do i like")
){

    reply = memory.favoriteFood
        ? "🍕 Your favorite food is " + memory.favoriteFood + "."
        : "I don't know your favorite food yet.";

}

// Phone
else if(
    msg.includes("what phone do i use") ||
    msg.includes("what is my phone")
){

    reply = memory.phone
        ? "📱 You use " + memory.phone + "."
        : "I don't know what phone you use yet.";

}
 // ================================
// Smart Greetings
// ================================

else if(
    msg.includes("how was my day")
){

    reply = "😊 I hope your day has been productive. Remember to rest and take care of yourself.";

}

else if(
    msg.includes("i'm back") ||
    msg.includes("im back") ||
    msg.includes("i am back")
){

    reply = "👋 Welcome back! It's nice to see you again.";

}

else if(
    msg.includes("good morning")
){

    const hour = new Date().getHours();

    if(hour < 12){

        reply = "🌅 Good morning! I hope you have an amazing day ahead.";

    }else{

        reply = "😄 Good morning! You're a little late, but I hope you're having a great day.";

    }

}

else if(
    msg.includes("good night")
){

    reply = "🌙 Good night! Sleep well and recharge for tomorrow.";

}
 else if(
    msg.includes("you are amazing") ||
    msg.includes("you're amazing")
){

    reply = "🥹 Thank you! That really means a lot.";

}

else if(
    msg.includes("you're smart") ||
    msg.includes("you are smart")
){

    reply = "😄 Thank you! I'm always learning so I can help you better.";

}
 else if(
    msg.includes("what is your name") ||
    msg.includes("what's your name")
){

    reply = "🤖 My name is AI Life Assistant. I'm your personal AI companion.";

}
  else if(
    msg.includes("who is your creator") ||
    msg.includes("who created you")
){

    reply = "💙 I was created by Samuel using HTML, CSS, JavaScript and lots of determination.";

}
   else if(
    msg.includes("how old are you")
){

    reply = "🤖 I don't have an age like humans, but I keep getting smarter every day.";

}
// Default Reply
// ================================

else{

    reply = "🤖 I'm still learning.";

}

addMessage("ai", reply);

}
