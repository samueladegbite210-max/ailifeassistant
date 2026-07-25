alert("🧠 learnUser.js Loaded");

function learnUserReply(msg, text){

    msg = msg.toLowerCase().trim();

    memory = JSON.parse(localStorage.getItem("memory")) || {};

    // Learn pet
    if(msg.includes("my dog is")){

        memory.dog = text.replace(/my dog is/i,"").trim();

        localStorage.setItem("memory", JSON.stringify(memory));

        return "🐶 I'll remember your dog's name.";
    }

    // Learn girlfriend
    if(msg.includes("my girlfriend is")){

        memory.girlfriend = text.replace(/my girlfriend is/i,"").trim();

        localStorage.setItem("memory", JSON.stringify(memory));

        return "❤️ I'll remember your girlfriend.";
    }

    // Learn wife
    if(msg.includes("my wife is")){

        memory.wife = text.replace(/my wife is/i,"").trim();

        localStorage.setItem("memory", JSON.stringify(memory));

        return "❤️ I'll remember your wife.";
    }

    return null;

}
