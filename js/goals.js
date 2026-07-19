alert("Goals loaded");
let goals = JSON.parse(localStorage.getItem("goals")) || [];
    function goalReply(msg, text){

    // Create Goal
    if(
        msg.startsWith("create a goal called ") ||
        msg.startsWith("add a goal called ")
    ){

        let goalName = text
            .replace(/create a goal called /i,"")
            .replace(/add a goal called /i,"")
            .trim();

        if(goalName === ""){
            return "❌ Please enter a goal.";
        }

        goals.push({
            id: Date.now(),
            text: goalName,
            done: false
        });

        localStorage.setItem("goals", JSON.stringify(goals));

        return "🎯 Goal \"" + goalName + "\" created successfully!";
    }

    // Show Goals
    if(hasAny(msg,[
        "show my goals",
        "show goals",
        "my goals",
        "goal list",
        "list goals",
        "list my goals"
    ])){

        if(goals.length === 0){
            return "🎯 You don't have any goals yet.";
        }

        let reply = "🎯 <strong>Your Goals</strong><br><br>";

        goals.forEach(function(goal,index){
            reply +=
                (goal.done ? "✅ " : "🎯 ") +
                (index+1) + ". " +
                goal.text +
                "<br>";
        });

        return reply;
    }

    // Goal Count
    if(hasAny(msg,[
        "goal count",
        "how many goals",
        "number of goals"
    ])){
        return "🎯 You currently have " + goals.length + " goal(s).";
    }

    return null;
}
