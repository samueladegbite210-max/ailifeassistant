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

    // Learn Mother
if(msg.includes("my mother is")){

    memory.mother = text.replace(/my mother is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👩 I'll remember your mother.";
}

// Learn Father
if(msg.includes("my father is")){

    memory.father = text.replace(/my father is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👨 I'll remember your father.";
}

// Learn Brother
if(msg.includes("my brother is")){

    memory.brother = text.replace(/my brother is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👦 I'll remember your brother.";
}

// Learn Sister
if(msg.includes("my sister is")){

    memory.sister = text.replace(/my sister is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👧 I'll remember your sister.";
}
    // Learn Mother
if(msg.includes("my mother is")){

    memory.mother = text.replace(/my mother is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👩 I'll remember your mother.";
}

// Learn Father
if(msg.includes("my father is")){

    memory.father = text.replace(/my father is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👨 I'll remember your father.";
}

// Learn Brother
if(msg.includes("my brother is")){

    memory.brother = text.replace(/my brother is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👦 I'll remember your brother.";
}

// Learn Sister
if(msg.includes("my sister is")){

    memory.sister = text.replace(/my sister is/i,"").trim();

    localStorage.setItem("memory", JSON.stringify(memory));

    return "👧 I'll remember your sister.";
}
    return null;

}
