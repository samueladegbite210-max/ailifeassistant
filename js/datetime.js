function dateTimeReply(msg){

    const now = new Date();

    if(
        msg.includes("time") ||
        msg.includes("current time") ||
        msg.includes("what time is it")
    ){

        return "🕒 Current time: " + now.toLocaleTimeString();

    }

    if(
        msg.includes("date") ||
        msg.includes("today") ||
        msg.includes("what is today's date")
    ){

        return "📅 Today is " + now.toDateString();

    }

    if(msg.includes("day")){

        return "📆 Today is " + now.toLocaleDateString(undefined,{weekday:"long"});

    }

    return null;

}
