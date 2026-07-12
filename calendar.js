
let events = JSON.parse(localStorage.getItem("events")) || [];

const eventList = document.getElementById("eventList");

// Load events when page opens
renderEvents();

function addEvent() {

    const title = document.getElementById("eventTitle").value.trim();
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const location = document.getElementById("eventLocation").value.trim();
    const notes = document.getElementById("eventNotes").value.trim();
    const reminder = document.getElementById("eventReminder").value;
    const repeat = document.getElementById("eventRepeat").value;

    if (title === "" || date === "") {
        alert("Please enter an Event Title and Date.");
        return;
    }

    const newEvent = {
        title: title,
        date: date,
        time: time,
        location: location,
        notes: notes,
        reminder: reminder,
        repeat: repeat
    };

    events.push(newEvent);

    localStorage.setItem("events", JSON.stringify(events));

    renderEvents();

    // Clear form
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventNotes").value = "";
    document.getElementById("eventReminder").value = "none";
    document.getElementById("eventRepeat").value = "none";

    alert("✅ Event saved successfully!");

}

function renderEvents() {

    eventList.innerHTML = "";
events.sort(function(a, b){

    return new Date(a.date + " " + (a.time || "00:00")) -
           new Date(b.date + " " + (b.time || "00:00"));

});
    if (events.length === 0) {
        eventList.innerHTML = "<li>No upcoming events.</li>";
        return;
    }

    events.forEach(function(event, index){

        const li = document.createElement("li");

        li.className = "event";

        li.innerHTML = `
            <strong>${event.title}</strong><br>
            📅 ${event.date}
            ${event.time ? "<br>🕒 " + event.time : ""}
            ${event.location ? "<br>📍 " + event.location : ""}
            ${event.notes ? "<br>📝 " + event.notes : ""}
            <br><br>

            <button onclick="deleteEvent(${index})">
                🗑️ Delete
            </button>
        `;

        eventList.appendChild(li);

    });

}

function deleteEvent(index){

    if(confirm("Delete this event?")){

        events.splice(index,1);

        localStorage.setItem("events", JSON.stringify(events));

        renderEvents();

    }
    
}
    
