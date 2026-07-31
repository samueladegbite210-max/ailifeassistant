"use strict";

/*==================================================
AI LIFE ASSISTANT
Dashboard.js Version 5.0
Stable Release
==================================================*/

/*==================================================
SECTION 1 — APP CONFIGURATION
==================================================*/

const APP = {

    name: "AI Life Assistant",

    version: "5.0.0",

    username:
        localStorage.getItem("profileName") || "Samuel",

    refreshInterval: 30000,

    clockInterval: 1000

};
/*==================================================
SECTION 2 — STORAGE
==================================================*/

function safeRead(key){

    try{

        return JSON.parse(localStorage.getItem(key)) || [];

    }

    catch{

        return [];

    }

}

function safeObject(key, fallback = {}){

    try{

        return JSON.parse(localStorage.getItem(key)) || fallback;

    }

    catch{

        return fallback;

    }

}

function getDashboardData(){

    return{

        tasks: safeRead("tasks"),

        goals: safeRead("goals"),

        events: safeRead("events"),

        notes: safeRead("notes"),

        wellness: safeObject("wellness"),

        xp: safeObject("xp",{

            xp:0,

            level:1,

            total:0

        }),

        streak: safeObject("streak",{

            days:0

        })

    };

}
/*==================================================
SECTION 3 — HELPERS
==================================================*/

function $(id){

    return document.getElementById(id);

}

function setText(id,text){

    const element=$(id);

    if(element){

        element.textContent=text;

    }

}

function setHTML(id,html){

    const element=$(id);

    if(element){

        element.innerHTML=html;

    }

}

function setWidth(id,width){

    const element=$(id);

    if(element){

        element.style.width=width;

    }

}
