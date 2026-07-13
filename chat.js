// Get elements
const input = document.getElementById("userInput");
const chat = document.getElementById("chatBox");

// Send message
function sendMessage(){

    const text = input.value.trim();

    if(text === "") return;

    chat.innerHTML += `
    <div class="message user">
        ${text}
    </div>
    `;

    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    setTimeout(function(){

        const msg = text.toLowerCase();
        let reply = "";

        // Greetings
        if(msg.includes("hello") || msg.includes("hi")){
            reply = "👋 Hello Samuel! How can I help you today?";
        }

        // Open pages
        else if(msg.includes("open tasks")){
            reply = "✅ Opening Tasks...";
            setTimeout(()=>window.location.href="tasks.html",1000);
        }

        else if(msg.includes("open notes")){
            reply = "📝 Opening Notes...";
            setTimeout(()=>window.location.href="notes.html",1000);
        }

        else if(msg.includes("open goals")){
            reply = "🎯 Opening Goals...";
            setTimeout(()=>window.location.href="goals.html",1000);
        }

        else if(msg.includes("open calendar")){
            reply = "📅 Opening Calendar...";
            setTimeout(()=>window.location.href="calendar.html",1000);
        }

        else if(msg.includes("open profile")){
            reply = "👤 Opening Profile...";
            setTimeout(()=>window.location.href="profile.html",1000);
        }

        // Productivity
        else if(msg.includes("task")){
            reply = "✅ Keep completing your tasks one at a time.";
        }

        else if(msg.includes("goal")){
            reply = "🎯 Stay focused. Every small step gets you closer to your goal.";
        }

        else if(msg.includes("calendar") || msg.includes("event")){
            reply = "📅 Don't forget to check your upcoming events.";
        }

        else if(msg.includes("note")){
            reply = "📝 Your notes are saved automatically.";
        }

        // Motivation
        else if(msg.includes("motivate me")){
            reply = "💙 Don't give up. Consistency beats perfection.";
        }

        else if(msg.includes("thank")){
            reply = "😊 You're welcome, Samuel!";
        }

        else if(msg.includes("good morning")){
            reply = "🌅 Good morning! Let's make today productive.";
        }

        else if(msg.includes("good night")){
            reply = "🌙 Good night. Get some good rest.";
        }

        // Default reply
        else{
            reply = "🤖 I'm still learning. More AI features are coming soon!";
        }

        chat.innerHTML += `
        <div class="message ai">
            ${reply}
        </div>
        `;

        chat.scrollTop = chat.scrollHeight;

    },800);

}

// Press Enter
input.addEventListener("keypress",function(event){
    if(event.key==="Enter"){
        sendMessage();
    }
});

// Voice input
function startVoice(){

    if(!('webkitSpeechRecognition' in window)){
        alert("Voice recognition is not supported on this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang="en-US";

    recognition.start();

    recognition.onresult=function(event){

        input.value = event.results[0][0].transcript;

        sendMessage();

    };

}
