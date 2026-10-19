
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
updateCalendarSummary();
loadTodayEvent();
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

        const card = document.createElement("div");

card.className = "card";

card.innerHTML = `
    <h3>📅 ${event.title}</h3>

    <p><strong>Date:</strong> ${event.date}</p>

    ${event.time ? `<p><strong>Time:</strong> ${event.time}</p>` : ""}

    ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ""}

    ${event.notes ? `<p><strong>Notes:</strong> ${event.notes}</p>` : ""}

    <button onclick="editEvent(${index})">
        ✏️ Edit
    </button>

    <button onclick="deleteEvent(${index})">
        🗑 Delete
    </button>
`;
        eventList.appendChild(card);

    });

}

function deleteEvent(index){

    if(confirm("Delete this event?")){

        events.splice(index,1);

        localStorage.setItem("events", JSON.stringify(events));

        renderEvents();
updateCalendarSummary();
loadTodayEvent();
    }
    
}
function editEvent(index){

    const event = events[index];

    document.getElementById("eventTitle").value = event.title;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventTime").value = event.time;
    document.getElementById("eventLocation").value = event.location;
    document.getElementById("eventNotes").value = event.notes;
    document.getElementById("eventReminder").value = event.reminder;
    document.getElementById("eventRepeat").value = event.repeat;

    events.splice(index,1);

    localStorage.setItem("events", JSON.stringify(events));

    renderEvents();

}
    
// ==========================
// Next Upcoming Event
// ==========================

function loadNextEvent(){

    const nextEventBox = document.getElementById("nextEvent");

    if(!nextEventBox) return;

    let events = JSON.parse(localStorage.getItem("events")) || [];

    if(events.length === 0){

        nextEventBox.innerHTML = "<p>No upcoming events.</p>";

        return;

    }

    events.sort(function(a,b){

        return new Date(a.date + " " + (a.time || "00:00")) -
               new Date(b.date + " " + (b.time || "00:00"));

    });

    const next = events[0];

    nextEventBox.innerHTML = `
        <strong>📅 ${next.title}</strong><br>
        ${next.date}<br>
        ${next.time ? "🕒 " + next.time : ""}
    `;

}

loadNextEvent();
document.getElementById("searchEvent").addEventListener("input", function(){

    const keyword = this.value.toLowerCase().trim();

    // If search box is empty, show all events again
    if(keyword === ""){
        renderEvents();
        return;
    }

    const container = document.getElementById("eventList");
    container.innerHTML = "";

    events
    .filter(function(event){

        return (
            (event.title || "").toLowerCase().includes(keyword) ||
            (event.location || "").toLowerCase().includes(keyword) ||
            (event.notes || "").toLowerCase().includes(keyword)
        );

    })
    .forEach(function(event, index){

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>📅 ${event.title}</h3>

            <p><strong>Date:</strong> ${event.date}</p>

            ${event.time ? `<p>🕒 ${event.time}</p>` : ""}
            ${event.location ? `<p>📍 ${event.location}</p>` : ""}
            ${event.notes ? `<p>📝 ${event.notes}</p>` : ""}

            <button onclick="editEvent(${index})">✏️ Edit</button>

            <button onclick="deleteEvent(${index})">🗑 Delete</button>
        `;

        container.appendChild(card);

    });

    // If nothing matches
    if(container.innerHTML === ""){
        container.innerHTML = "<p>❌ No matching events found.</p>";
    }

});
// ==========================
// Calendar Summary
// ==========================

function updateCalendarSummary(){

    const events = JSON.parse(localStorage.getItem("events")) || [];

    const today = new Date().toISOString().split("T")[0];

    const upcoming = events.filter(event => event.date >= today);

    const todayEvents = events.filter(event => event.date === today);

    document.getElementById("totalEvents").textContent = events.length;

    document.getElementById("todayEvents").textContent = todayEvents.length;

    document.getElementById("upcomingEvents").textContent = upcoming.length;

}
// ==========================
// Today's Event
// ==========================

function loadTodayEvent(){

    const box = document.getElementById("todayEvent");

    if(!box) return;

    const events = JSON.parse(localStorage.getItem("events")) || [];

    const today = new Date().toISOString().split("T")[0];

    const todayEvents = events.filter(event => event.date === today);

    if(todayEvents.length === 0){

        box.innerHTML = "No events today.";

        return;

    }

    box.innerHTML = "";

    todayEvents.forEach(function(event){

        box.innerHTML += `
            <strong>${event.title}</strong><br>
            📅 ${event.date}<br>
            ${event.time ? "🕒 " + event.time : ""}
            <br><br>
        `;

    });

}
renderEvents();
updateCalendarSummary();
loadTodayEvent();
loadNextEvent();



window.migrateEventsToSupabase = async function () {
    try {
        const client = window.supabaseClient;

        if (!client) {
            alert("Supabase is unavailable. Please try again.");
            return;
        }

        const { data: authData, error: authError } =
            await client.auth.getUser();

        if (authError) throw authError;

        if (!authData.user) {
            alert("Please sign in before backing up your events.");
            return;
        }

        const savedEvents = JSON.parse(
            localStorage.getItem("events") || "[]"
        );

        if (!Array.isArray(savedEvents) || savedEvents.length === 0) {
            alert("No saved browser events were found.");
            return;
        }

        const { data: existingRows, error: readError } =
            await client
                .from("events")
                .select("event_data")
                .eq("user_id", authData.user.id);

        if (readError) throw readError;

        const existingIds = new Set(
            (existingRows || [])
                .map(row => row.event_data.legacyId)
                .filter(Boolean)
        );

        const records = savedEvents
            .map((event, index) => ({
                user_id: authData.user.id,
                event_data: {
                    ...event,
                    legacyId: "browser-event-" + index
                }
            }))
            .filter(record =>
                !existingIds.has(record.event_data.legacyId)
            );

        if (records.length === 0) {
            alert("Your saved browser events are already backed up. No duplicates were added.");
            return;
        }

        const { error } = await client
            .from("events")
            .insert(records);

        if (error) throw error;

        alert(
            "Success! " + records.length +
            " events backed up to Supabase. Your original browser events remain untouched."
        );

    } catch (error) {
        console.error("Event backup failed:", error);
        alert("Event backup failed: " + error.message);
    }
};

