// ==========================
// AI Daily Planner
// ==========================

function generateDailyPlan(){

    const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

    const goals =
    JSON.parse(localStorage.getItem("goals")) || [];

    let plan = [];

    tasks

    .filter(task=>!task.done)

    .slice(0,3)

    .forEach(task=>{

        plan.push(

            "📌 " + task.title

        );

    });

    goals

    .filter(goal=>!goal.done)

    .slice(0,2)

    .forEach(goal=>{

        plan.push(

            "🎯 " + goal.title

        );

    });

    return plan;

}
