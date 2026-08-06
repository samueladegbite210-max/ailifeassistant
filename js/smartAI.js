
// ==========================================
// AI Life Assistant Brain
// Version 4.0
// Clean Foundation
// ==========================================

alert("🧠 smartAI.js loaded");

// ------------------------------------------
// Safe Reply Caller
// ------------------------------------------

function runReply(fn, ...args){

    try{

        if(typeof fn === "function"){

            return fn(...args);

        }

    }catch(error){

        console.error(error);

    }

    return null;

}

// ------------------------------------------
// Main AI
// ------------------------------------------

async function smartAIReply(message){

    message = message.trim().toLowerCase();

    if(message === ""){

        return "Please type something.";

    }

    let answer;

    // --------------------------------------
    // Upload Memory
    // --------------------------------------

    if(
        message.includes("what did i upload") ||
        message.includes("uploaded file") ||
        message.includes("uploaded files")
    ){

        if(
            typeof uploadedFiles === "undefined" ||
            uploadedFiles.length === 0
        ){

            return "📂 You haven't uploaded any files yet.";

        }

        let reply = "📂 Uploaded files:\n\n";

        uploadedFiles.forEach(file=>{

            reply += `• ${file.name} (${file.type})\n`;

        });

        return reply;

    }
answer = runReply(uploadReply, message);

if(answer) return answer;
    // --------------------------------------
    // Conversation
    // --------------------------------------

    answer = runReply(conversationReply,message);
    if(answer) return answer;

    answer = runReply(memoryReply,message,message);
    if(answer) return answer;

    answer = runReply(profileReply,message);
    if(answer) return answer;

    answer = runReply(streakReply,message);
    if(answer) return answer;

    answer = runReply(learnUserReply,message,message);
    if(answer) return answer;

    // --------------------------------------
    // Knowledge
    // --------------------------------------

    answer = runReply(knowledgeReply,message);
    if(answer) return answer;

    answer = runReply(teacherReply,message);
    if(answer) return answer;

    answer = runReply(quizReply,message);
    if(answer) return answer;

    // --------------------------------------
    // Productivity
    // --------------------------------------

    answer = runReply(taskReply,message,message);
    if(answer) return answer;

    answer = runReply(goalReply,message,message);
    if(answer) return answer;

    answer = runReply(noteReply,message,message);
    if(answer) return answer;

    answer = runReply(eventReply,message,message);
    if(answer) return answer;

    // --------------------------------------
    // Utilities
    // --------------------------------------

    answer = runReply(calculatorReply,message);
    if(answer) return answer;

    answer = runReply(dateTimeReply,message);
    if(answer) return answer;

    answer = runReply(foodReply,message);
    if(answer) return answer;

    answer = runReply(weatherReply,message);
    if(answer) return answer;

    // --------------------------------------
    // AI Brain
    // --------------------------------------

    answer = runReply(aiBrainReply,message);
    if(answer) return answer;

    answer = runReply(adviceReply,message);
    if(answer) return answer;

    // --------------------------------------
    // Internet
    // --------------------------------------

    try{

        if(typeof internetReply === "function"){

            answer = await internetReply(message);

            if(answer) return answer;

        }

    }catch(error){

        console.error(error);

    }

    // --------------------------------------
    // Default
    // --------------------------------------

    return "🤖 I couldn't find an answer yet. Try asking another question.";

}
