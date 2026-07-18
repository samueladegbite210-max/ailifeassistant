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
let conversation = conversationReply(msg, text);

if(conversation){
    addMessage("ai", conversation);
    return;
}

let knowledge = knowledgeReply(msg);

if(knowledge){
    addMessage("ai", knowledge);
    return;
}

let calculator = calculatorReply(msg);

if(calculator){
    addMessage("ai", calculator);
    return;
}

let dateTime = dateTimeReply(msg);

if(dateTime){
    addMessage("ai", dateTime);
    return;
}
let task = taskReply(msg, text);

if(task){

    addMessage("ai", task);

    return;

}
let reply = "🤖 I'm still learning.";



// ================================
// Goal Count (Smart)
// ================================

else if(hasAny(msg,[

    "how many goals",
    "goal count",
    "number of goals",
    "total goals",
    "how much goals"

])){

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

/// ======================
// Show Notes (Smart)
// ======================

else if(hasAny(msg,[

    "show my notes",
    "show notes",
    "list my notes",
    "list notes",
    "my notes",
    "notes",
    "what are my notes",
    "do i have notes",
    "do i have any notes",
    "can i see my notes",
    "note list"

])){

    let notes = localStorage.getItem("notes") || "";

    if(notes.trim() === ""){

        reply = "📝 You don't have any notes yet.";

    }else{

        reply =
        "<strong>📝 Your Notes</strong><br><br>" +
        notes.replace(/\n/g,"<br>");

    }

}
 // ======================
// Note Count (Smart)
// ======================

else if(hasAny(msg,[

    "how many notes",
    "note count",
    "number of notes",
    "total notes"

])){

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
// Show Events (Smart)
// ================================

else if(hasAny(msg,[

    "show my events",
    "show events",
    "my events",
    "events",
    "event list",
    "list events",
    "list my events",
    "what are my events",
    "do i have events",
    "do i have any events",
    "can i see my events",
    "upcoming events"

])){

    if(events.length === 0){

        reply = "📅 You don't have any events yet.";

    }else{

        reply = "📅 <strong>Your Events</strong><br><br>";

        events.forEach(function(event,index){

            reply +=
                (index + 1) + ". " +
                event.title +
                "<br>" +
                "📆 " + event.date +
                "<br>" +
                "🕒 " + (event.time || "No time") +
                "<br><br>";

        });

    }

}
// ================================
// Event Count (Smart)
// ================================

else if(hasAny(msg,[

    "how many events",
    "event count",
    "number of events",
    "total events"

])){

    reply = "📅 You currently have " + events.length + " event(s).";

}
// ================================
// Next Event (Smart)
// ================================

else if(hasAny(msg,[

    "next event",
    "upcoming event",
    "my next event",
    "what is my next event"

])){

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
// Natural Conversation
// ================================

// TIRED
else if(
    msg.includes("tired") ||
    msg.includes("exhausted") ||
    msg.includes("sleepy") ||
    msg.includes("worn out") ||
    msg.includes("need rest")
){

    reply = "😴 You sound tired. Get some rest, drink water, and take care of yourself.";

}

// HUNGRY
else if(
    msg.includes("hungry") ||
    msg.includes("need food") ||
    msg.includes("starving") ||
    msg.includes("want food")
){

    reply = "🍽️ Sounds like you're hungry. Go grab something delicious to eat!";

}

// HAPPY
else if(
    msg.includes("happy") ||
    msg.includes("excited") ||
    msg.includes("feeling good") ||
    msg.includes("i feel good") ||
    msg.includes("great today") ||
    msg.includes("life is good")
){

    reply = "😊 That's wonderful! I'm really happy you're feeling good today.";

}

// SAD
else if(
    msg.includes("sad") ||
    msg.includes("upset") ||
    msg.includes("depressed") ||
    msg.includes("feeling down") ||
    msg.includes("crying") ||
    msg.includes("heartbroken")
){

    reply = "💙 I'm sorry you're feeling that way. I'm here if you want to talk.";

}

// STRESSED
else if(
    msg.includes("stressed") ||
    msg.includes("stress") ||
    msg.includes("overwhelmed") ||
    msg.includes("frustrated") ||
    msg.includes("pressure")
){

    reply = "💙 Take a deep breath. One step at a time—you've handled difficult days before, and you can handle this one too.";

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
    msg.includes("working now") ||
    msg.includes("im working") ||
    msg.includes("i'm working") ||
    msg.includes("just got to work")
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


// Default Reply
// ================================

else{

    reply = "🤖 I'm still learning.";

}

addMessage("ai", reply);

}
