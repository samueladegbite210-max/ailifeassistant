alert("Knowledge loaded");
function knowledgeReply(msg){

    if(msg.includes("what is ai")){
        return "🤖 Artificial Intelligence (AI) enables computers to perform tasks that normally require human intelligence.";
    }

    if(msg.includes("what is nigeria")){
        return "🇳🇬 Nigeria is a country in West Africa with 36 states and the Federal Capital Territory, Abuja.";
    }

    if(msg.includes("capital of nigeria")){
        return "🏛️ The capital of Nigeria is Abuja.";
    }

    if(msg.includes("president of nigeria")){
        return "🇳🇬 The President of Nigeria is Bola Ahmed Tinubu.";
    }

    if(msg.includes("what is programming")){
        return "💻 Programming is the process of writing instructions that tell computers what to do.";
    }

    if(msg.includes("what is python")){
        return "🐍 Python is one of the world's most popular programming languages used for AI, web development and automation.";
    }

    if(msg.includes("what is java")){
        return "☕ Java is a programming language widely used for Android apps and enterprise software.";
    }

    if(msg.includes("what is coding")){
        return "💻 Coding means writing instructions that computers can understand and execute.";
    }

    if(msg.includes("who is albert einstein")){
        return "🧠 Albert Einstein was a famous physicist who developed the Theory of Relativity.";
    }

    if(msg.includes("what is electricity")){
        return "⚡ Electricity is the flow of electric charge used to power electrical devices.";
    }

    if(msg.includes("tell me a joke")){
        return "😂 Why do programmers prefer dark mode? Because light attracts bugs!";
    }

    if(msg.includes("motivate me")){
        return "💪 Every expert was once a beginner. Keep learning—you are building something amazing.";
    }

    return null;

}
