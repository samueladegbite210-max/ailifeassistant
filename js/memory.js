alert("memory.js loaded");

let memory = JSON.parse(localStorage.getItem("memory")) || {};

function memoryReply(msg, text){

    // Save Name
    if(msg.startsWith("my name is ")){

        memory.name = text.replace(/my name is /i,"").trim();

        localStorage.setItem("memory", JSON.stringify(memory));

        return "😊 Nice to meet you, " + memory.name + ". I'll remember your name.";
    }

    // Save Location
    if(msg.startsWith("i live in ")){

        memory.city = text.replace(/i live in /i,"").trim();

        localStorage.setItem("memory", JSON.stringify(memory));

        return "📍 I'll remember that you live in " + memory.city + ".";
    }

    // Save Job
    if(msg.startsWith("i work as ")){

        memory.job = text.replace(/i work as /i,"").trim();

        localStorage.setItem("memory", JSON.stringify(memory));

        return "💼 I'll remember that you work as " + memory.job + ".";
    }

    // Recall Name
    if(
        msg.includes("what is my name") ||
        msg.includes("who am i")
    ){

        if(memory.name){
            return "😊 Your name is " + memory.name + ".";
        }

        return "I don't know your name yet.";
    }

    // Recall City
    if(msg.includes("where do i live")){

        if(memory.city){
            return "📍 You live in " + memory.city + ".";
        }

        return "I don't know where you live yet.";
    }

    // Recall Job
    if(msg.includes("what is my job")){

        if(memory.job){
            return "💼 You work as " + memory.job + ".";
        }

        return "I don't know your job yet.";
    }

    return null;
}
