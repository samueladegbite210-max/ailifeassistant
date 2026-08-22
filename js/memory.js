"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   memory.js
   Version 1.0
   Personal Memory Engine
========================================== */

console.log("🧠 memory.js loading...");


/* ==========================================
   DEFAULT MEMORY
========================================== */

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


/* ==========================================
   LOAD MEMORY
========================================== */

function loadMemory() {

    try {

        const saved =
            localStorage.getItem("memory");

        if (!saved) {

            return {
                ...DEFAULT_MEMORY,
                likes: [],
                dislikes: [],
                facts: []
            };

        }


        const parsed =
            JSON.parse(saved);


        return {

            ...DEFAULT_MEMORY,

            ...parsed,

            likes: Array.isArray(parsed.likes)
                ? parsed.likes
                : [],

            dislikes: Array.isArray(parsed.dislikes)
                ? parsed.dislikes
                : [],

            facts: Array.isArray(parsed.facts)
                ? parsed.facts
                : []

        };

    }

    catch (error) {

        console.error(
            "❌ Could not load memory:",
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


/* ==========================================
   SAVE MEMORY
========================================== */

function saveMemory(memory) {

    try {

        localStorage.setItem(
            "memory",
            JSON.stringify(memory)
        );

        return true;

    }

    catch (error) {

        console.error(
            "❌ Could not save memory:",
            error
        );

        return false;

    }

}


/* ==========================================
   GET MEMORY
========================================== */

function getMemory() {

    return loadMemory();

}


/* ==========================================
   MEMORY REPLY
========================================== */

function memoryReply(rawMsg) {

    const text =
        safeString(rawMsg).trim();

    const msg =
        normalizeMessage(text);


    if (!msg) {

        return null;

    }


    let memory =
        loadMemory();


    /* ======================================
       SAVE NAME
    ====================================== */

    if (
        msg.startsWith("my name is ")
    ) {

        memory.name =
            text
                .replace(
                    /^my name is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "😊 Nice to meet you " +
            memory.name +
            ". I'll remember your name."
        );

    }


    /* ======================================
       SAVE LOCATION
    ====================================== */

    if (
        msg.startsWith("i live in ")
    ) {

        memory.city =
            text
                .replace(
                    /^i live in /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "📍 I'll remember that you live in " +
            memory.city +
            "."
        );

    }


    /* ======================================
       SAVE JOB
    ====================================== */

    if (
        msg.startsWith("i work as ") ||
        msg.startsWith("i work at ") ||
        msg.startsWith("my job is ")
    ) {

        memory.job =
            text
                .replace(/^i work as /i, "")
                .replace(/^i work at /i, "")
                .replace(/^my job is /i, "")
                .trim();


        saveMemory(memory);


        return (
            "💼 I'll remember that your job is " +
            memory.job +
            "."
        );

    }


    /* ======================================
       SAVE STUDY
    ====================================== */

    if (
        msg.startsWith("i study ")
    ) {

        memory.study =
            text
                .replace(
                    /^i study /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "📚 I'll remember what you study."
        );

    }


    /* ======================================
       SAVE BIRTHDAY
    ====================================== */

    if (
        msg.startsWith("my birthday is ")
    ) {

        memory.birthday =
            text
                .replace(
                    /^my birthday is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return "🎂 Birthday saved.";

    }


    /* ======================================
       SAVE FAVORITE COLOR
    ====================================== */

    if (
        msg.startsWith(
            "my favorite color is "
        )
    ) {

        memory.favoriteColor =
            text
                .replace(
                    /^my favorite color is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return "🎨 Favorite color saved.";

    }


    /* ======================================
       SAVE FAVORITE FOOD
    ====================================== */

    if (
        msg.startsWith(
            "my favorite food is "
        )
    ) {

        memory.favoriteFood =
            text
                .replace(
                    /^my favorite food is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return "🍲 Favorite food saved.";

    }


    /* ======================================
       SAVE FAVORITE CLUB
    ====================================== */

    if (
        msg.startsWith(
            "my favorite club is "
        )
    ) {

        memory.club =
            text
                .replace(
                    /^my favorite club is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return "⚽ Favorite club saved.";

    }


    /* ======================================
       SAVE PHONE
    ====================================== */

    if (
        msg.startsWith(
            "my phone number is "
        )
    ) {

        memory.phone =
            text
                .replace(
                    /^my phone number is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return "📱 Phone number saved.";

    }


    /* ======================================
       SAVE EMAIL
    ====================================== */

    if (
        msg.startsWith(
            "my email is "
        )
    ) {

        memory.email =
            text
                .replace(
                    /^my email is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return "📧 Email saved.";

    }


    /* ======================================
       RELATIONSHIP
    ====================================== */

    if (
        msg === "i am single" ||
        msg.startsWith("i am single ")
    ) {

        memory.relationship =
            "Single";


        saveMemory(memory);


        return "❤️ I'll remember that you're single.";

    }


    if (
        msg === "i am married" ||
        msg.startsWith("i am married ")
    ) {

        memory.relationship =
            "Married";


        saveMemory(memory);


        return "❤️ I'll remember that you're married.";

    }


    /* ======================================
       SAVE DOG
    ====================================== */

    if (
        msg.startsWith(
            "my dog's name is "
        ) ||
        msg.startsWith(
            "my dogs name is "
        )
    ) {

        memory.dog =
            text
                .replace(
                    /^my dog's name is /i,
                    ""
                )
                .replace(
                    /^my dogs name is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "🐶 I'll remember that your dog's name is " +
            memory.dog +
            "."
        );

    }


    /* ======================================
       SAVE GIRLFRIEND
    ====================================== */

    if (
        msg.startsWith(
            "my girlfriend's name is "
        ) ||
        msg.startsWith(
            "my girlfriends name is "
        )
    ) {

        memory.girlfriend =
            text
                .replace(
                    /^my girlfriend's name is /i,
                    ""
                )
                .replace(
                    /^my girlfriends name is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "❤️ I'll remember your girlfriend's name is " +
            memory.girlfriend +
            "."
        );

    }


    /* ======================================
       SAVE MOTHER
    ====================================== */

    if (
        msg.startsWith(
            "my mother's name is "
        ) ||
        msg.startsWith(
            "my mothers name is "
        )
    ) {

        memory.mother =
            text
                .replace(
                    /^my mother's name is /i,
                    ""
                )
                .replace(
                    /^my mothers name is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "👩 I'll remember your mother's name is " +
            memory.mother +
            "."
        );

    }


    /* ======================================
       SAVE FATHER
    ====================================== */

    if (
        msg.startsWith(
            "my father's name is "
        ) ||
        msg.startsWith(
            "my fathers name is "
        )
    ) {

        memory.father =
            text
                .replace(
                    /^my father's name is /i,
                    ""
                )
                .replace(
                    /^my fathers name is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "👨 I'll remember your father's name is " +
            memory.father +
            "."
        );

    }


    /* ======================================
       SAVE BROTHER
    ====================================== */

    if (
        msg.startsWith(
            "my brother's name is "
        ) ||
        msg.startsWith(
            "my brothers name is "
        )
    ) {

        memory.brother =
            text
                .replace(
                    /^my brother's name is /i,
                    ""
                )
                .replace(
                    /^my brothers name is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "👦 I'll remember your brother's name is " +
            memory.brother +
            "."
        );

    }


    /* ======================================
       SAVE SISTER
    ====================================== */

    if (
        msg.startsWith(
            "my sister's name is "
        ) ||
        msg.startsWith(
            "my sisters name is "
        )
    ) {

        memory.sister =
            text
                .replace(
                    /^my sister's name is /i,
                    ""
                )
                .replace(
                    /^my sisters name is /i,
                    ""
                )
                .trim();


        saveMemory(memory);


        return (
            "👧 I'll remember your sister's name is " +
            memory.sister +
            "."
        );

    }


    /* ======================================
       SAVE LIKE
    ====================================== */

    if (
        msg.startsWith("i like ")
    ) {

        const item =
            text
                .replace(
                    /^i like /i,
                    ""
                )
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

        }


        saveMemory(memory);


        return (
            "😊 I'll remember that you like " +
            item +
            "."
        );

    }


    /* ======================================
       SAVE DISLIKE
    ====================================== */

    if (
        msg.startsWith("i don't like ")
    ) {

        const item =
            text
                .replace(
                    /^i don't like /i,
                    ""
                )
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

        }


        saveMemory(memory);


        return (
            "👍 I'll remember that you don't like " +
            item +
            "."
        );

    }


    /* ======================================
       REMEMBER FACT
    ====================================== */

    if (
        msg.startsWith("remember that ")
    ) {

        const fact =
            text
                .replace(
                    /^remember that /i,
                    ""
                )
                .trim();


        if (fact) {

            memory.facts.push(fact);

        }


        saveMemory(memory);


        return (
            "🧠 I have remembered: " +
            fact
        );

    }


    /* ======================================
       RECALL NAME
    ====================================== */

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


    /* ======================================
       RECALL LOCATION
    ====================================== */

    if (
        msg.includes("where do i live")
    ) {

        return memory.city
            ? "📍 You live in " +
              memory.city +
              "."
            : "I don't know where you live yet.";

    }


    /* ======================================
       RECALL JOB
    ====================================== */

    if (
        msg.includes("what is my job") ||
        msg.includes("what do i do for work")
    ) {

        return memory.job
            ? "💼 You work as " +
              memory.job +
              "."
            : "I don't know your job yet.";

    }


    /* ======================================
       RECALL BIRTHDAY
    ====================================== */

    if (
        msg.includes("when is my birthday")
    ) {

        return memory.birthday
            ? "🎂 Your birthday is " +
              memory.birthday +
              "."
            : "I don't know your birthday.";

    }


    /* ======================================
       RECALL FAVORITE COLOR
    ====================================== */

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


    /* ======================================
       RECALL FAVORITE FOOD
    ====================================== */

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


    /* ======================================
       RECALL CLUB
    ====================================== */

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


    /* ======================================
       RECALL DOG
    ====================================== */

    if (
        msg.includes("what is my dog's name") ||
        msg.includes("what is my dogs name") ||
        msg.includes("who is my dog")
    ) {

        return memory.dog
            ? "🐶 Your dog's name is " +
              memory.dog +
              "."
            : "I don't know your dog's name yet.";

    }


    /* ======================================
       RECALL GIRLFRIEND
    ====================================== */

    if (
        msg.includes("who is my girlfriend") ||
        msg.includes(
            "what is my girlfriend's name"
        ) ||
        msg.includes(
            "what is my girlfriends name"
        )
    ) {

        return memory.girlfriend
            ? "❤️ Your girlfriend is " +
              memory.girlfriend +
              "."
            : "I don't know your girlfriend yet.";

    }


    /* ======================================
       RECALL MOTHER
    ====================================== */

    if (
        msg.includes("who is my mother")
    ) {

        return memory.mother
            ? "👩 Your mother is " +
              memory.mother +
              "."
            : "I don't know your mother's name yet.";

    }


    /* ======================================
       RECALL FATHER
    ====================================== */

    if (
        msg.includes("who is my father")
    ) {

        return memory.father
            ? "👨 Your father is " +
              memory.father +
              "."
            : "I don't know your father's name yet.";

    }


    /* ======================================
       RECALL BROTHER
    ====================================== */

    if (
        msg.includes("who is my brother")
    ) {

        return memory.brother
            ? "👦 Your brother is " +
              memory.brother +
              "."
            : "I don't know your brother's name yet.";

    }


    /* ======================================
       RECALL SISTER
    ====================================== */

    if (
        msg.includes("who is my sister")
    ) {

        return memory.sister
            ? "👧 Your sister is " +
              memory.sister +
              "."
            : "I don't know your sister's name yet.";

    }


    /* ======================================
       RECALL EVERYTHING
    ====================================== */

    if (
        msg.includes(
            "what do you remember about me"
        ) ||
        msg.includes(
            "tell me what you know about me"
        )
    ) {

        return buildMemorySummary(memory);

    }


    /* ======================================
       FORGET MEMORY
    ====================================== */

    if (
        msg.startsWith("forget my ")
    ) {

        return forgetMemory(
            memory,
            msg
        );

    }


    /* ======================================
       FORGET FACT
    ====================================== */

    if (
        msg.startsWith("forget that ")
    ) {

        const fact =
            text
                .replace(
                    /^forget that /i,
                    ""
                )
                .trim();


        memory.facts =
            memory.facts.filter(
                value =>
                    value.toLowerCase() !==
                    fact.toLowerCase()
            );


        saveMemory(memory);


        return "🗑️ Done! I forgot that.";

    }


    /* ======================================
       NO MEMORY COMMAND
    ====================================== */

    return null;

}


/* ==========================================
   MEMORY SUMMARY
========================================== */

function buildMemorySummary(memory) {

    let reply =
        "🧠 Here's what I remember about you:\n\n";

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


    if (
        memory.likes.length
    ) {

        reply +=
            "\n😊 Likes:\n";

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


    if (
        memory.dislikes.length
    ) {

        reply +=
            "\n😒 Dislikes:\n";

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


    if (
        memory.facts.length
    ) {

        reply +=
            "\n💡 Facts:\n";

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


/* ==========================================
   FORGET MEMORY
========================================== */

function forgetMemory(
    memory,
    msg
) {

    const item =
        msg
            .replace(
                "forget my ",
                ""
            )
            .trim();


    const fields = {

        "name": "name",

        "city": "city",

        "location": "city",

        "job": "job",

        "birthday": "birthday",

        "favorite color": "favoriteColor",

        "favorite food": "favoriteFood",

        "favorite club": "club",

        "phone": "phone",

        "phone number": "phone",

        "email": "email",

        "relationship": "relationship",

        "dog": "dog",

        "girlfriend": "girlfriend",

        "mother": "mother",

        "father": "father",

        "brother": "brother",

        "sister": "sister"

    };


    const field =
        fields[item];


    if (!field) {

        return (
            "❌ I couldn't find that memory."
        );

    }


    memory[field] = null;

    saveMemory(memory);


    return (
        "🗑️ Done! I've forgotten your " +
        item +
        "."
    );

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.loadMemory = loadMemory;

window.saveMemory = saveMemory;

window.getMemory = getMemory;

window.memoryReply = memoryReply;


console.log(
    "✅ memory.js loaded successfully"
);
