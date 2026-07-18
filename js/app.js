function aiReply(text){

    const msg = text.toLowerCase().trim();

    let reply =
        conversationReply(msg, text) ||
        calculatorReply(msg) ||
        dateTimeReply(msg) ||
        tasksReply(msg, text) ||
        goalsReply(msg, text) ||
        notesReply(msg, text) ||
        eventsReply(msg, text) ||
        memoryReply(msg, text) ||
        knowledgeReply(msg) ||
        weatherReply(msg) ||
        "🤖 I'm still learning.";

    addMessage("ai", reply);

}
