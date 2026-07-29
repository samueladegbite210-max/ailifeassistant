// ==========================
// AI Habit Tracker
// ==========================

let habits = JSON.parse(localStorage.getItem("habits")) || [

{
id:1,
title:"💧 Drink Water",
streak:0,
lastCompleted:null
},

{
id:2,
title:"🏃 Exercise",
streak:0,
lastCompleted:null
},

{
id:3,
title:"📖 Read",
streak:0,
lastCompleted:null
},

{
id:4,
title:"😴 Sleep Before 11PM",
streak:0,
lastCompleted:null
},

{
id:5,
title:"🙏 Pray",
streak:0,
lastCompleted:null
}

];

function saveHabits(){

localStorage.setItem(
"habits",
JSON.stringify(habits)
);

renderHabits();
updateHabitProgress();

}

function toggleHabit(id){

const today = new Date().toDateString();

let xp = Number(localStorage.getItem("xp")) || 0;

habits = habits.map(habit=>{

if(habit.id===id){

if(habit.lastCompleted !== today){

habit.lastCompleted = today;

habit.streak++;

xp += 10;

}

}

return habit;

});

localStorage.setItem("xp",xp);

saveHabits();

}

function renderHabits(){

const box = document.getElementById("habitList");

if(!box) return;

box.innerHTML="";

const today = new Date().toDateString();

habits.forEach(habit=>{

const completedToday =
habit.lastCompleted === today;

box.innerHTML += `

<div class="card">

<h3>${habit.title}</h3>

<p>🔥 Streak: ${habit.streak} day(s)</p>

<button
onclick="toggleHabit(${habit.id})"
${completedToday ? "disabled" : ""}>

${completedToday ? "✅ Completed" : "✅ Complete"}

</button>

</div>

`;

});

}

function updateHabitProgress(){

const today = new Date().toDateString();

const total = habits.length;

const done = habits.filter(
habit=>habit.lastCompleted===today
).length;

const percent =
Math.round((done/total)*100);

const progress =
document.getElementById("habitProgress");

const text =
document.getElementById("habitProgressText");

if(progress){

progress.style.width = percent+"%";

}

if(text){

text.textContent =
`${percent}% (${done}/${total})`;

}

}

renderHabits();
updateHabitProgress();
