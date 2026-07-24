alert("memory.js loaded");

// ==========================
// AI Memory
// ==========================

let memory = JSON.parse(localStorage.getItem("memory")) || {};

function saveMemory(){

    localStorage.setItem(
        "memory",
        JSON.stringify(memory)
    );

}

function memoryReply(msg, text){

    memory = JSON.parse(localStorage.getItem("memory")) || {};

    // ==========================
    // SAVE NAME
    // ==========================

    if(msg.startsWith("my name is ")){

        memory.name = text.replace(/my name is /i,"").trim();

        saveMemory();

        return "😊 Nice to meet you, " + memory.name + ".";
    }

    // ==========================
    // SAVE CITY
    // ==========================

    if(msg.startsWith("i live in ")){

    const city = text.replace(/i live in /i,"").trim();

    memory.city = city;

    localStorage.setItem("memory", JSON.stringify(memory));

    return "📍 I'll remember that you live in " + city + ".";
}

    // ==========================
    // SAVE JOB
    // ==========================

    if(
        msg.startsWith("i work as ") ||
        msg.startsWith("i work at ") ||
        msg.startsWith("my job is ") ||
        msg.startsWith("i am a ")
    ){

        memory.job = text
            .replace(/i work as /i,"")
            .replace(/i work at /i,"")
            .replace(/my job is /i,"")
            .replace(/i am a /i,"")
            .trim();

        saveMemory();

        return "💼 I'll remember your job.";
    }

    // ==========================
    // SAVE BIRTHDAY
    // ==========================

    if(msg.startsWith("my birthday is ")){

        memory.birthday = text.replace(/my birthday is /i,"").trim();

        saveMemory();

        return "🎂 I'll remember your birthday.";
    }

    // ==========================
    // SAVE FAVORITE COLOR
    // ==========================

    if(msg.startsWith("my favorite color is ")){

        memory.favoriteColor = text.replace(/my favorite color is /i,"").trim();

        saveMemory();

        return "🎨 I'll remember your favorite color.";
    }

    // ==========================
    // SAVE FACTS
    // ==========================

    if(msg.startsWith("remember that ")){

    alert("Remember block reached");

    memory.facts = memory.facts || [];

    const fact = text.replace(/remember that /i,"").trim();

    memory.facts.push(fact);

    saveMemory();

    return "🧠 I'll remember that.";

    }

    // ==========================
    // RECALL NAME
    // ==========================

    if(msg.includes("what is my name") || msg.includes("who am i")){

        return memory.name
            ? "😊 Your name is " + memory.name + "."
            : "I don't know your name yet.";

    }

    // ==========================
    // RECALL CITY
    // ==========================

    if(msg.includes("where do i live")){

        return memory.city
            ? "📍 You live in " + memory.city + "."
            : "I don't know where you live yet.";

    }

    // ==========================
    // RECALL JOB
    // ==========================

    if(msg.includes("what is my job")){

        return memory.job
            ? "💼 You work as " + memory.job + "."
            : "I don't know your job yet.";

    }

    // ==========================
    // RECALL BIRTHDAY
    // ==========================

    if(msg.includes("when is my birthday")){

        return memory.birthday
            ? "🎂 Your birthday is " + memory.birthday + "."
            : "I don't know your birthday yet.";

    }

    // ==========================
    // RECALL FAVORITE COLOR
    // ==========================

    if(msg.includes("what is my favorite color")){

        return memory.favoriteColor
            ? "🎨 Your favorite color is " + memory.favoriteColor + "."
            : "I don't know your favorite color yet.";

    }

    // ==========================
    // SHOW EVERYTHING
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

        if(memory.birthday){

            reply += "🎂 Birthday: " + memory.birthday + "\n";

            hasData = true;

        }

        if(memory.favoriteColor){

            reply += "🎨 Favorite Color: " + memory.favoriteColor + "\n";

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
