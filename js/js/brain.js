alert("brain.js loaded");

function brainReply(msg, text){

    // Feelings
    if(msg.includes("i am sad") || msg.includes("i'm sad")){
        return "💙 I'm sorry you're feeling sad. Remember, difficult moments don't last forever. I'm here to talk if you need me.";
    }

    if(msg.includes("i am happy") || msg.includes("i'm happy")){
        return "😊 That's wonderful! I'm really glad you're having a good day.";
    }

    if(msg.includes("i am tired") || msg.includes("i'm tired")){
        return "😴 You deserve some rest. Make sure you're drinking water and taking breaks.";
    }

    if(msg.includes("i am bored") || msg.includes("i'm bored")){
        return "🎉 Let's do something fun! You could work on one of your goals, learn something new, or ask me a question.";
    }

    // Greetings
    if(msg.includes("good morning")){
        return "🌅 Good morning! I hope you have an amazing day.";
    }

    if(msg.includes("good night")){
        return "🌙 Good night! Sleep well and recharge for tomorrow.";
    }

    // Jokes
    if(msg.includes("tell me a joke")){
        return "😂 Why do programmers prefer dark mode? Because light attracts bugs!";
    }

    // Motivation
    if(msg.includes("motivate me")){
        return "💪 Every expert was once a beginner. Keep going—you are building something amazing.";
    }

    // Food
    if(msg.includes("what should i eat")){
        return "🍽️ A balanced meal with protein, vegetables, and carbohydrates is always a great choice!";
    }

    return null;
}
