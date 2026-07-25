// ==========================
// Conversation Context
// ==========================

let chatContext = JSON.parse(localStorage.getItem("chatContext")) || [];

function saveContext(role, message){

    chatContext.push({
        role: role,
        message: message,
        time: Date.now()
    });

    // Keep only the latest 50 messages
    if(chatContext.length > 50){
        chatContext.shift();
    }

    localStorage.setItem(
        "chatContext",
        JSON.stringify(chatContext)
    );

}

function getContext(){

    return chatContext;

}

function clearContext(){

    chatContext = [];

    localStorage.removeItem("chatContext");

}
