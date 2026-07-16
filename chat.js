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

    const msg = text.toLowerCase().trim();

    let reply = "";

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

    else{

        reply = "🤖 I'm still learning.";

    }

    addMessage("ai", reply);

}
