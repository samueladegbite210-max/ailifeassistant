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
if (conversation) {
    addMessage("ai", conversation);
    return;
}

let knowledge = knowledgeReply(msg);
if (knowledge) {
    addMessage("ai", knowledge);
    return;
}

let calculator = calculatorReply(msg);
if (calculator) {
    addMessage("ai", calculator);
    return;
}

let dateTime = dateTimeReply(msg);
if (dateTime) {
    addMessage("ai", dateTime);
    return;
}

let task = taskReply(msg, text);
if (task) {
    addMessage("ai", task);
    return;
}

let goal = goalReply(msg, text);
if (goal) {
    addMessage("ai", goal);
    return;
}

let note = noteReply(msg, text);
if (note) {
    addMessage("ai", note);
    return;
}

let event = eventReply(msg, text);
if (event) {
    addMessage("ai", event);
    return;
}

let memory = memoryReply(msg, text);
if (memory) {
    addMessage("ai", memory);
    return;
}

let natural = naturalReply(msg);
if (natural) {
    addMessage("ai", natural);
    return;
}

let weather = weatherReply(msg);
if (weather) {
    addMessage("ai", weather);
    return;
}

addMessage("ai", "🤖 I'm still learning.");
 

  

 


// Default Reply
// ================================

else{

    reply = "🤖 I'm still learning.";

}

addMessage("ai", reply);

}
