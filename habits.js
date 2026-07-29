// ==========================
// AI Habit Tracker
// ==========================

let habits =

JSON.parse(

localStorage.getItem("habits")

) || [

{

id:1,

title:"💧 Drink Water",

completed:false,

streak:0

},

{

id:2,

title:"🏃 Exercise",

completed:false,

streak:0

},

{

id:3,

title:"📖 Read",

completed:false,

streak:0

},

{

id:4,

title:"😴 Sleep Before 11PM",

completed:false,

streak:0

},

{

id:5,

title:"🙏 Pray",

completed:false,

streak:0

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

habits = habits.map(habit=>{

if(habit.id===id){

habit.completed =

!habit.completed;

if(habit.completed){

habit.streak++;

}

}

return habit;

});

saveHabits();

}
function renderHabits(){

const box =

document.getElementById("habitList");

if(!box) return;

box.innerHTML="";

habits.forEach(habit=>{

box.innerHTML += `

<div class="card">

<h3>${habit.title}</h3>

<p>

🔥 Streak:

${habit.streak}

day(s)

</p>

<button

onclick="toggleHabit(${habit.id})">

${habit.completed

?

"✅ Done"

:

"⭕ Complete"}

</button>

</div>

`;

});

}
function updateHabitProgress(){

const total = habits.length;

const done =

habits.filter(

h=>h.completed

).length;

const percent =

Math.round(

(done/total)*100

);

const progress =

document.getElementById(

"habitProgress"

);

const text =

document.getElementById(

"habitProgressText"

);

if(progress){

progress.style.width=

percent+"%";

}

if(text){

text.textContent=

percent+"%";

}

}
