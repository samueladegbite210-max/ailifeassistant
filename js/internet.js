alert("🌐 internet.js loaded");

async function internetReply(msg){

    let query = msg
        .replace("search","")
        .replace("find","")
        .replace("look up","")
        .replace("who is","")
        .replace("what is","")
        .replace("tell me about","")
        .replace("explain","")
        .trim();

    if(query === ""){
        return null;
    }

    try{

        const url =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(query);

        const response = await fetch(url);

        if(!response.ok){
            return null;
        }

        const data = await response.json();

        if(data.extract){
            return "🌍 " + data.extract;
        }

        return null;

    }catch(error){
        console.log(error);
        return null;
    }

}
