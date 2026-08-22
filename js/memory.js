"use strict";

// ==========================================
// AI LIFE ASSISTANT
// memory.js
// Version 6.0
// Stable Memory System
// ==========================================

console.log("🧠 memory.js loading...");


// ==========================================
// DEFAULT MEMORY
// ==========================================

const DEFAULT_MEMORY = {
    name: null,
    city: null,
    job: null,
    study: null,
    birthday: null,
    favoriteColor: null,
    favoriteFood: null,
    club: null,
    phone: null,
    email: null,
    relationship: null,

    dog: null,
    girlfriend: null,
    mother: null,
    father: null,
    brother: null,
    sister: null,

    likes: [],
    dislikes: [],
    facts: []
};


// ==========================================
// LOAD MEMORY
// ==========================================

function loadMemory() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem("memory")
            );

        return {
            ...DEFAULT_MEMORY,
            ...(saved || {}),

            likes:
                Array.isArray(saved?.likes)
                    ? saved.likes
                    : [],

            dislikes:
                Array.isArray(saved?.dislikes)
                    ? saved.dislikes
                    : [],

            facts:
                Array.isArray(saved?.facts)
                    ? saved.facts
                    : []
        };

    } catch (error) {

        console.error(
            "❌ Memory load error:",
            error
        );

        return {
            ...DEFAULT_MEMORY,
            likes: [],
            dislikes: [],
            facts: []
        };

    }

}


// ==========================================
// MEMORY STATE
// ==========================================

let memory = loadMemory();


// ==========================================
// SAVE MEMORY
// ==========================================

function saveMemory() {

    try {

        localStorage.setItem(
            "memory",
            JSON.stringify(memory)
        );

        console.log(
            "💾 Memory saved:",
            memory
        );

        return true;

    } catch (error) {

        console.error(
            "❌ Memory save error:",
            error
        );

        return false;

    }

}


// ==========================================
// NORMALIZE TEXT
// ==========================================

function normalizeMemoryText(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");

}


// ==========================================
// MEMORY REPLY
// ==========================================

function memoryReply(originalMsg, lowerMsg) {

    const original =
        normalizeMemoryText(originalMsg);

    const msg =
        normalizeMemoryText(
            lowerMsg || original
        ).toLowerCase();


    if (!msg) {

        return null;

    }


    console.log(
        "🧠 memoryReply:",
        msg
    );


    // ======================================
    // SAVE NAME
    // ======================================

    if (msg.startsWith("my name is ")) {

        memory.name =
            original
                .replace(/^my name is /i, "")
                .trim();

        saveMemory();

        return (
            "😊 Nice to meet you " +
            memory.name +
            ". I'll remember your name."
        );

    }


    // ======================================
    // SAVE LOCATION
    // ======================================

    if (msg.startsWith("i live in ")) {

        memory.city =
            original
                .replace(/^i live in /i, "")
                .trim();

        saveMemory();

        return (
            "📍 I'll remember that you live in " +
            memory.city +
            "."
        );

    }


    // ======================================
    // SAVE JOB
    // ======================================

    if (
        msg.startsWith("i work as ") ||
        msg.startsWith("i work at ") ||
        msg.startsWith("my job is ")
    ) {

        memory.job =
            original
                .replace(/^i work as /i, "")
                .replace(/^i work at /i, "")
                .replace(/^my job is /i, "")
                .trim();

        saveMemory();

        return "💼 I'll remember your job.";

    }


    // ======================================
    // SAVE STUDY
    // ======================================

    if (msg.startsWith("i study ")) {

        memory.study =
            original
                .replace(/^i study /i, "")
                .trim();

        saveMemory();

        return "📚 I'll remember what you study.";

    }


    // ======================================
    // SAVE BIRTHDAY
    // ======================================

    if (msg.startsWith("my birthday is ")) {

        memory.birthday =
            original
                .replace(/^my birthday is /i, "")
                .trim();

        saveMemory();

        return "🎂 Your birthday has been saved.";

    }


    // ======================================
    // SAVE FAVORITE COLOR
    // ======================================

    if (
        msg.startsWith(
            "my favorite color is "
        )
    ) {

        memory.favoriteColor =
            original
                .replace(
                    /^my favorite color is /i,
                    ""
                )
                .trim();

        saveMemory();

        return "🎨 Your favorite color has been saved.";

    }


    // ======================================
    // SAVE FAVORITE FOOD
    // ======================================

    if (
        msg.startsWith(
            "my favorite food is "
        )
    ) {

        memory.favoriteFood =
            original
                .replace(
                    /^my favorite food is /i,
                    ""
                )
                .trim();

        saveMemory();

        return "🍲 Your favorite food has been saved.";

    }


    // ======================================
    // SAVE FAVORITE CLUB
    // ======================================

    if (
        msg.startsWith(
            "my favorite club is "
        )
    ) {

        memory.club =
            original
                .replace(
                    /^my favorite club is /i,
                    ""
                )
                .trim();

        saveMemory();

        return "⚽ Your favorite club has been saved.";

    }


    // ======================================
    // SAVE PHONE
    // ======================================

    if (
        msg.startsWith(
            "my phone number is "
        )
    ) {

        memory.phone =
            original
                .replace(
                    /^my phone number is /i,
                    ""
                )
                .trim();

        saveMemory();

        return "📱 Your phone number has been saved.";

    }


    // ======================================
    // SAVE EMAIL
    // ======================================

    if (
        msg.startsWith(
            "my email is "
        )
    ) {

        memory.email =
            original
                .replace(
                    /^my email is /i,
                    ""
                )
                .trim();

        saveMemory();

        return "📧 Your email has been saved.";

    }


    // ======================================
    // RELATIONSHIP
    // ======================================

    if (msg.startsWith("i am single")) {

        memory.relationship = "Single";

        saveMemory();

        return "❤️ I'll remember that you're single.";

    }


    if (msg.startsWith("i am married")) {

        memory.relationship = "Married";

        saveMemory();

        return "❤️ I'll remember that you're married.";

    }


    // ======================================
    // SAVE PET / FAMILY
    // ======================================

    const specialMemoryPatterns = [

        {
            key: "dog",
            pattern: /^my dog's name is /i,
            response: "🐶 I'll remember your dog's name."
        },

        {
            key: "girlfriend",
            pattern: /^my girlfriend is /i,
            response: "❤️ I'll remember your girlfriend."
        },

        {
            key: "mother",
            pattern: /^my mother's name is /i,
            response: "👩 I'll remember your mother's name."
        },

        {
            key: "father",
            pattern: /^my father's name is /i,
            response: "👨 I'll remember your father's name."
        },

        {
            key: "brother",
            pattern: /^my brother's name is /i,
            response: "👦 I'll remember your brother's name."
        },

        {
            key: "sister",
            pattern: /^my sister's name is /i,
            response: "👧 I'll remember your sister's name."
        }

    ];


    for (
        const item of specialMemoryPatterns
    ) {

        if (item.pattern.test(original)) {

            memory[item.key] =
                original
                    .replace(
                        item.pattern,
                        ""
                    )
                    .trim();

            saveMemory();

            return item.response;

        }

    }


    // ======================================
    // LIKES
    // ======================================

    if (msg.startsWith("i like ")) {

        const item =
            original
                .replace(/^i like /i, "")
                .trim();

        if (item) {

            if (
                !memory.likes.some(
                    value =>
                        value.toLowerCase() ===
                        item.toLowerCase()
                )
            ) {

                memory.likes.push(item);

            }

            saveMemory();

            return (
                "😊 I'll remember that you like " +
                item +
                "."
            );

        }

    }


    // ======================================
    // DISLIKES
    // ======================================

    if (msg.startsWith("i don't like ")) {

        const item =
            original
                .replace(/^i don't like /i, "")
                .trim();

        if (item) {

            if (
                !memory.dislikes.some(
                    value =>
                        value.toLowerCase() ===
                        item.toLowerCase()
                )
            ) {

                memory.dislikes.push(item);

            }

            saveMemory();

            return (
                "👍 I'll remember that you don't like " +
                item +
                "."
            );

        }

    }


    // ======================================
    // REMEMBER FACT
    // ======================================

    if (msg.startsWith("remember that ")) {

        const fact =
            original
                .replace(/^remember that /i, "")
                .trim();

        if (fact) {

            const exists =
                memory.facts.some(
                    value =>
                        value.toLowerCase() ===
                        fact.toLowerCase()
                );

            if (!exists) {

                memory.facts.push(fact);

            }

            saveMemory();

            return (
                "🧠 I have remembered: " +
                fact
            );

        }

    }


    // ======================================
    // RECALL NAME
    // ======================================

    if (
        msg.includes("what is my name") ||
        msg.includes("who am i")
    ) {

        return memory.name
            ? "😊 Your name is " +
              memory.name +
              "."
            : "I don't know your name yet.";

    }


    // ======================================
    // RECALL LOCATION
    // ======================================

    if (
        msg.includes("where do i live")
    ) {

        return memory.city
            ? "📍 You live in " +
              memory.city +
              "."
            : "I don't know where you live yet.";

    }


    // ======================================
    // RECALL JOB
    // ======================================

    if (
        msg.includes("what is my job")
    ) {

        return memory.job
            ? "💼 You work as " +
              memory.job +
              "."
            : "I don't know your job yet.";

    }


    // ======================================
    // RECALL BIRTHDAY
    // ======================================

    if (
        msg.includes("when is my birthday")
    ) {

        return memory.birthday
            ? "🎂 Your birthday is " +
              memory.birthday +
              "."
            : "I don't know your birthday.";

    }


    // ======================================
    // RECALL FAVORITES
    // ======================================

    if (
        msg.includes(
            "what is my favorite color"
        )
    ) {

        return memory.favoriteColor
            ? "🎨 Your favorite color is " +
              memory.favoriteColor +
              "."
            : "I don't know your favorite color.";

    }


    if (
        msg.includes(
            "what is my favorite food"
        )
    ) {

        return memory.favoriteFood
            ? "🍲 Your favorite food is " +
              memory.favoriteFood +
              "."
            : "I don't know your favorite food.";

    }


    if (
        msg.includes(
            "what is my favorite club"
        )
    ) {

        return memory.club
            ? "⚽ Your favorite club is " +
              memory.club +
              "."
            : "I don't know your favorite club.";

    }


    // ======================================
    // RECALL FAMILY
    // ======================================

    const recallRules = [

        [
            ["what is my dog's name", "who is my dog", "my dog name"],
            "dog",
            "🐶 Your dog's name is ",
            "I don't know your dog's name yet."
        ],

        [
            ["who is my girlfriend", "what is my girlfriend's name"],
            "girlfriend",
            "❤️ Your girlfriend is ",
            "I don't know your girlfriend yet."
        ],

        [
            ["who is my mother"],
            "mother",
            "👩 Your mother's name is ",
            "I don't know your mother's name yet."
        ],

        [
            ["who is my father"],
            "father",
            "👨 Your father's name is ",
            "I don't know your father's name yet."
        ],

        [
            ["who is my brother"],
            "brother",
            "👦 Your brother's name is ",
            "I don't know your brother's name yet."
        ],

        [
            ["who is my sister"],
            "sister",
            "👧 Your sister's name is ",
            "I don't know your sister's name yet."
        ]

    ];


    for (const rule of recallRules) {

        if (
            rule[0].some(
                phrase => msg.includes(phrase)
            )
        ) {

            return memory[rule[1]]
                ? rule[2] +
                  memory[rule[1]] +
                  "."
                : rule[3];

        }

    }


    // ======================================
    // FORGET MEMORY
    // ======================================

    if (msg.startsWith("forget my ")) {

        const item =
            msg
                .replace("forget my ", "")
                .trim();

        const fields = {

            name: "name",
            city: "city",
            location: "city",
            job: "job",
            birthday: "birthday",
            "favorite color": "favoriteColor",
            "favorite food": "favoriteFood",
            "favorite club": "club",
            phone: "phone",
            "phone number": "phone",
            email: "email",
            relationship: "relationship",
            dog: "dog",
            girlfriend: "girlfriend",
            mother: "mother",
            father: "father",
            brother: "brother",
            sister: "sister"

        };


        const key = fields[item];


        if (!key) {

            return "❌ I couldn't find that memory.";

        }


        memory[key] = null;

        saveMemory();

        return (
            "🗑️ Done! I've forgotten your " +
            item +
            "."
        );

    }


    // ======================================
    // FORGET FACT
    // ======================================

    if (msg.startsWith("forget that ")) {

        const fact =
            original
                .replace(/^forget that /i, "")
                .trim();

        memory.facts =
            memory.facts.filter(
                value =>
                    value.toLowerCase() !==
                    fact.toLowerCase()
            );

        saveMemory();

        return "🗑️ I forgot that.";

    }


    // ======================================
    // SHOW EVERYTHING
    // ======================================

    if (
        msg.includes(
            "what do you remember about me"
        ) ||
        msg.includes(
            "tell me what you know about me"
        )
    ) {

        let reply =
            "🧠 Here's what I know about you:\n\n";

        let hasData = false;


        function add(label, value) {

            if (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            ) {

                reply +=
                    label +
                    value +
                    "\n";

                hasData = true;

            }

        }


        add("👤 Name: ", memory.name);
        add("📍 Lives in: ", memory.city);
        add("💼 Job: ", memory.job);
        add("🎓 Study: ", memory.study);
        add("🎂 Birthday: ", memory.birthday);
        add("🎨 Favorite Color: ", memory.favoriteColor);
        add("🍲 Favorite Food: ", memory.favoriteFood);
        add("⚽ Favorite Club: ", memory.club);
        add("📱 Phone: ", memory.phone);
        add("📧 Email: ", memory.email);
        add("❤️ Relationship: ", memory.relationship);
        add("🐶 Dog: ", memory.dog);
        add("❤️ Girlfriend: ", memory.girlfriend);
        add("👩 Mother: ", memory.mother);
        add("👨 Father: ", memory.father);
        add("👦 Brother: ", memory.brother);
        add("👧 Sister: ", memory.sister);


        if (memory.likes.length) {

            reply += "\n😊 Likes:\n";

            memory.likes.forEach(
                item => {
                    reply +=
                        "• " +
                        item +
                        "\n";
                }
            );

            hasData = true;

        }


        if (memory.dislikes.length) {

            reply += "\n😒 Dislikes:\n";

            memory.dislikes.forEach(
                item => {
                    reply +=
                        "• " +
                        item +
                        "\n";
                }
            );

            hasData = true;

        }


        if (memory.facts.length) {

            reply += "\n💡 Facts:\n";

            memory.facts.forEach(
                item => {
                    reply +=
                        "• " +
                        item +
                        "\n";
                }
            );

            hasData = true;

        }


        if (!hasData) {

            return (
                "🧠 I don't know much about you yet."
            );

        }


        return reply;

    }


    // ======================================
    // NO MEMORY MATCH
    // ======================================

    return null;

}


// ==========================================
// GLOBAL ACCESS
// ==========================================

window.memoryReply = memoryReply;
window.loadMemory = loadMemory;
window.saveMemory = saveMemory;


// ==========================================
// READY
// ==========================================

console.log(
    "✅ memory.js loaded successfully"
);
