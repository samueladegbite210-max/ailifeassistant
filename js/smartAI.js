
// ==========================================
// AI Life Assistant Brain
// Version 4.0
// Clean Foundation
// ==========================================

alert("🧠 smartAI.js loaded");

// ------------------------------------------
// Safe Reply Caller
// ------------------------------------------
async function smartAIReply(msg){

    msg = msg.toLowerCase().trim();

    let answer;

    if(typeof conversationReply === "function"){
        answer = conversationReply(msg);
        if(answer) return answer;
    }

    if(typeof calculatorReply === "function"){
        answer = calculatorReply(msg);
        if(answer) return answer;
    }

    return "🤖 I don't understand yet.";

}
