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

"😁 Great",

"🙂 Good",

"😐 Okay",

"😔 Sad",

"😩 Stressed"

];

function loadMoodButtons(){

    const container =

    document.getElementById("moodButtons");

    if(!container) return;

    container.innerHTML = "";

    moods.forEach(function(mood){

        const button =

        document.createElement("button");

        button.className = "button";

        button.textContent = mood;

        button.onclick = function(){

            wellness.mood = mood;

            saveWellness();

        };

        container.appendChild(button);

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
