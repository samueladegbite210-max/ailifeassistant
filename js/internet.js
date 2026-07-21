alert("internet.js loaded");

async function internetReply(msg){

    if(
        !msg.includes("search") &&
        !msg.includes("find") &&
        !msg.includes("look up")
    ){
        return null;
    }

    let query = msg
        .replace("search","")
        .replace("find","")
        .replace("look up","")
        .trim();

    if(query===""){
        return "🌐 What do you want me to search for?";
    }

    return "🔎 Searching for: " + query + "...";
}
