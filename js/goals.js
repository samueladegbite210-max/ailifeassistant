// ================================
// Create Goal
// ================================

else if(msg.startsWith("create a goal called ")){

    let goalName = text.replace(/create a goal called /i,"").trim();

    if(goalName === ""){

        reply = "❌ Please enter a goal.";

    }else{

        goals.push({
            id: Date.now(),
            text: goalName,
            done: false
        });

        localStorage.setItem("goals", JSON.stringify(goals));

        reply = "🎯 Goal \"" + goalName + "\" created successfully!";

    }

}



// ================================
// Show Goals (Smart)
// ================================

else if(hasAny(msg,[

    "show my goals",
    "show goals",
    "goal list",
    "list goals",
    "list my goals",
    "my goals",
    "what are my goals",
    "what's my goals",
    "do i have goals",
    "do i have any goals",
    "show goal",
    "goals"

])){

    if(goals.length === 0){

        reply = "🎯 You don't have any goals yet.";

    }else{

        reply = "🎯 <strong>Your Goals</strong><br><br>";

        goals.forEach(function(goal,index){

            reply +=
            (goal.done ? "✅ " : "⬜ ") +
            (index + 1) +
            ". " +
            goal.text +
            "<br>";

        });

    }

}


// ================================
// Goal Count (Smart)
// ================================

else if(hasAny(msg,[

    "how many goals",
    "goal count",
    "number of goals",
    "total goals",
    "how much goals"

])){

    reply = "🎯 You currently have " + goals.length + " goal(s).";

}
