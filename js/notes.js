alert("NOTES FILE LOADED");
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function noteReply(msg, text){

    // Create Note
    if(
 msg.startsWith("create a note ") ||
msg.startsWith("create note ") ||
msg.startsWith("add a note ") ||
msg.startsWith("add note ") ||
msg.startsWith("save note ") ||
msg.startsWith("save a note ")
    ){

        let noteText = text
            .replace(/create a note called /i,"")
            .replace(/add a note called /i,"")
            .replace(/save a note called /i,"")
            .trim();

        if(noteText === ""){
            return "❌ Please enter a note.";
        }

        notes.push({
            id: Date.now(),
            text: noteText
        });

        localStorage.setItem("notes", JSON.stringify(notes));

        return "📝 Note saved successfully!";
    }

    // Show Notes
    if(hasAny(msg,[
    "show my note",
    "show my notes",
    "show note",
    "show notes",
    "my note",
    "my notes",
    "list note",
    "list notes",
    "list my note",
    "list my notes"
]))
        if(notes.length === 0){
            return "📝 You don't have any notes yet.";
        }

        let reply = "📝 <strong>Your Notes</strong><br><br>";

        notes.forEach(function(note,index){
            reply += (index + 1) + ". " + note.text + "<br>";
        });

        return reply;
    }

    // Note Count
    if(hasAny(msg,[
        "how many notes",
        "note count",
        "number of notes"
    ])){

        return "📝 You currently have " + notes.length + " note(s).";
    }

    return null;
}
