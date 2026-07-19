alert("tasks.js loaded");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function taskReply(msg, text){

    // Create Task
    if(
        msg.startsWith("create a task called ") ||
        msg.startsWith("add a task called ") ||
        msg.startsWith("remind me to ")
    ){

        let taskName = text
            .replace(/create a task called /i,"")
            .replace(/add a task called /i,"")
            .replace(/remind me to /i,"")
            .trim();

        if(taskName === ""){
            return "❌ Please enter a task.";
        }

        tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.push({
            id: Date.now(),
            text: taskName,
            done: false
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        return "✅ Task \"" + taskName + "\" created successfully!";
    }

    // Show Tasks
    if(hasAny(msg,[
        "show my tasks",
        "show tasks",
        "my tasks",
        "task list",
        "list my tasks",
        "list tasks"
    ])){

        tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        if(tasks.length === 0){
            return "📋 You don't have any tasks yet.";
        }

        let reply = "📋 <strong>Your Tasks</strong><br><br>";

        tasks.forEach(function(task,index){

            reply +=
                (task.done ? "✅ " : "⬜ ") +
                (index+1) +
                ". " +
                task.text +
                "<br>";

        });

        return reply;
    }

    // Task Count
    if(hasAny(msg,[
        "how many tasks",
        "task count",
        "number of tasks"
    ])){

        tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        return "📋 You currently have " + tasks.length + " task(s).";
    }

    return null;
}
