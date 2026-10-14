// =====================================================
// AI LIFE ASSISTANT — ACCOUNT-SPECIFIC STORAGE
// =====================================================
(function () {
    "use strict";
    const PREFIX = "aiLifeAssistant_user_";
    let currentUserId = null;
    let initialized = false;
    function getStorageKey(key) {
        if (!currentUserId) {
            throw new Error(
                "User storage is not initialized. Please sign in first."
            );
        }
        return PREFIX + currentUserId + "_" + key;
    }
    async function initialize() {
        if (!window.supabaseClient) {
            throw new Error("Supabase client is not initialized.");
        }
        const {
            data: { user },
            error
        } = await window.supabaseClient.auth.getUser();
        if (error || !user) {
            currentUserId = null;
            initialized = false;
            throw new Error("Please sign in to access your personal data.");
        }
        currentUserId = user.id;
        initialized = true;
        return user;
    }
    function getItem(key) {
        if (!initialized || !currentUserId) {
            throw new Error("User storage is not initialized.");
        }
        return localStorage.getItem(getStorageKey(key));
    }
    function setItem(key, value) {
        if (!initialized || !currentUserId) {
            throw new Error("User storage is not initialized.");
        }
        localStorage.setItem(getStorageKey(key), value);
    }
    function removeItem(key) {
        if (!initialized || !currentUserId) {
            throw new Error("User storage is not initialized.");
        }
        localStorage.removeItem(getStorageKey(key));
    }
    function isInitialized() {
        return initialized && currentUserId !== null;
    }
    window.userStorage = {
        initialize,
        getItem,
        setItem,
        removeItem,
        isInitialized
    };
    window.supabaseClient.auth.onAuthStateChange(
        function (event, session) {
            if (event === "SIGNED_OUT" || !session) {
                currentUserId = null;
                initialized = false;
            } else if (
                event === "SIGNED_IN" ||
                event === "USER_UPDATED"
            ) {
                currentUserId = session.user.id;
                initialized = true;
            }
        }
    );
})();
