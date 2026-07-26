alert("📝 Quiz Module Loaded");

function quizReply(msg){

    msg = msg.toLowerCase().trim();

    // ==========================
    // Electricity Quiz
    // ==========================

    if(msg.includes("quiz electricity")){

        return `⚡ Electricity Quiz

Question 1:

What is the unit of electric current?

A. Volt

B. Ampere

C. Ohm

D. Watt

Reply with A, B, C or D.`;

    }

    if(msg === "b"){

    addCorrect();

    return "✅ Correct!\n\nAmpere (A) is the unit of electric current.\n\n" + showQuizScore();

}

    if(msg === "a" || msg === "c" || msg === "d"){

    addWrong();

    return "❌ Incorrect.\n\nThe correct answer is B.\n\n" + showQuizScore();

}
    // ==========================
    // Programming Quiz
    // ==========================

    if(msg.includes("quiz programming")){

        return `💻 Programming Quiz

Which language is most recommended for beginners?

A. Python

B. Assembly

C. Binary

D. Machine Code

Reply with A, B, C or D.`;

    }

    if(msg === "a"){

        addCorrect();

return "✅ Correct!\n\nPython is one of the best programming languages for beginners.\n\n" + showQuizScore();

    }
if(msg.includes("show my quiz score")){

    return showQuizScore();

}

if(msg.includes("reset my quiz score")){

    return resetQuizScore();

}
    return null;

}
