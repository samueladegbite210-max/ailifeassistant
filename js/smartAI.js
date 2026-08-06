// ==========================================
// AI Life Assistant
// smartAI.js
// Version 4.0
// AI Controller
// ==========================================


alert("🧠 smartAI.js loaded");

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

    answer = profileReply(msg);
if(answer) return answer;
    
    answer = streakReply(msg);
if(answer) return answer;
    
answer = learnUserReply(msg, msg);
if(answer) return answer;

    // Knowledge
    answer = knowledgeReply(msg);
    if(answer) return answer;

    answer = teacherReply(msg);
if(answer) return answer;

    answer = quizReply(msg);
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

    if(text.toLowerCase().includes("what did i upload")){

    if(uploadedFiles.length === 0){

        return "📂 You haven't uploaded any files yet.";

    }

    let reply = "📂 Uploaded files:\n\n";

    uploadedFiles.forEach(file=>{

        reply += `• ${file.name} (${file.type})\n`;

    });

    return reply;

}
    return "🤖 I couldn't find an answer yet. Try asking another question.";

}
