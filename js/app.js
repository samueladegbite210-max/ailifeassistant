function aiReply(text){

    const msg = text.toLowerCase().trim();

    let reply =
        conversationReply(msg,text) ||
        knowledgeReply(msg,text) ||
        taskReply(msg,text) ||
        goalReply(msg,text) ||
        noteReply(msg,text) ||
        eventReply(msg,text) ||
        memoryReply(msg,text) ||
        calculatorReply(msg,text) ||
        dateReply(msg,text) ||
        weatherReply(msg,text) ||
        "🤖 I'm still learning.";

    addMessage("ai", reply);

}
