alert("NOTES FILE LOADED");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function noteReply(msg, text){

    // Save Note
    if(
        msg.startsWith("create a note ") ||
        msg.startsWith("add note ") ||
        msg.startsWith("save note ")
    ){

        let noteText = text
            .replace(/create a note /i,"")
            .replace(/add note /i,"")
            .replace(/save note /i,"")
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
    if(
        msg.includes("show my note") ||
        msg.includes("show my notes") ||
        msg.includes("list notes") ||
        msg.includes("my notes")
    ){

        if(notes.length === 0){
            return "📝 You don't have any notes yet.";
        }

        let reply = "📝 <strong>Your Notes</strong><br><br>";

        notes.forEach(function(note,index){
            reply += (index + 1) + ". " + note.text + "<br>";
        });

        return reply;
    }

    return null;
}
