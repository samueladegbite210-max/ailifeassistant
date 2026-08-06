// ==========================================
// AI Life Assistant
// smartAI.js
// Version 4.0
// AI Controller
// ==========================================

console.log("🧠 smartAI.js loaded");

// ==========================================
// MAIN AI CONTROLLER
// ==========================================

async function smartAIReply(message){

    message = message.trim();

    if(message === ""){
        return "Please type a message.";
    }

    let answer = null;

    // ======================================
    // Conversation
    // ======================================

    answer = runReply(conversationReply, message);
    if(answer) return answer;

    // ======================================
    // Calculator
    // ======================================

    answer = runReply(calculatorReply, message);
    if(answer) return answer;

    // ======================================
    // Default
    // ======================================

    return "🤖 I don't understand yet.";

}

// ==========================================
// SAFE MODULE RUNNER
// ==========================================

function runReply(fn, message){

    try{

        if(typeof fn !== "function"){
            return null;
        }

        return fn(message);

    }catch(error){

        console.error("AI Module Error:", error);

        return null;

    }

}
