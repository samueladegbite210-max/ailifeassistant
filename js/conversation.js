function conversationReply(msg, text){

    // Greetings
    if(hasAny(msg,["hi","hello","hey"])){

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

    if(msg.includes("thank you") || msg.includes("thanks")){

        return "❤️ You're welcome! I'm always here to help.";

    }

    if(msg.includes("good luck")){

        return "🍀 Good luck! I wish you success.";

    }

    if(msg.includes("i love you")){

        return "❤️ Thank you! I appreciate you too.";

    }

    if(msg.includes("bye") || msg.includes("goodbye")){

        return "👋 Goodbye! Have a wonderful day.";

    }

    return null;

}
