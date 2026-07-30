"use strict";

/*==========================================
 WELLNESS STORAGE
==========================================*/

let wellness = JSON.parse(
    localStorage.getItem("wellness")
) || {

    mood: {
        emoji: "🙂",
        text: "Good"
    },

    energy: "😐",

    sleep: 7,

    water: 0

};


/*==========================================
 MOOD OPTIONS
==========================================*/

const moods = [

    { emoji:"😁", text:"Great" },

    { emoji:"🙂", text:"Good" },

    { emoji:"😐", text:"Okay" },

    { emoji:"😔", text:"Sad" },

    { emoji:"😩", text:"Stressed" }

];


/*==========================================
 LOAD MOOD BUTTONS
==========================================*/

function loadMoodButtons(){

    const container =
    document.getElementById("moodButtons");

    if(!container) return;

    container.innerHTML = "";

    moods.forEach(function(mood){

        const btn =
        document.createElement("button");

        btn.className = "button";

        btn.innerHTML =
        `${mood.emoji}<br>${mood.text}`;

        btn.onclick = function(){

            wellness.mood = {

                emoji:mood.emoji,

                text:mood.text

            };

            saveWellness();

            updateMoodDisplay();

        };

        container.appendChild(btn);

    });

}


/*==========================================
 UPDATE MOOD DISPLAY
==========================================*/

function updateMoodDisplay(){

    const moodText =
    document.getElementById("selectedMood");

    if(!moodText) return;

    moodText.innerHTML =

    `Current Mood:<br>

    ${wellness.mood.emoji}

    ${wellness.mood.text}`;

}


/*==========================================
 SAVE WELLNESS
==========================================*/

function saveWellness(){

    localStorage.setItem(

        "wellness",

        JSON.stringify(wellness)

    );

    if(typeof updateWellnessScore === "function"){

        updateWellnessScore();

    }

}


/*==========================================
 START
==========================================*/

document.addEventListener(

    "DOMContentLoaded",

    function(){

        loadMoodButtons();

        updateMoodDisplay();

    }

);
