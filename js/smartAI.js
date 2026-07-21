alert("🧠 smartAI.js loaded");

async function smartAIReply(msg){

    // Ignore empty messages
    if(msg.trim() === ""){
        return null;
    }

    // Try local brain first
    let local =
        conversationReply(msg) ||
        knowledgeReply(msg) ||
        calculatorReply(msg) ||
        dateTimeReply(msg) ||
        taskReply(msg,msg) ||
        goalReply(msg,msg) ||
        noteReply(msg,msg) ||
        eventReply(msg,msg) ||
        memoryReply(msg,msg) ||
        naturalReply(msg) ||
        foodReply(msg) ||
        weatherReply(msg) ||
        aiBrainReply(msg) ||
        adviceReply(msg);

    if(local){
        return local;
    }

    // If nobody knows...
    return await internetReply("search " + msg);

}
