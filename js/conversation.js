function conversationReply(msg, text){

    // Greetings
    if(msg === "hi" || msg === "hello" || msg === "hey"){
        return "👋 Hello Samuel! How can I help you today?";
    }

    if(msg.includes("good morning")){
        return "🌅 Good morning, Samuel!";
    }

    if(msg.includes("good afternoon")){
        return "☀️ Good afternoon, Samuel!";
    }

    if(msg.includes("good evening")){
        return "🌇 Good evening, Samuel!";
    }

    if(msg.includes("good night")){
        return "🌙 Good night, Samuel!";
    }

    if(msg.includes("how are you")){
        return "😊 I'm doing great! How about you?";
    }

    if(msg.includes("who are you")){
        return "🤖 I'm AI Life Assistant, your personal AI companion.";
    }

    if(msg.includes("who made you") ||
       msg.includes("who created you")){
        return "💙 I was built by Samuel with the help of ChatGPT.";
    }

    if(msg.includes("what can you do")){
        return "🚀 I can help with coding, studying, planning, notes, tasks, goals, events, reminders, calculations and much more.";
    }

    // Natural Conversation
    if(msg.includes("tired") ||
       msg.includes("exhausted") ||
       msg.includes("sleepy")){
        return "😴 You sound tired. Get some rest, drink water and take care of yourself.";
    }

    if(msg.includes("hungry") ||
       msg.includes("starving")){
        return "🍽️ Sounds like you're hungry. Go grab something delicious to eat!";
    }

    if(msg.includes("happy") ||
       msg.includes("excited") ||
       msg.includes("feeling good")){
        return "😊 That's wonderful! I'm really happy you're feeling good today.";
    }

    if(msg.includes("sad") ||
       msg.includes("upset") ||
       msg.includes("depressed") ||
       msg.includes("feeling down")){
        return "💙 I'm sorry you're feeling that way. I'm here if you want to talk.";
    }

    if(msg.includes("bored")){
        return "🎮 You're bored? Let's learn something new, review your goals, or create a new project.";
    }

    if(msg.includes("at work") ||
       msg.includes("working now") ||
       msg.includes("going to work")){
        return "💼 Have a productive day! Stay safe and do your best.";
    }

    if(msg.includes("thank you") ||
       msg.includes("thanks") ||
       msg.includes("thank u") ||
       msg.includes("thx")){
        return "❤️ You're very welcome! I'm always here whenever you need me.";
    }

    if(msg.includes("good luck")){
        return "🍀 Thank you! I wish you success in everything you do.";
    }

    if(msg.includes("i love you") ||
       msg.includes("love you")){
        return "❤️ Thank you! I appreciate you too. I'll always be here to help you.";
    }

    if(msg.includes("good job") ||
       msg.includes("well done") ||
       msg.includes("nice work")){
        return "😊 Thank you! That really means a lot.";
    }

    if(msg.includes("bye") ||
       msg.includes("goodbye") ||
       msg.includes("see you")){
        return "👋 Goodbye! Have a wonderful day. I'll be here whenever you need me.";
    }

    return null;
}
