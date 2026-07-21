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

    let answer = await smartAIReply(msg);

    if(answer){
        addMessage("ai", answer);
        return;
    }
window.addEventListener("load", function () {
    startVoiceRecognition();
});
 function startVoiceRecognition(){

    if(!("webkitSpeechRecognition" in window)){
        alert("❌ Your browser doesn't support voice recognition.");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event){

        const text = event.results[0][0].transcript;

        input.value = text;

        sendMessage();

    };

    recognition.start();

}
    addMessage("ai","🤖 I'm still learning.");

}
    
