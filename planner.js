/*==========================================
 AI DAILY PLANNER
==========================================*/

function generateAIRecommendation(){

    const greeting =
    document.getElementById("aiGreeting");

    const recommendation =
    document.getElementById("aiRecommendation");

    if(!greeting || !recommendation){

        return;

    }

    const tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

    const events =
    JSON.parse(localStorage.getItem("events")) || [];

    const wellness =
    JSON.parse(localStorage.getItem("wellness")) || {};

    let score = 0;

    // Mood

    if(wellness.mood){

        switch(wellness.mood.text){

            case "Great": score += 25; break;
            case "Good": score += 20; break;
            case "Okay": score += 15; break;
            case "Sad": score += 8; break;
            case "Stressed": score += 5; break;

        }

    }

    // Energy

    if(wellness.energy){

        switch(wellness.energy.text){

            case "Excellent": score += 25; break;
            case "High": score += 20; break;
            case "Normal": score += 15; break;
            case "Low": score += 8; break;
            case "Very Low": score += 5; break;

        }

    }

    score += Math.min(wellness.sleep || 0,8)*3;

    score += Math.min(wellness.water || 0,8)*3;

    if(score>100){

        score = 100;

    }

    greeting.innerHTML =

    `🌟 Wellness Score: <strong>${score}%</strong>`;

    const pending =
    tasks.filter(task=>!task.done).length;

    if(score>=90){

        recommendation.innerHTML =

        "🔥 Excellent! Today is perfect for completing your biggest goal.";

    }

    else if(score>=70){

        recommendation.innerHTML =

        `🚀 Great day! You have ${pending} pending task(s). Finish your most important task first.`;

    }

    else if(score>=50){

        recommendation.innerHTML =

        `🙂 You're doing okay. Complete one task today and drink more water.`;

    }

    else{

        recommendation.innerHTML =

        "💙 Your wellness is low today. Rest, drink water and avoid overworking yourself.";

    }

}

document.addEventListener("DOMContentLoaded",function(){

    generateAIRecommendation();

});
