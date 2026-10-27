
let events = JSON.parse(localStorage.getItem("events")) || [];

function eventReply(msg, text){

    // Create Event
    if(
        msg.startsWith("create an event called ") ||
        msg.startsWith("add an event called ")
    ){

        let eventName = text
            .replace(/create an event called /i,"")
            .replace(/add an event called /i,"")
            .trim();

        if(eventName === ""){
            return "❌ Please enter an event.";
        }

        events.push({
            id: Date.now(),
            title: eventName,
            date: new Date().toISOString().split("T")[0],
            time: ""
        });

        localStorage.setItem("events", JSON.stringify(events));

        return "📅 Event created successfully!";
    }

    // Show Events
    if(hasAny(msg,[
        "show my events",
        "show events",
        "my events",
        "list events",
        "list my events"
    ])){

        if(events.length === 0){
            return "📅 You don't have any events yet.";
        }

        let reply = "📅 <strong>Your Events</strong><br><br>";

        events.forEach(function(event,index){

            reply +=
                (index+1) + ". " +
                event.title +
                "<br>📆 " + event.date +
                "<br><br>";

        });

        return reply;
    }

    // Event Count
    if(hasAny(msg,[
        "how many events",
        "event count",
        "number of events"
    ])){

        return "📅 You currently have " + events.length + " event(s).";
    }

    return null;
}
