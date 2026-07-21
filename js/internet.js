alert("🌐 internet.js loaded");

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
        return "🌐 What do you want me to search?";
    }

    try{

        const url =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(query);

        const response = await fetch(url);

        if(!response.ok){
            return "❌ I couldn't find anything about " + query;
        }

        const data = await response.json();

        if(data.extract){
            return "🌍 " + data.extract;
        }

        return "❌ No information found.";

    }catch(error){

        console.log(error);

        return "⚠️ Internet connection error.";

    }

}
