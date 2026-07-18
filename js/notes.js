let notes = localStorage.getItem("notes") || "";

function noteReply(msg, text){

    // ======================
    // Create Note
    // ======================

    if(
        msg.startsWith("create a note called ") ||
        msg.startsWith("save a note called ") ||
        msg.startsWith("add a note called ")
    ){

        let noteText = text
            .replace(/create a note called /i,"")
            .replace(/save a note called /i,"")
            .replace(/add a note called /i,"")
            .trim();

        let currentNotes = localStorage.getItem("notes") || "";

        if(currentNotes !== ""){
            currentNotes += "\n\n";
        }

        currentNotes += noteText;

        localStorage.setItem("notes", currentNotes);

        return "📝 Note saved successfully!";

    }

    // ======================
    // Show Notes
    // ======================

    if(hasAny(msg,[

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
            return "📝 You don't have any notes yet.";
        }

        return "<strong>📝 Your Notes</strong><br><br>" +
               notes.replace(/\n/g,"<br>");

    }

    // ======================
    // Note Count
    // ======================

    if(hasAny(msg,[

        "how many notes",
        "note count",
        "number of notes",
        "total notes"

    ])){

        let notes = localStorage.getItem("notes") || "";

        if(notes.trim()===""){
            return "📝 You don't have any notes.";
        }

        const total = notes.split("\n\n").length;

        return "📝 You currently have " + total + " note(s).";

    }

    // ======================
    // Search Notes
    // ======================

    if(msg.startsWith("search notes for ")){

        let notes = localStorage.getItem("notes") || "";

        const keyword = msg.replace("search notes for ","").trim();

        if(notes.toLowerCase().includes(keyword.toLowerCase())){

            return "<strong>📝 Found in Notes</strong><br><br>" +
                   notes.replace(/\n/g,"<br>");

        }

        return "❌ No matching notes found.";

    }

    return null;

}
