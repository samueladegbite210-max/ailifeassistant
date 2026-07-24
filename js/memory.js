alert("🧠 Memory 3.0 Loaded");
memory.facts = memory.facts || [];
memory.likes = memory.likes || [];
memory.dislikes = memory.dislikes || [];
// =========================
// AI Memory
// =========================

let memory = JSON.parse(localStorage.getItem("memory")) || {
    facts: [],
    likes: [],
    dislikes: []
};

function saveMemory(){
    localStorage.setItem("memory", JSON.stringify(memory));
}

function loadMemory(){
    memory = JSON.parse(localStorage.getItem("memory")) || {
        facts: [],
        likes: [],
        dislikes: []
    };
}

function memoryReply(msg, text){

    loadMemory();

    // =========================
    // Save Personal Information
    // =========================

    if(msg.startsWith("my name is ")){
        memory.name = text.replace(/my name is /i,"").trim();
        saveMemory();
        return "😊 Nice to meet you " + memory.name + ".";
    }

    if(msg.startsWith("i live in ")){
        memory.city = text.replace(/i live in /i,"").trim();
        saveMemory();
        return "📍 I'll remember that you live in " + memory.city + ".";
    }

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

    if(msg.startsWith("i study ")){
        memory.study = text.replace(/i study /i,"").trim();
        saveMemory();
        return "📚 I'll remember what you study.";
    }

    if(msg.startsWith("my birthday is ")){
        memory.birthday = text.replace(/my birthday is /i,"").trim();
        saveMemory();
        return "🎂 Birthday saved.";
    }

    if(msg.startsWith("my favorite color is ")){
        memory.favoriteColor = text.replace(/my favorite color is /i,"").trim();
        saveMemory();
        return "🎨 Favorite color saved.";
    }

    if(msg.startsWith("my favorite food is ")){
        memory.favoriteFood = text.replace(/my favorite food is /i,"").trim();
        saveMemory();
        return "🍲 Favorite food saved.";
    }

    if(msg.startsWith("my favorite club is ")){
        memory.club = text.replace(/my favorite club is /i,"").trim();
        saveMemory();
        return "⚽ Favorite club saved.";
    }

    if(msg.startsWith("my phone number is ")){
        memory.phone = text.replace(/my phone number is /i,"").trim();
        saveMemory();
        return "📱 Phone number saved.";
    }

    if(msg.startsWith("my email is ")){
        memory.email = text.replace(/my email is /i,"").trim();
        saveMemory();
        return "📧 Email saved.";
    }

    if(msg.startsWith("i am single")){
        memory.relationship = "Single";
        saveMemory();
        return "❤️ I'll remember you're single.";
    }

    if(msg.startsWith("i am married")){
        memory.relationship = "Married";
        saveMemory();
        return "❤️ I'll remember you're married.";
    }

    // =========================
    // Likes
    // =========================

    if(msg.startsWith("i like ")){

        const item = text.replace(/i like /i,"").trim();

        if(!memory.likes.includes(item)){
            memory.likes.push(item);
        }

        saveMemory();

        return "😊 I'll remember that you like " + item + ".";
    }

    // =========================
    // Dislikes
    // =========================

    if(msg.startsWith("i don't like ")){

        const item = text.replace(/i don't like /i,"").trim();

        if(!memory.dislikes.includes(item)){
            memory.dislikes.push(item);
        }

        saveMemory();

        return "👍 I'll remember that you don't like " + item + ".";
    }

    // =========================
    // Remember Facts
    // =========================

    if(msg.startsWith("remember that ")){

    alert("REMEMBER BLOCK WORKING");

    memory.facts = memory.facts || [];

    const fact = text.replace(/remember that /i,"").trim();

    memory.facts.push(fact);

    saveMemory();

    return "🧠 I have remembered: " + fact;

}
    // =========================
    // Recall
    // =========================

    if(msg.includes("what is my name") || msg.includes("who am i")){
        return memory.name ? "😊 Your name is " + memory.name + "." : "I don't know your name yet.";
    }

    if(msg.includes("where do i live")){
        return memory.city ? "📍 You live in " + memory.city + "." : "I don't know where you live yet.";
    }

    if(msg.includes("what is my job")){
        return memory.job ? "💼 You work as " + memory.job + "." : "I don't know your job yet.";
    }

    if(msg.includes("when is my birthday")){
        return memory.birthday ? "🎂 Your birthday is " + memory.birthday + "." : "I don't know your birthday.";
    }

    if(msg.includes("what is my favorite color")){
        return memory.favoriteColor ? "🎨 Your favorite color is " + memory.favoriteColor + "." : "I don't know your favorite color.";
    }

    // =========================
    // Show Everything
    // =========================

    if(
        msg.includes("what do you remember about me") ||
        msg.includes("tell me what you know about me")
    ){

        let reply = "🧠 Here's what I know about you:\n\n";
        let hasData = false;

        function add(label,value){
            if(value){
                reply += label + value + "\n";
                hasData = true;
            }
        }

        add("👤 Name: ",memory.name);
        add("📍 Lives in: ",memory.city);
        add("💼 Job: ",memory.job);
        add("🎓 Study: ",memory.study);
        add("🎂 Birthday: ",memory.birthday);
        add("🎨 Favorite Color: ",memory.favoriteColor);
        add("🍲 Favorite Food: ",memory.favoriteFood);
        add("⚽ Favorite Club: ",memory.club);
        add("📱 Phone: ",memory.phone);
        add("📧 Email: ",memory.email);
        add("❤️ Relationship: ",memory.relationship);

        if(memory.likes.length){
            reply += "\n😊 Likes:\n";
            memory.likes.forEach(item=>reply += "• " + item + "\n");
            hasData = true;
        }

        if(memory.dislikes.length){
            reply += "\n😒 Dislikes:\n";
            memory.dislikes.forEach(item=>reply += "• " + item + "\n");
            hasData = true;
        }

        if(memory.facts.length){
            reply += "\n💡 Facts:\n";
            memory.facts.forEach(item=>reply += "• " + item + "\n");
            hasData = true;
        }

        if(!hasData){
            return "🧠 I don't know much about you yet.";
        }

        return reply;
    }

    return null;
}
