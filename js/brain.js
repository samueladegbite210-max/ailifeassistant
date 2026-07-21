alert("brain.js loaded");
alert(typeof match);
function aiBrainReply(msg){

    // ===== GREETINGS =====
    if(match(msg,[
        "hi","hello","hey",
        "good morning",
        "good afternoon",
        "good evening",
        "good night"
    ])){
        return "👋 Hello Samuel! How can I help you today?";
    }

    // ===== FOOD =====
    if(match(msg,[
        "eat",
        "food",
        "hungry",
        "meal",
        "breakfast",
        "lunch",
        "dinner"
    ])){
        return "🍽️ I recommend eating something healthy like rice, chicken, eggs, beans, vegetables and fruits.";
    }

    // ===== SLEEP =====
    if(match(msg,[
        "sleep",
        "sleeping",
        "tired",
        "rest"
    ])){
        return "😴 You sound tired. I think you should get some rest and drink plenty of water.";
    }

    // ===== CREATOR =====
    if(match(msg,[
        "who create you",
        "who created you",
        "who made you",
        "who built you"
    ])){
        return "🤖 I was built by Samuel with the help of ChatGPT.";
    }

    // ===== IDENTITY =====
    if(match(msg,[
        "who are you",
        "what are you",
        "tell me about yourself"
    ])){
        return "🤖 I'm AI Life Assistant, your personal AI companion.";
    }

    // ===== KNOW USER =====
    if(match(msg,[
        "do you know me",
        "who am i"
    ])){
        return "💙 Of course! You're Samuel, and we've been building AI Life Assistant together.";
    }

    return null;
}
