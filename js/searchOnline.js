alert("searchOnline.js loaded");

function searchOnlineReply(msg){

    if(
        msg.includes("search") ||
        msg.includes("look up") ||
        msg.includes("find")
    ){
        return "🌐 Internet Search is coming in AI Life Assistant Version 2.0.";
    }

    return null;
}
