function weatherReply(msg){

    if(
        msg.includes("weather") ||
        msg.includes("temperature") ||
        msg.includes("forecast") ||
        msg.includes("is it raining") ||
        msg.includes("is it sunny")
    ){

        return "🌤️ I can't check live weather yet. This feature will be available in AI Life Assistant Version 2.0 with real-time internet access.";

    }

    return null;

}
