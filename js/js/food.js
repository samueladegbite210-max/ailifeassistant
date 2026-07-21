alert("✅ food.js loaded");
function foodReply(msg){

    if(
    
    msg.includes("what should i eat") ||
    msg.includes("what can i eat") ||
    msg.includes("recommend food") ||
    msg.includes("food")
){
    return "🍽️ I'd recommend rice, chicken, eggs, beans, vegetables, fruits or anything healthy that's available.";
}

    if(msg.includes("i am hungry") || msg.includes("i'm hungry")){
        return "🍽️ Sounds like you're hungry! Try eating a healthy meal instead of skipping food.";
    }

    if(msg.includes("healthy food")){
        return "🥗 Healthy foods include vegetables, fruits, beans, fish, eggs, chicken and whole grains.";
    }

    if(msg.includes("drink water")){
        return "💧 Yes! Staying hydrated helps your body and brain work better.";
    }

    return null;
}
