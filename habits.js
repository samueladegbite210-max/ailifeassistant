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
