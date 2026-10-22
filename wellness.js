
"use strict";

// ==========================================
// AI LIFE ASSISTANT — WELLNESS
// Supabase user-specific storage
// ==========================================

const DEFAULT_WELLNESS = {
    mood: { emoji: "🙂", text: "Good" },
    energy: { emoji: "🙂", text: "Normal" },
    sleep: 7,
    water: 0
};

let wellness = {
    mood: { ...DEFAULT_WELLNESS.mood },
    energy: { ...DEFAULT_WELLNESS.energy },
    sleep: DEFAULT_WELLNESS.sleep,
    water: DEFAULT_WELLNESS.water
};

let wellnessUserId = null;
let wellnessLoaded = false;
let wellnessRecordExists = false;
let wellnessSaveQueue = Promise.resolve();

function normalizeWellness(data) {
    return {
        mood: data?.mood || { ...DEFAULT_WELLNESS.mood },
        energy: data?.energy || { ...DEFAULT_WELLNESS.energy },
        sleep: Number(data?.sleep ?? DEFAULT_WELLNESS.sleep),
        water: Number(data?.water ?? DEFAULT_WELLNESS.water)
    };
}

// ==========================================
// LOAD WELLNESS FROM SUPABASE
// ==========================================

async function loadWellnessFromSupabase() {
    const client = window.supabaseClient;

    if (!client) {
        throw new Error("Supabase client is not available.");
    }

    const { data: authData, error: authError } =
        await client.auth.getUser();

    if (authError || !authData?.user) {
        throw new Error("Please sign in before opening Wellness.");
    }

    wellnessUserId = authData.user.id;

    const { data, error } = await client
        .from("wellness")
        .select("id, wellness_data")
        .eq("user_id", wellnessUserId)
        .maybeSingle();

    if (error) throw error;

    if (data) {
        wellness = normalizeWellness(data.wellness_data);
        wellnessRecordExists = true;
    } else {
        // Only use legacy data when it belongs to this account.
        const accountKey =
            "aiLifeAssistant_user_" + wellnessUserId + "_wellness";

        const migrationKey =
            localStorage.getItem("aiLifeAssistant_storageMigration_v1");

        let saved = localStorage.getItem(accountKey);

        if (!saved && (!migrationKey || migrationKey === wellnessUserId)) {
            saved = localStorage.getItem("wellness");
        }

        if (saved) {
            try {
                wellness = normalizeWellness(JSON.parse(saved));
            } catch (error) {
                console.error("Could not read saved Wellness data:", error);
            }
        }

        // Create this user's record without deleting browser data.
        const { error: insertError } = await client
            .from("wellness")
            .insert({
                user_id: wellnessUserId,
                wellness_data: wellness
            });

        if (insertError) throw insertError;

        wellnessRecordExists = true;
    }

    // Keep an account-specific browser copy as a backup.
    localStorage.setItem(
        "aiLifeAssistant_user_" + wellnessUserId + "_wellness",
        JSON.stringify(wellness)
    );

    wellnessLoaded = true;
    renderWellness();
}

// ==========================================
// MOOD AND ENERGY OPTIONS
// ==========================================

const moods = [
    { emoji: "😁", text: "Great" },
    { emoji: "🙂", text: "Good" },
    { emoji: "😐", text: "Okay" },
    { emoji: "😔", text: "Sad" },
    { emoji: "😩", text: "Stressed" }
];

const energies = [
    { emoji: "😴", text: "Very Low" },
    { emoji: "😐", text: "Low" },
    { emoji: "🙂", text: "Normal" },
    { emoji: "😃", text: "High" },
    { emoji: "🚀", text: "Excellent" }
];

function loadMoodButtons() {
    const container = document.getElementById("moodButtons");
    if (!container) return;

    container.innerHTML = "";

    moods.forEach(function (mood) {
        const btn = document.createElement("button");
        btn.className = "button";
        btn.innerHTML = `${mood.emoji}<br>${mood.text}`;

        btn.onclick = function () {
            if (!wellnessLoaded) return;

            wellness.mood = { ...mood };
            saveWellness();
            updateMoodDisplay();
        };

        container.appendChild(btn);
    });
}

function loadEnergyButtons() {
    const container = document.getElementById("energyButtons");
    if (!container) return;

    container.innerHTML = "";

    energies.forEach(function (energy) {
        const btn = document.createElement("button");
        btn.className = "button";
        btn.innerHTML = `${energy.emoji}<br>${energy.text}`;

        btn.onclick = function () {
            if (!wellnessLoaded) return;

            wellness.energy = { ...energy };
            saveWellness();
            updateEnergyDisplay();
        };

        container.appendChild(btn);
    });
}

function updateMoodDisplay() {
    const box = document.getElementById("selectedMood");
    if (!box) return;

    box.innerHTML =
        `Current Mood:<br>${wellness.mood.emoji} ${wellness.mood.text}`;
}

function updateEnergyDisplay() {
    const box = document.getElementById("selectedEnergy");
    if (!box) return;

    box.innerHTML =
        `Energy Level:<br>${wellness.energy.emoji} ${wellness.energy.text}`;
}

// ==========================================
// SLEEP TRACKER
// ==========================================

function initializeSleep() {
    const slider = document.getElementById("sleepSlider");
    const value = document.getElementById("sleepValue");

    if (!slider || !value) return;

    slider.value = wellness.sleep;
    value.textContent = wellness.sleep + " Hours";

    slider.oninput = function () {
        if (!wellnessLoaded) return;

        wellness.sleep = Number(this.value);
        value.textContent = this.value + " Hours";
        saveWellness();
    };
}

// ==========================================
// WATER TRACKER
// ==========================================

function initializeWater() {
    const slider = document.getElementById("waterSlider");
    const value = document.getElementById("waterValue");

    if (!slider || !value) return;

    slider.value = wellness.water;
    value.textContent = wellness.water + " Glasses";

    slider.oninput = function () {
        if (!wellnessLoaded) return;

        wellness.water = Number(this.value);
        value.textContent = this.value + " Glasses";
        saveWellness();
    };
}

// ==========================================
// WELLNESS SCORE
// ==========================================

function updateWellnessScore() {
    let score = 0;

    const moodScores = {
        Great: 25,
        Good: 20,
        Okay: 15,
        Sad: 8,
        Stressed: 5
    };

    const energyScores = {
        Excellent: 25,
        High: 20,
        Normal: 15,
        Low: 8,
        "Very Low": 5
    };

    score += moodScores[wellness.mood.text] || 0;
    score += energyScores[wellness.energy.text] || 0;
    score += Math.min(wellness.sleep, 8) * 3;
    score += Math.min(wellness.water, 8) * 3;
    score = Math.min(score, 100);

    const scoreBox = document.getElementById("wellnessScore");
    const message = document.getElementById("wellnessMessage");
    const bar = document.getElementById("wellnessProgressBar");

    if (scoreBox) scoreBox.textContent = score + "%";
    if (bar) bar.style.width = score + "%";

    if (message) {
        if (score >= 90) {
            message.textContent = "🔥 Excellent! You're doing amazing.";
        } else if (score >= 70) {
            message.textContent = "😊 You're having a healthy day.";
        } else if (score >= 50) {
            message.textContent = "🙂 You're doing okay. Keep improving.";
        } else {
            message.textContent = "💙 Take care of yourself today.";
        }
    }
}

// ==========================================
// SAVE WELLNESS TO SUPABASE
// ==========================================

function saveWellness() {
    // Do not save before this account's data has loaded.
    if (!wellnessLoaded || !wellnessUserId) return;

    const snapshot = JSON.stringify(wellness);

    localStorage.setItem(
        "aiLifeAssistant_user_" + wellnessUserId + "_wellness",
        snapshot
    );

    updateWellnessScore();

    // Queue writes so fast slider movements stay in order.
    wellnessSaveQueue = wellnessSaveQueue
        .then(async function () {
            const client = window.supabaseClient;

            if (!client || !wellnessUserId) {
                throw new Error("Wellness account is unavailable.");
            }

            const payload = JSON.parse(snapshot);

            if (wellnessRecordExists) {
                const { error } = await client
                    .from("wellness")
                    .update({
                        wellness_data: payload,
                        updated_at: new Date().toISOString()
                    })
                    .eq("user_id", wellnessUserId);

                if (error) throw error;
            } else {
                const { error } = await client
                    .from("wellness")
                    .insert({
                        user_id: wellnessUserId,
                        wellness_data: payload
                    });

                if (error) throw error;
                wellnessRecordExists = true;
            }
        })
        .catch(function (error) {
            console.error("Wellness save failed:", error);
        });
}

// ==========================================
// RENDER AND START
// ==========================================

function renderWellness() {
    loadMoodButtons();
    loadEnergyButtons();
    updateMoodDisplay();
    updateEnergyDisplay();
    initializeSleep();
    initializeWater();
    updateWellnessScore();
}

document.addEventListener("DOMContentLoaded", async function () {
    // Disable editing until this user's data is loaded.
    try {
        await loadWellnessFromSupabase();
    } catch (error) {
        console.error("Wellness initialization failed:", error);

        const message = document.getElementById("wellnessMessage");
        if (message) {
            message.textContent =
                "Unable to load Wellness data. Please check your sign-in and try again.";
        }
    }
});
