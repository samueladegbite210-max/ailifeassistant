alert("🔥 Streak Reply Loaded");

function streakReply(msg){

    msg = msg.toLowerCase();

    if(
        msg.includes("show my streak") ||
        msg.includes("my streak")
    ){

        return showStreak();

    }

    return null;

}
