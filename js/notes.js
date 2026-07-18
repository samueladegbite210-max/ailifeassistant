
 // ======================
// Create Note
// ======================
else if(

    msg.includes("i have") &&
    (
        msg.includes("tomorrow") ||
        msg.includes("today") ||
        msg.includes("monday") ||
        msg.includes("tuesday") ||
        msg.includes("wednesday") ||
        msg.includes("thursday") ||
        msg.includes("friday") ||
        msg.includes("saturday") ||
        msg.includes("sunday")
    )

){

    events.push({

        title: text,

        date: new Date().toISOString().split("T")[0],

        time: "",

        location: "",

        notes: "",

        reminder: "none",

        repeat: "none"

    });

    localStorage.setItem("events", JSON.stringify(events));

    reply = "📅 I've added that to your events.";

}
else if(
    msg.startsWith("create a note called ") ||
    msg.startsWith("save a note called ") ||
    msg.startsWith("add a note called ")
){

    let noteText = text;

    noteText = noteText.replace(/create a note called /i,"");
    noteText = noteText.replace(/save a note called /i,"");
    noteText = noteText.replace(/add a note called /i,"");

    noteText = noteText.trim();

    let currentNotes = localStorage.getItem("notes") || "";

    if(currentNotes !== ""){
        currentNotes += "\n\n";
    }

    currentNotes += noteText;

    localStorage.setItem("notes", currentNotes);

    reply = "📝 Note saved successfully!";

}

/// ======================
// Show Notes (Smart)
// ======================

else if(hasAny(msg,[

    "show my notes",
    "show notes",
    "list my notes",
    "list notes",
    "my notes",
    "notes",
    "what are my notes",
    "do i have notes",
    "do i have any notes",
    "can i see my notes",
    "note list"

])){

    let notes = localStorage.getItem("notes") || "";

    if(notes.trim() === ""){

        reply = "📝 You don't have any notes yet.";

    }else{

        reply =
        "<strong>📝 Your Notes</strong><br><br>" +
        notes.replace(/\n/g,"<br>");

    }

}
 // ======================
// Note Count (Smart)
// ======================

else if(hasAny(msg,[

    "how many notes",
    "note count",
    "number of notes",
    "total notes"

])){

    let notes = localStorage.getItem("notes") || "";

    if(notes.trim() === ""){

        reply = "📝 You don't have any notes.";

    }else{

        const total = notes.split("\n\n").length;

        reply = "📝 You currently have " + total + " note(s).";

    }

}
// ======================
// Search Notes
// ======================

else if(msg.startsWith("search notes for ")){

    let notes = localStorage.getItem("notes") || "";

    const keyword = msg.replace("search notes for ","").trim();

    if(notes.toLowerCase().includes(keyword.toLowerCase())){

        reply =
        "<strong>📝 Found in Notes</strong><br><br>" +
        notes.replace(/\n/g,"<br>");

    }else{

        reply = "❌ No matching notes found.";

    }

}
