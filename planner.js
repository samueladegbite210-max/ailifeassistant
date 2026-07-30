/*==========================================
 AI DAILY PLANNER
==========================================*/

function generateAIRecommendation(){

    const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

    const goals =
    JSON.parse(localStorage.getItem("goals")) || [];

    const events =
    JSON.parse(localStorage.getItem("events")) || [];

    const wellness =
    JSON.parse(localStorage.getItem("wellness")) || {};

    let recommendation = "";

    let score = 0;

    // Mood

    if(wellness.mood){

        switch(wellness.mood.text){

            case "Great":
                score += 25;
                break;

            case "Good":
                score += 20;
                break;

            case "Okay":
                score += 15;
                break;

            case "Sad":
                score += 8;
                break;

            case "Stressed":
                score += 5;
                break;

        }

    }

    // Energy

    if(wellness.energy){

        switch(wellness.energy.text){

            case "Excellent":
                score += 25;
                break;

            case "High":
                score += 20;
                break;

            case "Normal":
                score += 15;
                break;

            case "Low":
                score += 8;
                break;

            case "Very Low":
                score += 5;
                break;

        }

    }

    score += Math.min(wellness.sleep || 0,8)*3;

    score += Math.min(wellness.water || 0,8)*3;

    if(score>100){

        score=100;

    }

    const pendingTasks =
    tasks.filter(t=>!t.done).length;

    if(score<40){

        recommendation =

        "💙 You're low on energy today. Focus on only important tasks, drink more water and get enough rest.";

    }

    else if(score<70){

        recommendation =

        `🙂 You're doing okay. You still have ${pendingTasks} pending task(s). Try completing one goal today.`;

    }

    else{

        recommendation =

        `🚀 Great day! Finish your biggest goal first. You have ${pendingTasks} pending task(s) and ${events.length} upcoming event(s).`;

    }

 const aiBox =
document.getElementById("aiRecommendation");

if(aiBox){

    aiBox.textContent = recommendation;

}

function initializePlanner(){

    generateAIRecommendation();

}

document.addEventListener(

    "DOMContentLoaded",

    initializePlanner

);
