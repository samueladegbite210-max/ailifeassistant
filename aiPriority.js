// ==========================
// AI Priority Engine
// ==========================

function getPriorityTasks(){

    const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

    const today =
    new Date();

    return tasks

    .filter(task=>!task.done)

    .sort(function(a,b){

        const da = new Date(a.deadline || "2999-12-31");

        const db = new Date(b.deadline || "2999-12-31");

        return da-db;

    });

}
