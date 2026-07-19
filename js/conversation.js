function conversationReply(msg, text){

    alert("Message received: " + msg);

    if(msg.includes("how")){
        return "😊 I received HOW.";
    }

    if(msg.includes("good")){
        return "🌅 I received GOOD.";
    }

    if(msg.includes("who")){
        return "🤖 I received WHO.";
    }

    if(msg === "hi"){
        return "👋 Hello Samuel!";
    }

    return null;
}
