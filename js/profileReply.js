alert("👤 Profile Reply Loaded");

function profileReply(msg){

    msg = msg.toLowerCase();

    if(
        msg.includes("my profile") ||
        msg.includes("show profile") ||
        msg.includes("profile")
    ){

        return showProfileStats();

    }

    return null;

}
