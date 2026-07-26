alert("🏆 Quiz Score Loaded");

let quizScore = JSON.parse(localStorage.getItem("quizScore")) || {

    correct: 0,
    wrong: 0

};

function saveQuizScore(){

    localStorage.setItem(
        "quizScore",
        JSON.stringify(quizScore)
    );

}

function addCorrect(){

    quizScore.correct++;

    saveQuizScore();

}

function addWrong(){

    quizScore.wrong++;

    saveQuizScore();

}

function showQuizScore(){

    return `🏆 Quiz Score

✅ Correct: ${quizScore.correct}

❌ Wrong: ${quizScore.wrong}

📊 Total Attempted: ${quizScore.correct + quizScore.wrong}`;

}

function resetQuizScore(){

    quizScore.correct = 0;

    quizScore.wrong = 0;

    saveQuizScore();

    return "🔄 Quiz score has been reset.";

}
