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

    energy:{

    emoji:"🙂",

    text:"Normal"

},

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
 ENERGY OPTIONS
==========================================*/

const energies = [

    { emoji:"😴", text:"Very Low" },

    { emoji:"😐", text:"Low" },

    { emoji:"🙂", text:"Normal" },

    { emoji:"😃", text:"High" },

    { emoji:"🚀", text:"Excellent" }

];


/*==========================================
 LOAD ENERGY BUTTONS
==========================================*/

function loadEnergyButtons(){

    const container =
    document.getElementById("energyButtons");

    if(!container) return;

    container.innerHTML = "";

    energies.forEach(function(energy){

        const btn =
        document.createElement("button");

        btn.className = "button";

        btn.innerHTML =
        `${energy.emoji}<br>${energy.text}`;

        btn.onclick = function(){

            wellness.energy = {

                emoji:energy.emoji,

                text:energy.text

            };

            saveWellness();

            updateEnergyDisplay();

        };

        container.appendChild(btn);

    });

}


/*==========================================
 UPDATE ENERGY DISPLAY
==========================================*/

function updateEnergyDisplay(){

    const energyBox =
    document.getElementById("selectedEnergy");

    if(!energyBox) return;

    energyBox.innerHTML =

    `Energy Level:<br>

    ${wellness.energy.emoji}

    ${wellness.energy.text}`;

}
function initializeSleep(){

    const slider =
    document.getElementById("sleepSlider");

    const value =
    document.getElementById("sleepValue");

    if(!slider || !value) return;

    slider.value = wellness.sleep;

    value.textContent =
    wellness.sleep + " Hours";

    slider.oninput = function(){

        wellness.sleep =
        Number(this.value);

        value.textContent =
        this.value + " Hours";

        saveWellness();

    };

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

loadEnergyButtons();

updateMoodDisplay();

updateEnergyDisplay();

initializeSleep();

    }

);
