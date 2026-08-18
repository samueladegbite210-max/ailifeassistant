// ==========================================
// AI Life Assistant
// smartAI.js
// Version 5.0
// AI Controller
// ==========================================

console.log("🧠 smartAI.js loaded");


// ==========================================
// CURRENT ATTACHMENT
// ==========================================

function getCurrentAttachment(){

    return window.aiAttachment || null;

}


// ==========================================
// MAIN AI CONTROLLER
// ==========================================

async function smartAIReply(msg){

    try{

        // ----------------------------------
        // Clean message
        // ----------------------------------

        msg = String(msg || "").trim().toLowerCase();

        if(msg === ""){
            return null;
        }


        // ==================================
        // ATTACHMENT COMMANDS
        // ==================================

        if(isImageCommand(msg)){

            return await handleImageCommand(msg);

        }


        if(isFileCommand(msg)){

            return await handleFileCommand(msg);

        }


        // ==================================
        // UPLOAD MEMORY
        // ==================================

        if(
            msg.includes("what did i upload") ||
            msg.includes("what have i uploaded") ||
            msg.includes("show my uploads") ||
            msg.includes("my uploaded files")
        ){

            return getUploadList();

        }


        // ==================================
        // CONVERSATION
        // ==================================

        let answer;


        if(typeof conversationReply === "function"){

            answer = conversationReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // MEMORY
        // ==================================

        if(typeof memoryReply === "function"){

            answer = memoryReply(msg, msg);

            if(answer) return answer;

        }


        // ==================================
        // PROFILE
        // ==================================

        if(typeof profileReply === "function"){

            answer = profileReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // STREAK
        // ==================================

        if(typeof streakReply === "function"){

            answer = streakReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // LEARN USER
        // ==================================

        if(typeof learnUserReply === "function"){

            answer = learnUserReply(msg, msg);

            if(answer) return answer;

        }


        // ==================================
        // KNOWLEDGE
        // ==================================

        if(typeof knowledgeReply === "function"){

            answer = knowledgeReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // TEACHER
        // ==================================

        if(typeof teacherReply === "function"){

            answer = teacherReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // QUIZ
        // ==================================

        if(typeof quizReply === "function"){

            answer = quizReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // CALCULATOR
        // ==================================

        if(typeof calculatorReply === "function"){

            answer = calculatorReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // DATE / TIME
        // ==================================

        if(typeof dateTimeReply === "function"){

            answer = dateTimeReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // TASKS
        // ==================================

        if(typeof taskReply === "function"){

            answer = taskReply(msg, msg);

            if(answer) return answer;

        }


        // ==================================
        // GOALS
        // ==================================

        if(typeof goalReply === "function"){

            answer = goalReply(msg, msg);

            if(answer) return answer;

        }


        // ==================================
        // NOTES
        // ==================================

        if(typeof noteReply === "function"){

            answer = noteReply(msg, msg);

            if(answer) return answer;

        }


        // ==================================
        // EVENTS
        // ==================================

        if(typeof eventReply === "function"){

            answer = eventReply(msg, msg);

            if(answer) return answer;

        }


        // ==================================
        // NATURAL CONVERSATION
        // ==================================

        if(typeof naturalReply === "function"){

            answer = naturalReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // FOOD
        // ==================================

        if(typeof foodReply === "function"){

            answer = foodReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // WEATHER
        // ==================================

        if(typeof weatherReply === "function"){

            answer = weatherReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // AI BRAIN
        // ==================================

        if(typeof aiBrainReply === "function"){

            answer = await aiBrainReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // ADVICE
        // ==================================

        if(typeof adviceReply === "function"){

            answer = adviceReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // INTERNET
        // ==================================

        if(typeof internetReply === "function"){

            answer = await internetReply(msg);

            if(answer) return answer;

        }


        // ==================================
        // DEFAULT
        // ==================================

        return "🤖 I couldn't find an answer yet. Try asking another question.";

    }

    catch(error){

        console.error("❌ smartAIReply error:", error);

        return (
            "⚠️ I ran into a problem while processing that.\n\n" +
            error.message
        );

    }

}



// ==========================================
// IMAGE COMMAND DETECTION
// ==========================================

function isImageCommand(msg){

    return (

        msg.includes("describe the image") ||

        msg.includes("describe image") ||

        msg.includes("what is in the image") ||

        msg.includes("what's in the image") ||

        msg.includes("analyze the image") ||

        msg.includes("analyze image") ||

        msg.includes("read text from image") ||

        msg.includes("read the text from image") ||

        msg.includes("extract text from image") ||

        msg.includes("text in the image") ||

        msg.includes("what does the image say")

    );

}



// ==========================================
// FILE COMMAND DETECTION
// ==========================================

function isFileCommand(msg){

    return (

        msg.includes("summarize the file") ||

        msg.includes("summarize file") ||

        msg.includes("explain the file") ||

        msg.includes("explain the contents") ||

        msg.includes("read the file") ||

        msg.includes("read this file") ||

        msg.includes("find important information") ||

        msg.includes("important information in the file") ||

        msg.includes("answer questions about the file")

    );

}



// ==========================================
// IMAGE COMMAND HANDLER
// ==========================================

async function handleImageCommand(msg){

    const attachment = getCurrentAttachment();

if(!attachment){

        return (
            "📷 I don't currently have an image attached.\n\n" +
            "Please upload an image first."
        );

    }


    if(attachment.type !== "image"){

        return (
            "📎 The current attachment isn't an image.\n\n" +
            "Please upload an image."
        );

    }


    // ----------------------------------
    // OCR request
    // ----------------------------------

    if(
        msg.includes("read text") ||
        msg.includes("extract text") ||
        msg.includes("what does the image say") ||
        msg.includes("text in the image")
    ){

        if(typeof readImageText === "function"){

            return await readImageText(
                attachment.data
            );

        }

        return (
            "📝 I have the image, but the OCR engine isn't connected yet."
        );

    }


    // ----------------------------------
    // Description / analysis
    // ----------------------------------

    if(
        msg.includes("describe") ||
        msg.includes("what is in") ||
        msg.includes("analyze")
    ){

        if(typeof analyzeImage === "function"){

            return await analyzeImage(
                currentAttachment.data
            );

        }

        return (
            "👀 I have the image, but the AI vision engine isn't connected yet."
        );

    }


    return (
        "📷 I have your image ready.\n\n" +
        "You can ask me to:\n\n" +
        "📝 Read the text\n" +
        "👀 Describe the image\n" +
        "🔍 Analyze the image\n" +
        "❓ Answer questions about it"
    );

}



// ==========================================
// FILE COMMAND HANDLER
// ==========================================

async function handleFileCommand(msg){

    if(!currentAttachment){

        return (
            "📂 I don't currently have a file attached.\n\n" +
            "Please upload a file first."
        );

    }


    if(currentAttachment.type !== "file"){

        return (
            "📎 The current attachment isn't a document.\n\n" +
            "Please upload a file."
        );

    }


    if(typeof analyzeFile === "function"){

        return await analyzeFile(
            currentAttachment.file
        );

    }


    return (
        "📄 I have your file, but the document-reading engine isn't connected yet."
    );

}



// ==========================================
// UPLOAD LIST
// ==========================================

function getUploadList(){

    if(
        typeof uploadedFiles === "undefined" ||
        uploadedFiles.length === 0
    ){

        return "📂 You haven't uploaded any files yet.";

    }


    let reply = "📂 Uploaded files:\n\n";


    uploadedFiles.forEach((file,index)=>{

        reply += (
            `${index + 1}. ${file.name} ` +
            `(${file.type})\n`
        );

    });


    return reply;

}
