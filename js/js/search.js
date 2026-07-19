alert("search.js loaded");

function searchReply(msg){

    let keyword = msg
        .replace("search ","")
        .replace("find ","")
        .trim()
        .toLowerCase();

    if(keyword === "") return null;

    let result = "";

    // Search Tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function(task){
        if(task.text.toLowerCase().includes(keyword)){
            result += "✅ Task: " + task.text + "<br>";
        }
    });

    // Search Goals
    let goals = JSON.parse(localStorage.getItem("goals")) || [];

    goals.forEach(function(goal){
        if(goal.text.toLowerCase().includes(keyword)){
            result += "🎯 Goal: " + goal.text + "<br>";
        }
    });

    // Search Notes
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach(function(note){
        if(note.text.toLowerCase().includes(keyword)){
            result += "📝 Note: " + note.text + "<br>";
        }
    });

    // Search Events
    let events = JSON.parse(localStorage.getItem("events")) || [];

    events.forEach(function(event){
        if(event.title.toLowerCase().includes(keyword)){
            result += "📅 Event: " + event.title + "<br>";
        }
    });

    if(result === ""){
        return "🔍 I couldn't find anything matching \"" + keyword + "\".";
    }

    return "<strong>🔍 Search Results</strong><br><br>" + result;
}
