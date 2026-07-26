alert("📚 Teacher Module Loaded");

function teacherReply(msg){

    // ==========================
    // Teach AI
    // ==========================

    if(msg.includes("teach me ai")){

        return `🤖 Artificial Intelligence (AI)

AI is the ability of computers to perform tasks that normally require human intelligence.

📖 Main Types:
• Narrow AI
• General AI
• Super AI

💡 Examples:
• ChatGPT
• Siri
• Google Assistant
• Self-driving cars

🎯 AI is used in healthcare, banking, education, agriculture and many other fields.`;
    }

    // ==========================
    // Teach Electricity
    // ==========================

    if(msg.includes("teach me electricity")){

        return `⚡ Electricity

Electricity is the movement of electric charge.

Important Concepts:

• Voltage (V)
• Current (A)
• Resistance (Ω)
• Power (W)

📌 Ohm's Law:

Voltage = Current × Resistance

Electricity powers lights, fans, TVs, computers and many other devices.`;
    }

    // ==========================
    // Teach Programming
    // ==========================

    if(msg.includes("teach me programming")){

        return `💻 Programming

Programming is writing instructions for computers.

Popular Languages:

• Python
• JavaScript
• Java
• C++
• C#

Programming is used to build websites, apps, games and AI systems.`;
    }

    // ==========================
    // Teach Mathematics
    // ==========================

    if(msg.includes("teach me mathematics")){

        return `📐 Mathematics

Mathematics helps us solve problems using numbers.

Major Branches:

• Arithmetic
• Algebra
• Geometry
• Trigonometry
• Calculus
• Statistics`;
    }

    return null;

}
