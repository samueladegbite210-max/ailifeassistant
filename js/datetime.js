
function dateTimeReply(msg){

    // Date
    if(
        msg.includes("date") ||
        msg.includes("today's date") ||
        msg.includes("today date") ||
        msg.includes("current date") ||
        msg.includes("what is today's date") ||
        msg.includes("what's today's date") ||
        msg.includes("what is the date") ||
        msg.includes("what's the date")
    ){

        return "📅 Today is " + new Date().toDateString();

    }

    // Time
    if(
        msg.includes("time") ||
        msg.includes("what time is it") ||
        msg.includes("current time") ||
        msg.includes("time now") ||
        msg.includes("tell me the time")
    ){

        return "🕒 The current time is " +
            new Date().toLocaleTimeString();

    }

    // Day
    if(
        msg.includes("day") ||
        msg.includes("what day is today") ||
        msg.includes("today is what day") ||
        msg.includes("current day")
    ){

        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        return "📆 Today is " + days[new Date().getDay()];

    }

    // Month
    if(
        msg.includes("month") ||
        msg.includes("what month is it") ||
        msg.includes("current month") ||
        msg.includes("what month is this")
    ){

        const months = [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        ];

        return "📅 This month is " +
            months[new Date().getMonth()];

    }

    // Year
    if(
        msg.includes("year") ||
        msg.includes("what year is it") ||
        msg.includes("current year")
    ){

        return "📅 The current year is " +
            new Date().getFullYear();

    }

    return null;

}
