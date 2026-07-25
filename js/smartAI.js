
alert("🧠 smartAI.js loaded");
alert("smartAIReply is running");
async function smartAIReply(msg){

    // Clean message
    msg = msg.toLowerCase().trim();

    if(msg === ""){
        return null;
    }

    let answer = null;

    // Conversation
    answer = conversationReply(msg);
    if(answer) return answer;

    // Memory (move this near the top)
    answer = memoryReply(msg, msg);
    if(answer) return answer;
    answer = contextReply(msg);
    if(answer) return answer;
    answer = learnUserReply(msg, msg);
    if(answer) return answer;
    // Knowledge
    answer = knowledgeReply(msg);
    if(answer) return answer;

    // Calculator
    answer = calculatorReply(msg);
    if(answer) return answer;

    // Date & Time
    answer = dateTimeReply(msg);
    if(answer) return answer;

    // Tasks
    answer = taskReply(msg, msg);
    if(answer) return answer;

    // Goals
    answer = goalReply(msg, msg);
    if(answer) return answer;

    // Notes
    answer = noteReply(msg, msg);
    if(answer) return answer;

    // Events
    answer = eventReply(msg, msg);
    if(answer) return answer;

    // Natural Conversation
    answer = naturalReply(msg);
    if(answer) return answer;

    // Food
    answer = foodReply(msg);
    if(answer) return answer;

    // Weather
    answer = weatherReply(msg);
    if(answer) return answer;

    // Brain
    answer = aiBrainReply(msg);
    if(answer) return answer;

    // Advice
    answer = adviceReply(msg);
    if(answer) return answer;

    // Internet
    answer = await internetReply(msg);
    if(answer) return answer;

    return "🤖 I couldn't find an answer yet. Try asking another question.";

}
