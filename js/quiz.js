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

        return "✅ Correct! Ampere (A) is the unit of electric current.";

    }

    if(msg === "a" || msg === "c" || msg === "d"){

        return "❌ Incorrect.\n\nThe correct answer is B. Ampere.";

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

        return "✅ Correct! Python is one of the best programming languages for beginners.";

    }

    return null;

}
