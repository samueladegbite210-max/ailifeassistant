"use strict";

/*=========================
AI WELLNESS
=========================*/

let wellness =

JSON.parse(

localStorage.getItem("wellness")

) || {

mood:"🙂",

energy:"😐",

sleep:7,

water:0

};
/*=========================
MOOD OPTIONS
=========================*/

const moods = [

{

emoji:"😁",

text:"Great"

},

{

emoji:"🙂",

text:"Good"

},

{

emoji:"😐",

text:"Okay"

},

{

emoji:"😔",

text:"Sad"

},

{

emoji:"😩",

text:"Stressed"

}

];
function loadMoodButtons(){

const container =

document.getElementById("moodButtons");

container.innerHTML="";

moods.forEach(function(mood){

const btn =

document.createElement("button");

btn.className="button";

btn.innerHTML=

`${mood.emoji}<br>${mood.text}`;

btn.onclick = function () {

    wellness.mood = mood;

    document.getElementById("selectedMood").innerHTML =
    `Current Mood: ${mood.emoji} ${mood.text}`;

    saveWellness();

};
document.getElementById(

"selectedMood"

).innerHTML=

`Current Mood:
${mood.emoji} ${mood.text}`;

};

container.appendChild(btn);

});

}
/*=========================
SAVE WELLNESS
=========================*/

function saveWellness(){

    localStorage.setItem(

        "wellness",

        JSON.stringify(wellness)

    );

    updateWellnessScore();

}
document.addEventListener(

    "DOMContentLoaded",

    function(){

        loadMoodButtons();

    }

);
