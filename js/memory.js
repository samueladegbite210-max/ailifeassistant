alert("🧠 Memory 2.0 Loaded");

// ==========================
// Memory Storage
// ==========================

let memory = JSON.parse(localStorage.getItem("memory")) || {
    facts: []
};

function saveMemory(){

    localStorage.setItem(
        "memory",
        JSON.stringify(memory)
    );

}

function memoryReply(msg, text){

    msg = msg.toLowerCase().trim();

    memory = JSON.parse(localStorage.getItem("memory")) || {
        facts:[]
    };

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

        memory.city = text.replace(/i live in /i,"").trim();

        saveMemory();

        return "📍 I'll remember that.";

    }

    // ==========================
    // SAVE JOB
    // ==========================

    if(
        msg.startsWith("i work as ") ||
        msg.startsWith("i work at ") ||
        msg.startsWith("my job is ")
    ){

        memory.job = text
        .replace(/i work as /i,"")
        .replace(/i work at /i,"")
        .replace(/my job is /i,"")
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

        return "🎂 Birthday saved.";

    }

    // ==========================
    // SAVE FAVORITE COLOR
    // ==========================

    if(msg.startsWith("my favorite color is ")){

        memory.favoriteColor = text
        .replace(/my favorite color is /i,"")
        .trim();

        saveMemory();

        return "🎨 Favorite color saved.";

    }

    // ==========================
    // SAVE FAVORITE FOOD
    // ==========================

    if(msg.startsWith("my favorite food is ")){

        memory.favoriteFood = text
        .replace(/my favorite food is /i,"")
        .trim();

        saveMemory();

        return "🍲 Favorite food saved.";

    }

    // ==========================
    // SAVE STUDY
    // ==========================

    if(msg.startsWith("i study ")){

        memory.study = text
        .replace(/i study /i,"")
        .trim();

        saveMemory();

        return "📚 I'll remember what you study.";

    }

    // ==========================
    // SAVE FAVORITE CLUB
    // ==========================

    if(msg.startsWith("my favorite club is ")){

        memory.club = text
        .replace(/my favorite club is /i,"")
        .trim();

        saveMemory();

        return "⚽ Favorite club saved.";

    }
    // ==========================
// LEARN USER INFORMATION
// ==========================

if(msg.startsWith("i like ")){

    memory.likes = memory.likes || [];
    memory.likes.push(text.replace(/i like /i,"").trim());

    saveMemory();

    return "😊 I'll remember what you like.";
}

if(msg.startsWith("i don't like ")){

    memory.dislikes = memory.dislikes || [];
    memory.dislikes.push(text.replace(/i don't like /i,"").trim());

    saveMemory();

    return "👍 I'll remember what you don't like.";
}

if(msg.startsWith("my phone number is ")){

    memory.phone = text.replace(/my phone number is /i,"").trim();

    saveMemory();

    return "📱 I'll remember your phone number.";
}

if(msg.startsWith("my email is ")){

    memory.email = text.replace(/my email is /i,"").trim();

    saveMemory();

    return "📧 I'll remember your email.";
}

if(msg.startsWith("i am married")){

    memory.relationship = "Married";

    saveMemory();

    return "❤️ I'll remember you're married.";
}

if(msg.startsWith("i am single")){

    memory.relationship = "Single";

    saveMemory();

    return "❤️ I'll remember you're single.";
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

    if(memory.study){
        reply += "🎓 Study: " + memory.study + "\n";
        hasData = true;
    }

    if(memory.birthday){
        reply += "🎂 Birthday: " + memory.birthday + "\n";
        hasData = true;
    }

    if(memory.color){
        reply += "🎨 Favorite Color: " + memory.color + "\n";
        hasData = true;
    }

    if(memory.club){
        reply += "⚽ Favorite Club: " + memory.club + "\n";
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
    if(memory.phone){

    reply += "📱 Phone: " + memory.phone + "\n";

    hasData = true;

}

if(memory.email){

    reply += "📧 Email: " + memory.email + "\n";

    hasData = true;

}

if(memory.relationship){

    reply += "❤️ Relationship: " + memory.relationship + "\n";

    hasData = true;

}

if(memory.likes && memory.likes.length){

    reply += "\n😊 Likes:\n";

    memory.likes.forEach(function(item){

        reply += "• " + item + "\n";

    });

    hasData = true;

}

if(memory.dislikes && memory.dislikes.length){

    reply += "\n😒 Dislikes:\n";

    memory.dislikes.forEach(function(item){

        reply += "• " + item + "\n";

    });

    hasData = true;

}
