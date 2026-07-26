alert("🧠 Context Reply Loaded");

function contextReply(msg){

    // Safety check
    if(typeof getContext !== "function"){
        return null;
    }

    const history = getContext();

    if(!Array.isArray(history)){
        return null;
    }

    if(
        msg.includes("what did i tell you") ||
        msg.includes("what were we talking about") ||
        msg.includes("what did i say earlier")
    ){

        const userMessages = history.filter(item => item.role === "user");

        if(userMessages.length === 0){
            return "🧠 I don't remember any previous conversation yet.";
        }

        let reply = "🧠 Here's what you've told me recently:\n\n";

        userMessages.slice(-5).forEach(function(item){
            reply += "• " + item.message + "\n";
        });

        return reply;
    }

    return null;
}
