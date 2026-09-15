"use strict";

console.log("🚀 Conversation Manager loading...");

(function () {

    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE_KEY =
        "aiLifeAssistantConversations";

    const CURRENT_CHAT_KEY =
        "aiLifeAssistantCurrentConversationId";


    let conversations = [];

    let currentConversationId =
        localStorage.getItem(
            CURRENT_CHAT_KEY
        ) || null;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const conversationList =
        document.getElementById(
            "conversationList"
        );

    const searchInput =
        document.getElementById(
            "conversationSearchInput"
        );

    const newChatBtn =
        document.getElementById(
            "newChatBtn"
        );

    const clearAllBtn =
        document.getElementById(
            "clearAllConversationsBtn"
        );

    const chatBox =
        document.getElementById(
            "chatBox"
        );


    if (!conversationList || !chatBox) {

        console.error(
            "❌ Conversation Manager elements not found"
        );

        return;

    }


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function loadConversations() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (!saved) {

                conversations = [];

                return;

            }

            const parsed =
                JSON.parse(saved);

            conversations =
                Array.isArray(parsed)
                    ? parsed
                    : [];

        }

        catch (error) {

            console.error(
                "❌ Failed to load conversations:",
                error
            );

            conversations = [];

        }

    }


    function saveConversations() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    conversations
                )
            );

        }

        catch (error) {

            console.error(
                "❌ Failed to save conversations:",
                error
            );

        }

    }


    function setCurrentConversationId(
        id
    ) {

        currentConversationId =
            id || null;


        if (currentConversationId) {

            localStorage.setItem(
                CURRENT_CHAT_KEY,
                currentConversationId
            );

        }

        else {

            localStorage.removeItem(
                CURRENT_CHAT_KEY
            );

        }

    }


    /* =====================================================
       ID
    ===================================================== */

    function createConversationId() {

        return (
            "chat_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );

    }


    /* =====================================================
       TITLE
    ===================================================== */

    function createConversationTitle(
        text
    ) {

        if (!text) {

            return "New Chat";

        }


        let title =
            String(text)
                .replace(/\s+/g, " ")
                .trim();


        if (!title) {

            return "New Chat";

        }


        if (title.length > 45) {

            title =
                title.substring(
                    0,
                    45
                ).trim() + "…";

        }


        return title;

    }


    /* =====================================================
       GET CURRENT DOM MESSAGES
    ===================================================== */

    function getCurrentMessages() {

        const messages = [];


        const elements =
            chatBox.querySelectorAll(
                ".message"
            );


        elements.forEach(
            function (element) {

                const textElement =
                    element.querySelector(
                        ".messageText"
                    );


                if (!textElement) {

                    return;

                }


                let content =
                    (
                        textElement.innerText ||
                        textElement.textContent ||
                        ""
                    )
                    .replace(
                        /\u00a0/g,
                        " "
                    )
                    .trim();


                if (!content) {

                    return;

                }


                let role = null;


                if (
                    element.classList.contains(
                        "user"
                    )
                ) {

                    role = "user";

                }

                else if (
                    element.classList.contains(
                        "ai"
                    )
                ) {

                    role = "assistant";

                }


                if (!role) {

                    return;

                }


                /*
                 * Ignore the default welcome message.
                 */

                if (
                    role === "assistant" &&
                    content.includes(
                        "How can I help you today?"
                    )
                ) {

                    return;

                }


                messages.push({

                    role: role,

                    content: content,

                    timestamp:
                        new Date().toISOString()

                });

            }
        );


        return messages;

    }


    /* =====================================================
       FIND CURRENT CONVERSATION
    ===================================================== */

    function getCurrentConversation() {

        if (!currentConversationId) {

            return null;

        }


        return conversations.find(
            function (conversation) {

                return (
                    conversation.id ===
                    currentConversationId
                );

            }
        ) || null;

    }


    /* =====================================================
       SAVE CURRENT CHAT
    ===================================================== */

    function saveCurrentConversation() {

        const messages =
            getCurrentMessages();


        /*
         * Don't create a conversation
         * until the user actually sends
         * something.
         */

        const firstUserMessage =
            messages.find(
                function (message) {

                    return (
                        message.role ===
                        "user"
                    );

                }
            );


        if (!firstUserMessage) {

            return null;

        }


        let conversation =
            getCurrentConversation();


        /* =================================================
           CREATE NEW CONVERSATION
        ================================================= */

        if (!conversation) {

            const id =
                createConversationId();


            conversation = {

                id: id,

                title:
                    createConversationTitle(
                        firstUserMessage.content
                    ),

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString(),

                messages: messages

            };


            conversations.unshift(
                conversation
            );


            setCurrentConversationId(
                id
            );

        }

        /* =================================================
           UPDATE EXISTING CONVERSATION
        ================================================= */

        else {

            conversation.messages =
                messages;


            conversation.updatedAt =
                new Date().toISOString();


            /*
             * Make sure title exists.
             */

            if (
                !conversation.title ||
                conversation.title ===
                "New Chat"
            ) {

                conversation.title =
                    createConversationTitle(
                        firstUserMessage.content
                    );

            }

        }


        saveConversations();

        renderConversationList(
            searchInput
                ? searchInput.value
                : ""
        );


        console.log(
            "💾 Conversation saved:",
            conversation.title
        );


        return conversation;

    }


    /* =====================================================
       RENDER LIST
    ===================================================== */

    function renderConversationList(searchTerm = "") {

    conversationList.innerHTML = "";

    const term =
        String(searchTerm)
            .toLowerCase()
            .trim();

    const now = new Date();

    const startOfToday =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

    const startOfYesterday =
        new Date(
            startOfToday.getTime() -
            24 * 60 * 60 * 1000
        );

    const startOfSevenDays =
        new Date(
            startOfToday.getTime() -
            7 * 24 * 60 * 60 * 1000
        );


    /*
     * Sort newest first
     */

    const sorted =
        conversations
            .slice()
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.updatedAt
                        ) -
                        new Date(
                            a.updatedAt
                        )
                    );

                }
            );


    /*
     * Search
     */

    const filtered =
        sorted.filter(
            function (conversation) {

                if (!term) {

                    return true;

                }


                const title =
                    String(
                        conversation.title || ""
                    ).toLowerCase();


                const messages =
                    Array.isArray(
                        conversation.messages
                    )
                        ? conversation.messages
                            .map(
                                function (message) {

                                    return String(
                                        message.content ||
                                        ""
                                    );

                                }
                            )
                            .join(" ")
                            .toLowerCase()
                        : "";


                return (
                    title.includes(term) ||
                    messages.includes(term)
                );

            }
        );


    if (!filtered.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "emptyConversations";

        empty.textContent =
            term
                ? "No matching conversations"
                : "No conversations yet";

        conversationList.appendChild(
            empty
        );

        return;

    }


    /*
     * Group conversations
     */

    const groups = {

        today: [],

        yesterday: [],

        previous7Days: [],

        older: []

    };


    filtered.forEach(
        function (conversation) {

            const date =
                new Date(
                    conversation.updatedAt
                );


            if (date >= startOfToday) {

                groups.today.push(
                    conversation
                );

            }

            else if (
                date >= startOfYesterday
            ) {

                groups.yesterday.push(
                    conversation
                );

            }

            else if (
                date >= startOfSevenDays
            ) {

                groups.previous7Days.push(
                    conversation
                );

            }

            else {

                groups.older.push(
                    conversation
                );

            }

        }
    );


    /*
     * Render groups
     */

    renderConversationGroup(
        "Today",
        groups.today
    );

    renderConversationGroup(
        "Yesterday",
        groups.yesterday
    );

    renderConversationGroup(
        "Previous 7 Days",
        groups.previous7Days
    );

    renderConversationGroup(
        "Older",
        groups.older
    );

}

   function renderConversationGroup(
    title,
    items
) {

    if (!items.length) {

        return;

    }


    const section =
        document.createElement(
            "div"
        );

    section.className =
        "conversationGroup";


    const heading =
        document.createElement(
            "div"
        );

    heading.className =
        "conversationGroupTitle";

    heading.textContent =
        title;


    section.appendChild(
        heading
    );


    items.forEach(
        function (conversation) {

            section.appendChild(
                createConversationItem(
                    conversation
                )
            );

        }
    );


    conversationList.appendChild(
        section
    );

} 


    /* =====================================================
       CONVERSATION ITEM
    ===================================================== */

    function createConversationItem(
        conversation
    ) {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "conversationItem";


        if (
            conversation.id ===
            currentConversationId
        ) {

            item.classList.add(
                "active"
            );

        }


        const openButton =
            document.createElement(
                "button"
            );

        openButton.type = "button";

        openButton.className =
            "conversationOpenButton";


        const icon =
            document.createElement(
                "span"
            );

        icon.className =
            "conversationIcon";

        icon.textContent =
            "💬";


        const title =
            document.createElement(
                "span"
            );

        title.className =
            "conversationTitle";

        title.textContent =
            conversation.title ||
            "New Chat";


        openButton.appendChild(
            icon
        );

        openButton.appendChild(
            title
        );


        openButton.addEventListener(
            "click",
            function () {

                openConversation(
                    conversation.id
                );

            }
        );


        const optionsButton =
    document.createElement(
        "button"
    );

optionsButton.type = "button";

optionsButton.className =
    "conversationDeleteButton";

optionsButton.textContent =
    "⋯";

optionsButton.setAttribute(
    "aria-label",
    "Conversation options"
);


optionsButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        showConversationOptions(
            conversation
        );

    }
);
        item.appendChild(
            openButton
        );

        item.appendChild(
    optionsButton
);


        return item;

    }


    /* =====================================================
       OPEN CONVERSATION
    ===================================================== */

    function openConversation(
        conversationId
    ) {

        const conversation =
            conversations.find(
                function (item) {

                    return (
                        item.id ===
                        conversationId
                    );

                }
            );


        if (!conversation) {

            console.error(
                "❌ Conversation not found"
            );

            return;

        }


        /*
         * Set active conversation FIRST.
         */

        setCurrentConversationId(
            conversation.id
        );


        /*
         * Clear AI context.
         * The actual uploaded image is
         * intentionally not stored.
         */

        if (
            typeof window.clearConversationHistory ===
            "function"
        ) {

            window.clearConversationHistory();

        }


        /*
         * Restore conversation history.
         *
         * We give loaded messages fresh
         * timestamps so the existing
         * 30-minute AI context system
         * can use the restored conversation.
         */

        if (
            Array.isArray(
                window.conversationHistory
            )
        ) {

            window.conversationHistory =
                conversation.messages.map(
                    function (message) {

                        return {

                            role:
                                message.role,

                            content:
                                message.content,

                            timestamp:
                                Date.now()

                        };

                    }
                );

        }


        /*
         * Clear visible chat.
         */

        chatBox.innerHTML =
            "";


        /*
         * Render saved messages.
         */

        conversation.messages.forEach(
            function (message) {

                addMessageToChat(
                    message.role,
                    message.content,
                    message.timestamp
                );

            }
        );


        /*
         * Close drawer.
         */

        closeSideMenu();


        /*
         * Scroll to bottom.
         */

        setTimeout(
            function () {

                chatBox.scrollTop =
                    chatBox.scrollHeight;

            },
            50
        );


        renderConversationList(
            searchInput
                ? searchInput.value
                : ""
        );


        console.log(
            "📂 Opened:",
            conversation.title
        );

    }


    /* =====================================================
       ADD SAVED MESSAGE TO CHAT
    ===================================================== */

    function addMessageToChat(
        role,
        content,
        timestamp
    ) {

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "message " +
            (
                role === "user"
                    ? "user"
                    : "ai"
            );


        const messageText =
            document.createElement(
                "div"
            );

        messageText.className =
            "messageText";


        /*
         * Restore AI formatting if
         * formatter is available.
         */

        if (
            role === "assistant" &&
            typeof window.formatAIResponse ===
            "function"
        ) {

            const formatted =
                window.formatAIResponse(
                    String(content)
                );


            if (
                formatted instanceof
                DocumentFragment
            ) {

                messageText.appendChild(
                    formatted
                );

            }

            else if (
                formatted instanceof Node
            ) {

                messageText.appendChild(
                    formatted
                );

            }

            else {

                messageText.innerHTML =
                    String(formatted);

            }

        }

        else {

            messageText.textContent =
                String(content);

        }


        const time =
            document.createElement(
                "div"
            );

        time.className =
            "messageTime";

        time.textContent =
            formatTime(
                timestamp
            );


        message.appendChild(
            messageText
        );

        message.appendChild(
            time
        );


        chatBox.appendChild(
            message
        );

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(
        timestamp
    ) {

        if (!timestamp) {

            return "";

        }


        try {

            return new Date(
                timestamp
            ).toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

        }

        catch (error) {

            return "";

        }

    }


    /* =====================================================
       NEW CHAT
    ===================================================== */

    function startNewChat() {

        /*
         * Save the current conversation
         * before leaving it.
         */

        saveCurrentConversation();


        /*
         * IMPORTANT:
         * Forget the old ID.
         */

        setCurrentConversationId(
            null
        );


        /*
         * Clear AI conversation memory.
         */

        if (
            typeof window.clearConversationHistory ===
            "function"
        ) {

            window.clearConversationHistory();

        }

        else {

            window.conversationHistory =
                [];

        }


        /*
         * Clear current chat.
         */

        chatBox.innerHTML =
            "";


        /*
         * Clear composer.
         */

        const input =
            document.getElementById(
                "userInput"
            );

        if (input) {

            input.value =
                "";

        }


        /*
         * Restore welcome screen.
         */

        const welcome =
            document.createElement(
                "div"
            );

        welcome.className =
            "message ai";


        const welcomeText =
            document.createElement(
                "div"
            );

        welcomeText.className =
            "messageText";


        const name =
            document.getElementById(
                "welcomeName"
            );


        welcomeText.textContent =
            "👋 Hello " +
            (
                name
                    ? name.textContent.trim()
                    : "Samuel"
            ) +
            "!\n\nHow can I help you today?";


        const welcomeTime =
            document.createElement(
                "div"
            );

        welcomeTime.className =
            "messageTime";

        welcomeTime.textContent =
            "Now";


        welcome.appendChild(
            welcomeText
        );

        welcome.appendChild(
            welcomeTime
        );


        chatBox.appendChild(
            welcome
        );


        closeSideMenu();


        renderConversationList();


        console.log(
            "🆕 New independent conversation started"
        );

    }

/* =====================================================
   CONVERSATION OPTIONS
===================================================== */

function showConversationOptions(
    conversation
) {

    const choice =
        prompt(
            "Conversation options:\n\n" +
            "1. Rename\n" +
            "2. Delete\n\n" +
            "Enter 1 or 2:"
        );


    if (choice === "1") {

        renameConversation(
            conversation.id
        );

    }

    else if (choice === "2") {

        deleteConversation(
            conversation.id
        );

    }

}


/* =====================================================
   RENAME CONVERSATION
===================================================== */

function renameConversation(
    conversationId
) {

    const conversation =
        conversations.find(
            function (item) {

                return (
                    item.id ===
                    conversationId
                );

            }
        );


    if (!conversation) {

        return;

    }


    const newTitle =
        prompt(
            "Rename conversation:",
            conversation.title ||
            "New Chat"
        );


    if (newTitle === null) {

        return;

    }


    const cleanedTitle =
        newTitle
            .replace(/\s+/g, " ")
            .trim();


    if (!cleanedTitle) {

        return;

    }


    conversation.title =
        cleanedTitle.length > 60
            ? cleanedTitle
                .substring(0, 60)
                .trim() + "…"
            : cleanedTitle;


    conversation.updatedAt =
        new Date().toISOString();


    saveConversations();


    renderConversationList(
        searchInput
            ? searchInput.value
            : ""
    );


    console.log(
        "✏️ Conversation renamed:",
        conversation.title
    );

}
    /* =====================================================
       DELETE
    ===================================================== */

    function deleteConversation(
        conversationId
    ) {

        const conversation =
            conversations.find(
                function (item) {

                    return (
                        item.id ===
                        conversationId
                    );

                }
            );


        if (!conversation) {

            return;

        }


        const confirmed =
            confirm(
                "Delete \"" +
                (
                    conversation.title ||
                    "this conversation"
                ) +
                "\"?"
            );


        if (!confirmed) {

            return;

        }


        conversations =
            conversations.filter(
                function (item) {

                    return (
                        item.id !==
                        conversationId
                    );

                }
            );


        /*
         * If deleting the currently
         * open conversation, start
         * a fresh chat.
         */

        if (
            currentConversationId ===
            conversationId
        ) {

            setCurrentConversationId(
                null
            );


            if (
                typeof window.clearConversationHistory ===
                "function"
            ) {

                window.clearConversationHistory();

            }


            chatBox.innerHTML =
                "";

        }


        saveConversations();

        renderConversationList();


        console.log(
            "🗑️ Conversation deleted"
        );

    }


    /* =====================================================
       CLEAR ALL
    ===================================================== */

    function clearAllConversations() {

        if (!conversations.length) {

            return;

        }


        const confirmed =
            confirm(
                "Delete all saved conversations?"
            );


        if (!confirmed) {

            return;

        }


        conversations = [];


        setCurrentConversationId(
            null
        );


        if (
            typeof window.clearConversationHistory ===
            "function"
        ) {

            window.clearConversationHistory();

        }


        chatBox.innerHTML =
            "";


        saveConversations();

        renderConversationList();


        console.log(
            "🗑️ All conversations cleared"
        );

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                renderConversationList(
                    searchInput.value
                );

            }
        );

    }


    /* =====================================================
       NEW CHAT BUTTON
    ===================================================== */

    if (newChatBtn) {

        newChatBtn.addEventListener(
            "click",
            function () {

                startNewChat();

            }
        );

    }


    /* =====================================================
       CLEAR ALL BUTTON
    ===================================================== */

    if (clearAllBtn) {

        clearAllBtn.addEventListener(
            "click",
            function () {

                clearAllConversations();

            }
        );

    }


    /* =====================================================
       AUTO SAVE CHAT CHANGES
    ===================================================== */

    let saveTimer = null;


    function scheduleAutoSave() {

        clearTimeout(
            saveTimer
        );


        saveTimer =
            setTimeout(
                function () {

                    saveCurrentConversation();

                },
                700
            );

    }


    const chatObserver =
        new MutationObserver(
            function () {

                scheduleAutoSave();

            }
        );


    chatObserver.observe(
        chatBox,
        {
            childList: true,
            subtree: true,
            characterData: true
        }
    );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadConversations();

    /*
     * If a previous active conversation
     * exists, restore it.
     */

    if (currentConversationId) {

        const existing =
            conversations.find(
                function (conversation) {

                    return (
                        conversation.id ===
                        currentConversationId
                    );

                }
            );


        if (existing) {

            setTimeout(
                function () {

                    openConversation(
                        existing.id
                    );

                },
                50
            );

        }

        else {

            setCurrentConversationId(
                null
            );

        }

    }


    renderConversationList();


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.conversationManager = {

    saveCurrentConversation:
        saveCurrentConversation,

    renderConversationList:
        renderConversationList,

    openConversation:
        openConversation,

    startNewChat:
        startNewChat,

    renameConversation:
        renameConversation,

    deleteConversation:
        deleteConversation,

    clearAllConversations:
        clearAllConversations,

    getCurrentConversation:
        getCurrentConversation

};

    console.log(
        "✅ Conversation Manager ready"
    );

})();
