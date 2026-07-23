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
// ==========================
// Remember Facts
// ==========================

if(msg.startsWith("remember that ")){

    memory.facts = memory.facts || [];

    const fact = text.replace(/remember that /i,"").trim();

    memory.facts.push(fact);

    localStorage.setItem("memory", JSON.stringify(memory));

    return "🧠 I'll remember that: " + fact;
}
    // ==========================
// Show Memory
// ==========================

if(

    msg.includes("what do you remember about me") ||

    msg.includes("tell me what you know about me")

){

    let reply = "🧠 Here's what I know about you:\n\n";

    let hasData = false;

    if(memory.name){

        reply += "👤 Name: " + memory.name + "\n";

        hasData = true;

    }

    if(memory.city){

        reply += "📍 Lives in: " + memory.city + "\n";

        hasData = true;

    }

    if(memory.job){

        reply += "💼 Job: " + memory.job + "\n";

        hasData = true;

    }

    if(memory.facts && memory.facts.length){

        reply += "\n💡 Things you've told me:\n";

        memory.facts.forEach(function(fact){

            reply += "• " + fact + "\n";

        });

        hasData = true;

    }

    if(!hasData){

        return "🧠 I don't know much about you yet.";

    }

    return reply;

}
    return null;
}
