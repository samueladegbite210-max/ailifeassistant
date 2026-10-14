// =====================================================
// AI LIFE ASSISTANT — USER-SPECIFIC STORAGE
// =====================================================

(function () {
    "use strict";

    const PREFIX = "aiLifeAssistant_user_";
    const MIGRATION_KEY = "aiLifeAssistant_storageMigration_v1";

    let currentUserId = null;
    let initialized = false;

    const LEGACY_KEYS = [
        "tasks",
        "goals",
        "notes",
        "events",
        "reminders",
        "notifications",
        "habits",
        "wellness",
        "xp",
        "streak",
        "profileName",
        "aiLifeAssistantConversations",
        "aiLifeAssistantCurrentConversationId"
    ];

    function getStorageKey(key) {
        if (!initialized || !currentUserId) {
            throw new Error(
                "Please initialize user storage before accessing personal data."
            );
        }

        return PREFIX + currentUserId + "_" + key;
    }

    async function initialize() {
        if (!window.supabaseClient) {
            throw new Error("Supabase client is not available.");
        }

        let data;
let error;

try {
    const result =
        await window.supabaseClient.auth.getUser();

    data = result.data;
    error = result.error;

} catch (err) {
    console.error("Supabase getUser failed:", err);
    throw err;
}
        if (error || !data.user) {
            currentUserId = null;
            initialized = false;

            throw new Error("Please sign in before accessing your data.");
        }

        const userId = data.user.id;

        // Never continue using another account's in-memory identity.
        if (currentUserId && currentUserId !== userId) {
            initialized = false;
            currentUserId = null;
        }

        currentUserId = userId;

        // Migrate old shared data to the first account only.
        // Original data is preserved; nothing is deleted.
        if (!localStorage.getItem(MIGRATION_KEY)) {
            for (const key of LEGACY_KEYS) {
                const oldValue = localStorage.getItem(key);
                const newKey = PREFIX + userId + "_" + key;

                if (
                    oldValue !== null &&
                    localStorage.getItem(newKey) === null
                ) {
                    localStorage.setItem(newKey, oldValue);
                }
            }

            localStorage.setItem(MIGRATION_KEY, userId);
        }

        initialized = true;

        return data.user;
    }

    function getItem(key) {
        return localStorage.getItem(getStorageKey(key));
    }

    function setItem(key, value) {
        localStorage.setItem(getStorageKey(key), value);
    }

    function removeItem(key) {
        localStorage.removeItem(getStorageKey(key));
    }

    function isInitialized() {
        return initialized && currentUserId !== null;
    }

    function getUserId() {
        return isInitialized() ? currentUserId : null;
    }

    window.userStorage = {
        initialize,
        getItem,
        setItem,
        removeItem,
        isInitialized,
        getUserId
    };

    window.supabaseClient.auth.onAuthStateChange(
        function (event, session) {
            if (event === "SIGNED_OUT" || !session) {
                currentUserId = null;
                initialized = false;
                return;
            }

            if (
                currentUserId &&
                currentUserId !== session.user.id
            ) {
                currentUserId = null;
                initialized = false;

                window.location.reload();
            }
        }
    );
})();
