
alert("advice.js loaded");
function adviceReply(msg){
alert("Advice received: " + msg);
    
    // Food
    if(
        msg.includes("what should i eat") ||
        msg.includes("what can i eat") ||
        msg.includes("what do i eat")
    ){
        return "🍽️ Eat something balanced like rice and chicken, beans, eggs, fruits, or vegetables. Drink plenty of water too.";
    }

    // Sleep
    if(
        msg.includes("should i sleep") ||
        msg.includes("i am tired") ||
        msg.includes("i'm tired")
    ){
        return "😴 If you're tired, get some rest. A good sleep helps your body and mind recover.";
    }

    // Study
    if(
        msg.includes("how can i study") ||
        msg.includes("study tips")
    ){
        return "📚 Study in short focused sessions (25–30 minutes), then take a 5-minute break.";
    }

    // Motivation
    if(
        msg.includes("motivate me") ||
        msg.includes("i feel lazy")
    ){
        return "💪 Small progress every day is better than doing nothing. Start with one small task.";
    }

    // Exercise
    if(
        msg.includes("exercise") ||
        msg.includes("workout")
    ){
        return "🏃 Even a 20-minute walk or light workout is great for your health.";
    }

    return null;
}
