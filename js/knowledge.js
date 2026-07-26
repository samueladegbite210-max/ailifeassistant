alert("Knowledge loaded");
function knowledgeReply(msg){

    if(msg.includes("what is ai")){
        return "🤖 Artificial Intelligence (AI) enables computers to perform tasks that normally require human intelligence.";
    }

    if(msg.includes("what is nigeria")){
        return "🇳🇬 Nigeria is a country in West Africa with 36 states and the Federal Capital Territory, Abuja.";
    }

    if(msg.includes("capital of nigeria")){
        return "🏛️ The capital of Nigeria is Abuja.";
    }

    if(msg.includes("president of nigeria")){
        return "🇳🇬 The President of Nigeria is Bola Ahmed Tinubu.";
    }

    if(msg.includes("what is programming")){
        return "💻 Programming is the process of writing instructions that tell computers what to do.";
    }

    if(msg.includes("what is python")){
        return "🐍 Python is one of the world's most popular programming languages used for AI, web development and automation.";
    }

    if(msg.includes("what is java")){
        return "☕ Java is a programming language widely used for Android apps and enterprise software.";
    }

    if(msg.includes("what is coding")){
        return "💻 Coding means writing instructions that computers can understand and execute.";
    }

    if(msg.includes("who is albert einstein")){
        return "🧠 Albert Einstein was a famous physicist who developed the Theory of Relativity.";
    }

    if(msg.includes("what is electricity")){
        return "⚡ Electricity is the flow of electric charge used to power electrical devices.";
    }

    if(msg.includes("tell me a joke")){
        return "😂 Why do programmers prefer dark mode? Because light attracts bugs!";
    }

    if(msg.includes("motivate me")){
        return "💪 Every expert was once a beginner. Keep learning—you are building something amazing.";
    }
// ==========================
// General Knowledge
// ==========================

if(msg.includes("capital of france")){
    return "🇫🇷 The capital of France is Paris.";
}

if(msg.includes("capital of usa") || msg.includes("capital of united states")){
    return "🇺🇸 The capital of the United States is Washington, D.C.";
}

if(msg.includes("capital of uk")){
    return "🇬🇧 The capital of the United Kingdom is London.";
}

if(msg.includes("largest continent")){
    return "🌍 Asia is the largest continent on Earth.";
}

if(msg.includes("largest ocean")){
    return "🌊 The Pacific Ocean is the largest ocean in the world.";
}

// ==========================
// Technology
// ==========================

if(msg.includes("what is internet")){
    return "🌐 The Internet is a global network connecting billions of computers and devices.";
}

if(msg.includes("what is wifi")){
    return "📶 Wi-Fi allows devices to connect to the internet wirelessly.";
}

if(msg.includes("what is cloud computing")){
    return "☁️ Cloud computing allows you to store data and run applications over the internet instead of your own computer.";
}

if(msg.includes("what is machine learning")){
    return "🧠 Machine Learning is a branch of AI that enables computers to learn from data without being explicitly programmed.";
}

// ==========================
// Electrical Engineering
// ==========================

if(msg.includes("what is voltage")){
    return "⚡ Voltage is the electrical pressure that pushes current through a circuit. It is measured in volts (V).";
}

if(msg.includes("what is current")){
    return "🔋 Electric current is the flow of electric charge through a conductor. It is measured in amperes (A).";
}

if(msg.includes("what is resistance")){
    return "🛡️ Resistance opposes the flow of electric current. It is measured in ohms (Ω).";
}

if(msg.includes("what is transformer")){
    return "🔌 A transformer increases or decreases AC voltage using electromagnetic induction.";
}

if(msg.includes("what is inverter")){
    return "🔋 An inverter converts DC electricity from batteries or solar panels into AC electricity used by appliances.";
}

if(msg.includes("what is generator")){
    return "⚙️ A generator converts mechanical energy into electrical energy.";
}

if(msg.includes("what is ohms law")){
    return "📘 Ohm's Law states that Voltage = Current × Resistance (V = I × R).";
}
// ==========================
// Science
// ==========================



if(msg.includes("what is gravity")){
    return "🌍 Gravity is the force that attracts objects toward the Earth.";
}

if(msg.includes("speed of light")){
    return "💡 The speed of light in a vacuum is about 299,792,458 metres per second.";
}

if(msg.includes("who invented telephone")){
    return "☎️ Alexander Graham Bell is credited with inventing the first practical telephone.";
}

if(msg.includes("who invented light bulb")){
    return "💡 Thomas Edison is widely known for improving and commercializing the electric light bulb.";
}

// ==========================
// Mathematics
// ==========================

if(msg.includes("what is pi")){
    return "🔢 Pi (π) is approximately 3.14159 and represents the ratio of a circle's circumference to its diameter.";
}

if(msg.includes("what is algebra")){
    return "📐 Algebra is a branch of mathematics that uses symbols and letters to represent numbers and solve equations.";
}
    return null;

}
