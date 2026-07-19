alert("NOTES FILE LOADED");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function noteReply(msg, text){

    alert("Inside noteReply");

    return "📝 noteReply works!";
}
