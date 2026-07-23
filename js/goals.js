alert("Goals loaded");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

function goalReply(msg, text){

    // Always reload latest goals
    goals = JSON.parse(localStorage.getItem("goals")) || [];

    // ==========================
    // SMART GOAL DETECTION
    // ==========================

    if(
        msg.startsWith("i want to ") ||
        msg.startsWith("my goal is to ") ||
        msg.startsWith("i plan to ")
    ){

        const goalName = text
            .replace(/i want to/i,"")
            .replace(/my goal is to/i,"")
            .replace(/i plan to/i,"")
            .trim();

        if(goalName === ""){
            return "❌ Please tell me your goal.";
        }

        goals.push({
            id: Date.now(),
            title: goalName,
            text: goalName,
            description: "",
            deadline: "",
            category: "Personal",
            done: false
        });

        localStorage.setItem("goals", JSON.stringify(goals));

        return `🎯 Great goal!\n\nI've added:\n🎯 ${goalName}`;
    }

    // ==========================
    // CREATE GOAL
    // ==========================

    if(
        msg.startsWith("create a goal called ") ||
        msg.startsWith("add a goal called ")
    ){

        const goalName = text
            .replace(/create a goal called/i,"")
            .replace(/add a goal called/i,"")
            .trim();

        if(goalName === ""){
            return "❌ Please enter a goal name.";
        }

        goals.push({
            id: Date.now(),
            title: goalName,
            text: goalName,
            description: "",
            deadline: "",
            category: "Personal",
            done: false
        });

        localStorage.setItem("goals", JSON.stringify(goals));

        return `🎯 Goal "${goalName}" created successfully!`;
    }

    // ==========================
    // GOAL SUMMARY
    // ==========================

    if(
        msg.includes("goal summary") ||
        msg.includes("how many goals")
    ){

        const completed = goals.filter(goal => goal.done).length;
        const pending = goals.length - completed;

        return `📊 Goal Summary

🎯 Total Goals: ${goals.length}
✅ Completed: ${completed}
⏳ Pending: ${pending}`;
    }

    // ==========================
    // SHOW GOALS
    // ==========================

    if(
        msg.includes("show my goals") ||
        msg.includes("list my goals") ||
        msg.includes("show goals")
    ){

        if(goals.length === 0){
            return "🎯 You don't have any goals yet.";
        }

        let reply = "🎯 Your Goals\n\n";

        goals.forEach(function(goal){

            const goalName = goal.title || goal.text;

            if(goalName){

                reply += `${goal.done ? "✅" : "🎯"} ${goalName}\n`;

            }

        });

        return reply;
    }

    // ==========================
    // PENDING GOALS
    // ==========================

    if(msg.includes("pending goals")){

        const pending = goals.filter(goal => !goal.done);

        if(pending.length === 0){
            return "🎉 You have no pending goals.";
        }

        let reply = "⏳ Pending Goals\n\n";

        pending.forEach(function(goal){

            const goalName = goal.title || goal.text;

            if(goalName){
                reply += `🎯 ${goalName}\n`;
            }

        });

        return reply;
    }

    // ==========================
    // COMPLETED GOALS
    // ==========================

    if(msg.includes("completed goals")){

        const completed = goals.filter(goal => goal.done);

        if(completed.length === 0){
            return "🎉 You haven't completed any goals yet.";
        }

        let reply = "✅ Completed Goals\n\n";

        completed.forEach(function(goal){

            const goalName = goal.title || goal.text;

            if(goalName){
                reply += `✅ ${goalName}\n`;
            }

        });

        return reply;
    }

    return null;
}
