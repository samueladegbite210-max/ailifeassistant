function knowledgeReply(msg){

    // Programming
    if(msg.includes("what is html")){
        return "🌐 HTML stands for HyperText Markup Language. It builds the structure of websites.";
    }

    if(msg.includes("what is css")){
        return "🎨 CSS styles websites using colors, layouts and animations.";
    }

    if(msg.includes("what is javascript")){
        return "💻 JavaScript makes websites interactive.";
    }

    if(msg.includes("what is programming")){
        return "💻 Programming is the process of writing instructions that tell a computer what to do.";
    }

    if(msg.includes("what is coding")){
        return "💻 Coding means writing instructions that computers can understand.";
    }

    if(msg.includes("what is python")){
        return "🐍 Python is one of the world's most popular programming languages. It is used for AI, web development, automation and data science.";
    }

    if(msg.includes("what is java")){
        return "☕ Java is a programming language used for Android apps, enterprise software and web applications.";
    }

    if(msg.includes("what is ai") ||
       msg.includes("artificial intelligence")){
        return "🤖 Artificial Intelligence enables computers to learn, reason and solve problems like humans.";
    }

    // Nigeria
    if(msg.includes("what is nigeria")){
        return "🇳🇬 Nigeria is a country in West Africa with 36 states and the Federal Capital Territory, Abuja.";
    }

    if(msg.includes("capital of nigeria")){
        return "🏛️ The capital of Nigeria is Abuja.";
    }

    if(msg.includes("president of nigeria")){
        return "🇳🇬 The President of Nigeria is Bola Ahmed Tinubu.";
    }

    // General Knowledge
    if(msg.includes("who is albert einstein")){
        return "🧠 Albert Einstein was a famous physicist who developed the Theory of Relativity.";
    }

    if(msg.includes("what is the internet")){
        return "🌍 The Internet is a worldwide network connecting billions of computers.";
    }

    if(msg.includes("what is electricity")){
        return "⚡ Electricity is the flow of electric charge used to power devices.";
    }

    if(msg.includes("what is love")){
        return "❤️ Love is a deep feeling of care, affection and commitment.";

    }

    // Fun
    if(msg.includes("tell me a joke")){
        return "😂 Why do programmers prefer dark mode? Because light attracts bugs!";
    }

    if(msg.includes("motivate me")){
        return "💪 Every expert was once a beginner. Keep learning and never give up.";
    }

    if(msg.includes("who is samuel")){
        return "💙 Samuel is my creator and the developer of AI Life Assistant.";
    }

    return null;

}
