"use strict";

// ==========================================
// AI LIFE ASSISTANT
// memory.js
// Version 7.0
// Advanced Memory System
// ==========================================

console.log("🧠 memory.js v7.0 loading...");


// ==========================================
// MEMORY LIMITS
// ==========================================

const MAX_CONVERSATION_MEMORY = 30;
const MAX_FACTS = 100;
const MAX_LIKES = 50;
const MAX_DISLIKES = 50;


// ==========================================
// DEFAULT MEMORY
// ==========================================

const DEFAULT_MEMORY = {

    // ------------------------------
    // PROFILE
    // ------------------------------

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


    // ------------------------------
    // FAMILY / PEOPLE
    // ------------------------------

    dog: null,
    girlfriend: null,
    mother: null,
    father: null,
    brother: null,
    sister: null,


    // ------------------------------
    // PREFERENCES
    // ------------------------------

    likes: [],
    dislikes: [],


    // ------------------------------
    // IMPORTANT FACTS
    // ------------------------------

    facts: [],


    // ------------------------------
    // RECENT CONVERSATION
    // ------------------------------

    conversation: [],


    // ------------------------------
    // MEMORY METADATA
    // ------------------------------

    createdAt: null,
    updatedAt: null

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


        const loaded = {

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
                    : [],

            conversation:
                Array.isArray(saved?.conversation)
                    ? saved.conversation
                    : []

        };


        if (!loaded.createdAt) {

            loaded.createdAt =
                new Date().toISOString();

        }


        loaded.updatedAt =
            loaded.updatedAt ||
            loaded.createdAt;


        return loaded;


    } catch (error) {

        console.error(
            "❌ Memory load error:",
            error
        );


        return {

            ...DEFAULT_MEMORY,

            likes: [],
            dislikes: [],
            facts: [],
            conversation: [],

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

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

        memory.updatedAt =
            new Date().toISOString();


        localStorage.setItem(
            "memory",
            JSON.stringify(memory)
        );


        console.log(
            "💾 Memory saved"
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
// ADD CONVERSATION MEMORY
// ==========================================

function rememberConversation(
    role,
    content
) {

    const text =
        normalizeMemoryText(content);


    if (!text) {

        return false;

    }


    if (
        role !== "user" &&
        role !== "ai" &&
        role !== "assistant"
    ) {

        return false;

    }


    memory.conversation.push({

        role:
            role === "assistant"
                ? "ai"
                : role,

        content: text,

        timestamp:
            new Date().toISOString()

    });


    // Keep only recent conversations

    if (
        memory.conversation.length >
        MAX_CONVERSATION_MEMORY
    ) {

        memory.conversation =
            memory.conversation.slice(
                -MAX_CONVERSATION_MEMORY
            );

    }


    saveMemory();

    return true;

}


// ==========================================
// GET RECENT CONVERSATION
// ==========================================

function getRecentConversation(
    limit = 10
) {

    const amount =
        Math.max(
            1,
            Number(limit) || 10
        );


    return memory.conversation
        .slice(-amount)
        .map(item => ({
            role: item.role,
            content: item.content,
            timestamp: item.timestamp
        }));

}


// ==========================================
// CLEAR CONVERSATION MEMORY
// ==========================================

function clearConversationMemory() {

    memory.conversation = [];

    saveMemory();

    console.log(
        "🗑️ Conversation memory cleared"
    );

    return true;

}


// ==========================================
// ADD IMPORTANT FACT
// ==========================================

function rememberFact(fact) {

    const value =
        normalizeMemoryText(fact);


    if (!value) {

        return false;

    }


    const exists =
        memory.facts.some(
            item =>
                String(item).toLowerCase() ===
                value.toLowerCase()
        );


    if (!exists) {

        memory.facts.push(value);

    }


    if (
        memory.facts.length >
        MAX_FACTS
    ) {

        memory.facts =
            memory.facts.slice(
                -MAX_FACTS
            );

    }


    saveMemory();

    return true;

}


// ==========================================
// ADD LIKE
// ==========================================

function rememberLike(value) {

    const item =
        normalizeMemoryText(value);


    if (!item) {

        return false;

    }


    const exists =
        memory.likes.some(
            value =>
                String(value).toLowerCase() ===
                item.toLowerCase()
        );


    if (!exists) {

        memory.likes.push(item);

    }


    if (
        memory.likes.length >
        MAX_LIKES
    ) {

        memory.likes =
            memory.likes.slice(
                -MAX_LIKES
            );

    }


    saveMemory();

    return true;

}


// ==========================================
// ADD DISLIKE
// ==========================================

function rememberDislike(value) {

    const item =
        normalizeMemoryText(value);


    if (!item) {

        return false;

    }


    const exists =
        memory.dislikes.some(
            value =>
                String(value).toLowerCase() ===
                item.toLowerCase()
        );


    if (!exists) {

        memory.dislikes.push(item);

    }


    if (
        memory.dislikes.length >
        MAX_DISLIKES
    ) {

        memory.dislikes =
            memory.dislikes.slice(
                -MAX_DISLIKES
            );

    }


    saveMemory();

    return true;

}


// ==========================================
// MEMORY REPLY
// ==========================================

function memoryReply(
    originalMsg,
    lowerMsg
) {

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

    if (
        msg.startsWith(
            "my name is "
        )
    ) {

        memory.name =
            original
                .replace(
                    /^my name is /i,
                    ""
                )
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

    if (
        msg.startsWith(
            "i live in "
        )
    ) {

        memory.city =
            original
                .replace(
                    /^i live in /i,
                    ""
                )
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


        return (
            "💼 I'll remember your job."
        );

    }


    // ======================================
    // SAVE STUDY
    // ======================================

    if (
        msg.startsWith("i study ")
    ) {

        memory.study =
            original
                .replace(
                    /^i study /i,
                    ""
                )
                .trim();


        saveMemory();


        return (
            "📚 I'll remember what you study."
        );

    }


    // ======================================
    // SAVE BIRTHDAY
    // ======================================

    if (
        msg.startsWith(
            "my birthday is "
        )
    ) {

        memory.birthday =
            original
                .replace(
                    /^my birthday is /i,
                    ""
                )
                .trim();


        saveMemory();


        return (
            "🎂 Your birthday has been saved."
        );

    }


    // ======================================
    // FAVORITE COLOR
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


        return (
            "🎨 Your favorite color has been saved."
        );

    }


    // ======================================
    // FAVORITE FOOD
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


        return (
            "🍲 Your favorite food has been saved."
        );

    }


    // ======================================
    // FAVORITE CLUB
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


        return (
            "⚽ Your favorite club has been saved."
        );

    }


    // ======================================
    // PHONE
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


        return (
            "📱 Your phone number has been saved."
        );

    }


    // ======================================
    // EMAIL
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


        return (
            "📧 Your email has been saved."
        );

    }


    // ======================================
    // RELATIONSHIP
    // ======================================

    if (
        msg.startsWith("i am single")
    ) {

        memory.relationship =
            "Single";


        saveMemory();


        return (
            "❤️ I'll remember that you're single."
        );

    }


    if (
        msg.startsWith("i am married")
    ) {

        memory.relationship =
            "Married";


        saveMemory();


        return (
            "❤️ I'll remember that you're married."
        );

    }


    // ======================================
    // FAMILY / PET
    // ======================================

    const specialMemoryPatterns = [

        {
            key: "dog",
            pattern: /^my dog's name is /i,
            response:
                "🐶 I'll remember your dog's name."
        },

        {
            key: "girlfriend",
            pattern: /^my girlfriend is /i,
            response:
                "❤️ I'll remember your girlfriend."
        },

        {
            key: "mother",
            pattern: /^my mother's name is /i,
            response:
                "👩 I'll remember your mother's name."
        },

        {
            key: "father",
            pattern: /^my father's name is /i,
            response:
                "👨 I'll remember your father's name."
        },

        {
            key: "brother",
            pattern: /^my brother's name is /i,
            response:
                "👦 I'll remember your brother's name."
        },

        {
            key: "sister",
            pattern: /^my sister's name is /i,
            response:
                "👧 I'll remember your sister's name."
        }

    ];


    for (
        const item of specialMemoryPatterns
    ) {

        if (
            item.pattern.test(original)
        ) {

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

    if (
        msg.startsWith("i like ")
    ) {

        const item =
            original
                .replace(
                    /^i like /i,
                    ""
                )
                .trim();


        if (item) {

            rememberLike(item);


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

    if (
        msg.startsWith(
            "i don't like "
        )
    ) {

        const item =
            original
                .replace(
                    /^i don't like /i,
                    ""
                )
                .trim();


        if (item) {

            rememberDislike(item);


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

    if (
        msg.startsWith(
            "remember that "
        )
    ) {

        const fact =
            original
                .replace(
                    /^remember that /i,
                    ""
                )
                .trim();


        if (fact) {

            rememberFact(fact);


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
        msg.includes(
            "what is my name"
        ) ||
        msg.includes(
            "who am i"
        )
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
        msg.includes(
            "where do i live"
        )
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
        msg.includes(
            "what is my job"
        )
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
        msg.includes(
            "when is my birthday"
        )
    ) {

        return memory.birthday
            ? "🎂 Your birthday is " +
              memory.birthday +
              "."
            : "I don't know your birthday.";

    }


    // ======================================
    // FAVORITE COLOR
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


    // ======================================
    // FAVORITE FOOD
    // ======================================

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


    // ======================================
    // FAVORITE CLUB
    // ======================================

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
    // FAMILY RECALL
    // ======================================

    const recallRules = [

        [
            [
                "what is my dog's name",
                "who is my dog",
                "my dog name"
            ],
            "dog",
            "🐶 Your dog's name is ",
            "I don't know your dog's name yet."
        ],

        [
            [
                "who is my girlfriend",
                "what is my girlfriend's name"
            ],
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


    for (
        const rule of recallRules
    ) {

        if (
            rule[0].some(
                phrase =>
                    msg.includes(phrase)
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
    // FORGET PROFILE MEMORY
    // ======================================

    if (
        msg.startsWith(
            "forget my "
        )
    ) {

        const item =
            msg
                .replace(
                    "forget my ",
                    ""
                )
                .trim();


        const fields = {

            name: "name",
            city: "city",
            location: "city",
            job: "job",
            study: "study",
            birthday: "birthday",

            "favorite color":
                "favoriteColor",

            "favorite food":
                "favoriteFood",

            "favorite club":
                "club",

            phone: "phone",
            "phone number": "phone",

            email: "email",

            relationship:
                "relationship",

            dog: "dog",
            girlfriend: "girlfriend",
            mother: "mother",
            father: "father",
            brother: "brother",
            sister: "sister"

        };


        const key =
            fields[item];


        if (!key) {

            return (
                "❌ I couldn't find that memory."
            );

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

    if (
        msg.startsWith(
            "forget that "
        )
    ) {

        const fact =
            original
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


        saveMemory();


        return (
            "🗑️ I forgot that."
        );

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


        function add(
            label,
            value
        ) {

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


        add(
            "👤 Name: ",
            memory.name
        );

        add(
            "📍 Lives in: ",
            memory.city
        );

        add(
            "💼 Job: ",
            memory.job
        );

        add(
            "🎓 Study: ",
            memory.study
        );

        add(
            "🎂 Birthday: ",
            memory.birthday
        );

        add(
            "🎨 Favorite Color: ",
            memory.favoriteColor
        );

        add(
            "🍲 Favorite Food: ",
            memory.favoriteFood
        );

        add(
            "⚽ Favorite Club: ",
            memory.club
        );

        add(
            "📱 Phone: ",
            memory.phone
        );

        add(
            "📧 Email: ",
            memory.email
        );

        add(
            "❤️ Relationship: ",
            memory.relationship
        );

        add(
            "🐶 Dog: ",
            memory.dog
        );

        add(
            "❤️ Girlfriend: ",
            memory.girlfriend
        );

        add(
            "👩 Mother: ",
            memory.mother
        );

        add(
            "👨 Father: ",
            memory.father
        );

        add(
            "👦 Brother: ",
            memory.brother
        );

        add(
            "👧 Sister: ",
            memory.sister
        );


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


    // ======================================
    // NO MEMORY MATCH
    // ======================================

    return null;

}


// ==========================================
// GET COMPLETE MEMORY
// ==========================================

function getMemory() {

    return {
        ...memory,

        likes: [
            ...memory.likes
        ],

        dislikes: [
            ...memory.dislikes
        ],

        facts: [
            ...memory.facts
        ],

        conversation: [
            ...memory.conversation
        ]

    };

}


// ==========================================
// RESET ALL MEMORY
// ==========================================

function clearAllMemory() {

    memory = {

        ...DEFAULT_MEMORY,

        likes: [],
        dislikes: [],
        facts: [],
        conversation: [],

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    saveMemory();


    console.log(
        "🗑️ All AI memory cleared"
    );


    return true;

}


// ==========================================
// GLOBAL ACCESS
// ==========================================

window.memoryReply =
    memoryReply;

window.loadMemory =
    loadMemory;

window.saveMemory =
    saveMemory;

window.getMemory =
    getMemory;

window.rememberConversation =
    rememberConversation;

window.getRecentConversation =
    getRecentConversation;

window.clearConversationMemory =
    clearConversationMemory;

window.rememberFact =
    rememberFact;

window.rememberLike =
    rememberLike;

window.rememberDislike =
    rememberDislike;

window.clearAllMemory =
    clearAllMemory;


// ==========================================
// READY
// ==========================================

console.log(
    "✅ memory.js v7.0 loaded successfully"
);
