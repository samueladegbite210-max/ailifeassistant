
let events = [];
let currentUserId = null;
let eventsLoaded = false;
let editingEventId = null;

const eventList = document.getElementById("eventList");
const searchEvent = document.getElementById("searchEvent");

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

async function loadEvents() {
    try {
        const client = window.supabaseClient;
        if (!client) throw new Error("Supabase client is unavailable.");

        const { data: authData, error: authError } =
            await client.auth.getUser();

        if (authError) throw authError;
        if (!authData.user) {
            throw new Error("Please sign in to access your events.");
        }

        currentUserId = authData.user.id;

        const { data, error } = await client
            .from("events")
            .select("id, event_data")
            .eq("user_id", currentUserId);

        if (error) throw error;

        events = (data || []).map(row => ({
            ...row.event_data,
            dbId: row.id
        }));

        eventsLoaded = true;
        renderEvents();
        updateCalendarSummary();
        loadTodayEvent();
        loadNextEvent();

    } catch (error) {
        console.error("Unable to load events:", error);
        alert("Unable to load your events. Please sign in and try again.");
    }
}

function renderEvents() {
    if (!eventsLoaded || !eventList) return;

    eventList.innerHTML = "";

    const keyword = searchEvent
        ? searchEvent.value.toLowerCase().trim()
        : "";

    const filtered = [...events]
        .filter(event =>
            [event.title, event.location, event.notes]
                .some(value => String(value || "").toLowerCase().includes(keyword))
        )
        .sort((a, b) =>
            new Date(a.date + "T" + (a.time || "00:00")) -
            new Date(b.date + "T" + (b.time || "00:00"))
        );

    if (filtered.length === 0) {
        eventList.textContent = keyword
            ? "No matching events found."
            : "No upcoming events.";
        return;
    }

    filtered.forEach(event => {
        const card = document.createElement("div");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = "📅 " + (event.title || "");

        const details = document.createElement("div");
        details.innerHTML = `
            <p><strong>Date:</strong> ${escapeHtml(event.date)}</p>
            ${event.time ? `<p><strong>Time:</strong> ${escapeHtml(event.time)}</p>` : ""}
            ${event.location ? `<p><strong>Location:</strong> ${escapeHtml(event.location)}</p>` : ""}
            ${event.notes ? `<p><strong>Notes:</strong> ${escapeHtml(event.notes)}</p>` : ""}
            ${event.reminder ? `<p><strong>Reminder:</strong> ${escapeHtml(event.reminder)}</p>` : ""}
            ${event.repeat ? `<p><strong>Repeat:</strong> ${escapeHtml(event.repeat)}</p>` : ""}
        `;

        const editButton = document.createElement("button");
        editButton.textContent = "✏️ Edit";
        editButton.onclick = () => editEvent(event.dbId);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";
        deleteButton.onclick = () => deleteEvent(event.dbId);

        card.append(title, details, editButton, deleteButton);
        eventList.appendChild(card);
    });
}

async function addEvent() {
    if (!eventsLoaded || !currentUserId) {
        alert("Please wait for your events to finish loading.");
        return;
    }

    const title = document.getElementById("eventTitle").value.trim();
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const location = document.getElementById("eventLocation").value.trim();
    const notes = document.getElementById("eventNotes").value.trim();
    const reminder = document.getElementById("eventReminder").value;
    const repeat = document.getElementById("eventRepeat").value;

    if (!title || !date) {
        alert("Please enter an Event Title and Date.");
        return;
    }

    const eventData = {
        title, date, time, location, notes, reminder, repeat
    };

    try {
        if (editingEventId) {
            const existing = events.find(event => event.dbId === editingEventId);
            if (!existing) throw new Error("The event could not be found.");

            const { data, error } = await window.supabaseClient
                .from("events")
                .update({ event_data: eventData })
                .eq("id", editingEventId)
                .eq("user_id", currentUserId)
                .select("id, event_data")
                .single();

            if (error) throw error;

            events = events.map(event =>
                event.dbId === editingEventId
                    ? { ...data.event_data, dbId: data.id }
                    : event
            );
        } else {
            const { data, error } = await window.supabaseClient
                .from("events")
                .insert({
                    user_id: currentUserId,
                    event_data: eventData
                })
                .select("id, event_data")
                .single();

            if (error) throw error;

            events.push({ ...data.event_data, dbId: data.id });
        }

        editingEventId = null;
        clearEventForm();
        renderEvents();
        updateCalendarSummary();
        loadTodayEvent();
        loadNextEvent();

        alert("✅ Event saved successfully!");

    } catch (error) {
        console.error("Unable to save event:", error);
        alert("Unable to save your event: " + error.message);
    }
}

function editEvent(dbId) {
    const event = events.find(item => item.dbId === dbId);
    if (!event) return;

    editingEventId = dbId;
    document.getElementById("eventTitle").value = event.title || "";
    document.getElementById("eventDate").value = event.date || "";
    document.getElementById("eventTime").value = event.time || "";
    document.getElementById("eventLocation").value = event.location || "";
    document.getElementById("eventNotes").value = event.notes || "";
    document.getElementById("eventReminder").value = event.reminder || "none";
    document.getElementById("eventRepeat").value = event.repeat || "none";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteEvent(dbId) {
    if (!confirm("Delete this event?")) return;

    const event = events.find(item => item.dbId === dbId);
    if (!event || !currentUserId) return;

    try {
        const { error } = await window.supabaseClient
            .from("events")
            .delete()
            .eq("id", dbId)
            .eq("user_id", currentUserId);

        if (error) throw error;

        events = events.filter(item => item.dbId !== dbId);

        if (editingEventId === dbId) {
            editingEventId = null;
            clearEventForm();
        }

        renderEvents();
        updateCalendarSummary();
        loadTodayEvent();
        loadNextEvent();

    } catch (error) {
        console.error("Unable to delete event:", error);
        alert("Unable to delete your event. Please try again.");
    }
}

function clearEventForm() {
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventNotes").value = "";
    document.getElementById("eventReminder").value = "none";
    document.getElementById("eventRepeat").value = "none";
}

function updateCalendarSummary() {
    if (!eventsLoaded) return;

    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    document.getElementById("totalEvents").textContent = events.length;
    document.getElementById("todayEvents").textContent =
        events.filter(event => event.date === todayString).length;
    document.getElementById("upcomingEvents").textContent =
        events.filter(event => event.date >= todayString).length;
}

function loadTodayEvent() {
    const box = document.getElementById("todayEvent");
    if (!box || !eventsLoaded) return;

    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const todayEvents = events.filter(event => event.date === todayString);

    box.innerHTML = "";

    if (todayEvents.length === 0) {
        box.textContent = "No events today.";
        return;
    }

    todayEvents.forEach(event => {
        const item = document.createElement("p");
        item.textContent =
            event.title + " — " + event.date +
            (event.time ? " at " + event.time : "");
        box.appendChild(item);
    });
}

function loadNextEvent() {
    const box = document.getElementById("nextEvent");
    if (!box || !eventsLoaded) return;

    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const upcoming = [...events]
        .filter(event => event.date >= todayString)
        .sort((a, b) =>
            new Date(a.date + "T" + (a.time || "00:00")) -
            new Date(b.date + "T" + (b.time || "00:00"))
        );

    box.textContent = upcoming.length
        ? upcoming[0].title + " — " + upcoming[0].date +
          (upcoming[0].time ? " at " + upcoming[0].time : "")
        : "No upcoming events.";
}

if (searchEvent) {
    searchEvent.addEventListener("input", renderEvents);
}

loadEvents();




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

