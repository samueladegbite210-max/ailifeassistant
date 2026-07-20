
function brainReply(msg, text){
    // ===== Greetings =====
    if(hasAny(msg,[
        "hi","hello","hey"
    ])){
        return "👋 Hello! How can I help you today?";
    }
    // ===== Feelings =====
    if(
        msg.includes("i'm sad") ||
        msg.includes("i am sad")
    ){
        return "💙 I'm sorry you're feeling sad. I'm here for you. Want to talk about it?";
    }
    if(
        msg.includes("i'm happy") ||
        msg.includes("i am happy")
    ){
        return "😊 That's wonderful! I'm happy you're feeling good today.";
    }
    if(
        msg.includes("i'm bored") ||
        msg.includes("i am bored")
    ){
        return "🎉 Let's do something productive! Maybe review your goals or ask me something interesting.";
    }
    if(
        msg.includes("i'm stressed") ||
        msg.includes("i am stressed")
    ){
        return "💙 Take a deep breath. One step at a time. You've overcome difficult days before.";
    }
    // ===== Food =====
    if(
        msg.includes("hungry") ||
        msg.includes("what should i eat") ||
        msg.includes("food")
    ){
        return "🍽️ I'd recommend something healthy like rice, chicken, eggs, beans, fruit or vegetables.";
    }
    // ===== Motivation =====
    if(
        msg.includes("motivate me")
    ){
        return "💪 Success comes from small consistent steps. Keep building your AI Life Assistant—you are creating something amazing.";
    }
    // ===== Joke =====
    if(
        msg.includes("joke")
    ){
        return "😂 Why do programmers prefer dark mode? Because light attracts bugs!";
    }
    // ===== Creator =====
    if(
        msg.includes("who created you") ||
        msg.includes("who made you")
    ){
        return "🤖 I was built by Samuel with the help of ChatGPT.";
    }
    // ===== Identity =====
    if(
        msg.includes("who are you")
    ){
        return "🤖 I'm AI Life Assistant. I'm here to help you organize your life and answer your questions.";
    }
    return null;
}
