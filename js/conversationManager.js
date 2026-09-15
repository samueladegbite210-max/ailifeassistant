"use strict";

console.log("🚀 Conversation Manager loading...");

(function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const STORAGE_KEY =
        "aiLifeAssistantConversations";

    let conversations = [];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sideMenu =
        document.getElementById("sideMenu");

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
        document.getElementById("chatBox");


    if (!conversationList || !chatBox) {

        console.error(
            "❌ Conversation Manager: required elements not found"
        );

        return;

    }


    /* =====================================================
       LOAD CONVERSATIONS
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

            if (Array.isArray(parsed)) {

                conversations = parsed;

            }

            else {

                conversations = [];

            }

        }

        catch (error) {

            console.error(
                "❌ Could not load conversations:",
                error
            );

            conversations = [];

        }

    }


    /* =====================================================
       SAVE CONVERSATIONS
    ===================================================== */

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
                "❌ Could not save conversations:",
                error
            );

        }

    }


    /* =====================================================
       CREATE ID
    ===================================================== */

    function createId() {

        return (
            "chat_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );

    }


    /* =====================================================
       CREATE TITLE
    ===================================================== */

    function createTitle(text) {

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


        /*
         * Remove common attachment prefixes
         */

        title =
            title
                .replace(
                    /^(what is this|describe this image|analyze this image)\s*/i,
                    ""
                )
                .trim();


        if (!title) {

            title = String(text)
                .replace(/\s+/g, " ")
                .trim();

        }


        /*
         * Keep titles short
         */

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
       GET CURRENT CHAT MESSAGES
    ===================================================== */

    function getCurrentMessages() {

        const messages = [];


        if (!chatBox) {

            return messages;

        }


        const messageElements =
            chatBox.querySelectorAll(
                ".message"
            );


        messageElements.forEach(
            function (element) {

                const textElement =
                    element.querySelector(
                        ".messageText"
                    );


                if (!textElement) {

                    return;

                }


                const content =
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
                 * Ignore the initial welcome
                 * message.
                 */

                if (
                    role === "assistant" &&
                    /^👋 Hello\s+/i.test(
                        content
                    ) &&
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
       SAVE CURRENT CHAT
    ===================================================== */

    function saveCurrentConversation() {

        const messages =
            getCurrentMessages();


        /*
         * Need at least one user message
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


        /*
         * If the conversation already exists,
         * update it.
         */

        let conversation =
            conversations[0];


        /*
         * For now the newest conversation
         * is treated as the current one.
         */

        if (
            !conversation ||
            conversation.messages.length === 0
        ) {

            conversation = {

                id: createId(),

                title:
                    createTitle(
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

        }

        else {

            conversation.messages =
                messages;

            conversation.updatedAt =
                new Date().toISOString();

        }


        saveConversations();

        renderConversationList();

        return conversation;

    }


    /* =====================================================
       RENDER CONVERSATION LIST
    ===================================================== */

    function renderConversationList(
        searchTerm = ""
    ) {

        conversationList.innerHTML =
            "";


        const term =
            String(searchTerm)
                .toLowerCase()
                .trim();


        const filtered =
            conversations.filter(
                function (conversation) {

                    if (!term) {

                        return true;

                    }


                    const title =
                        String(
                            conversation.title ||
                            ""
                        )
                        .toLowerCase();


                    const firstMessage =
                        conversation.messages &&
                        conversation.messages.length
                            ? String(
                                conversation
                                    .messages[0]
                                    .content ||
                                ""
                            ).toLowerCase()
                            : "";


                    return (
                        title.includes(term) ||
                        firstMessage.includes(term)
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


        filtered.forEach(
            function (conversation) {

                const item =
                    createConversationItem(
                        conversation
                    );

                conversationList.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       CREATE CONVERSATION ITEM
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


        item.dataset.id =
            conversation.id;


        const main =
            document.createElement(
                "button"
            );

        main.type = "button";

        main.className =
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


        main.appendChild(icon);

        main.appendChild(title);


        main.addEventListener(
            "click",
            function () {

                openConversation(
                    conversation.id
                );

            }
        );


        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.type = "button";

        deleteButton.className =
            "conversationDeleteButton";

        deleteButton.textContent =
            "⋯";

        deleteButton.setAttribute(
            "aria-label",
            "Conversation options"
        );


        deleteButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                deleteConversation(
                    conversation.id
                );

            }
        );


        item.appendChild(main);

        item.appendChild(
            deleteButton
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

            return;

        }


        /*
         * Clear visible chat
         */

        chatBox.innerHTML =
            "";


        /*
         * Restore messages
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
         * Restore AI conversation history
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
                                message.timestamp ||
                                Date.now()

                        };

                    }
                );

        }


        /*
         * Close menu
         */

        closeSideMenu();


        /*
         * Scroll down
         */

        setTimeout(
            function () {

                if (
                    typeof window.scrollChatToBottom ===
                    "function"
                ) {

                    window.scrollChatToBottom();

                }

                else {

                    chatBox.scrollTop =
                        chatBox.scrollHeight;

                }

            },
            50
        );


        console.log(
            "📂 Conversation opened:",
            conversation.title
        );

    }


    /* =====================================================
       ADD MESSAGE TO CHAT
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
         * Use existing formatter for AI
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


        /*
         * Let chatActions add Copy +
         * Regenerate to AI messages.
         */

        if (
            role === "assistant" &&
            window.chatActions &&
            typeof window.chatActions.enhanceMessage ===
            "function"
        ) {

            window.chatActions.enhanceMessage(
                message
            );

        }

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
       DELETE CONVERSATION
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


        saveConversations();

        renderConversationList();


        console.log(
            "🗑️ Conversation deleted"
        );

    }


    /* =====================================================
       NEW CHAT
    ===================================================== */

    function startNewChat() {

        /*
         * Save current conversation first
         */

        saveCurrentConversation();


        /*
         * Clear visible chat
         */

        chatBox.innerHTML =
            "";


        /*
         * Clear AI history
         */

        if (
            typeof window.clearConversationHistory ===
            "function"
        ) {

            window.clearConversationHistory();

        }

        else if (
            Array.isArray(
                window.conversationHistory
            )
        ) {

            window.conversationHistory =
                [];

        }


        /*
         * Clear input
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
         * Add welcome message
         */

        addMessageToChat(
            "assistant",
            "👋 Hello Samuel!\n\nHow can I help you today?",
            new Date().toISOString()
        );


        /*
         * Close menu
         */

        closeSideMenu();


        console.log(
            "🆕 New chat started"
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


        saveConversations();

        renderConversationList();


        console.log(
            "🗑️ All conversations cleared"
        );

    }


    /* =====================================================
       CLOSE SIDE MENU
    ===================================================== */

    function closeSideMenu() {

        const menu =
            document.getElementById(
                "sideMenu"
            );

        const overlay =
            document.getElementById(
                "sideMenuOverlay"
            );


        if (menu) {

            menu.classList.remove(
                "open"
            );

        }


        if (overlay) {

            overlay.classList.remove(
                "open"
            );

        }


        document.body.style.overflow =
            "";

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
       LOAD
    ===================================================== */

    loadConversations();

    renderConversationList();


    /* =====================================================
       AUTO-SAVE
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            saveCurrentConversation();

        }
    );


    /* =====================================================
       GLOBAL API
    ===================================================== */

    window.conversationManager = {

        saveCurrentConversation:
            saveCurrentConversation,

        loadConversations:
            loadConversations,

        renderConversationList:
            renderConversationList,

        openConversation:
            openConversation,

        startNewChat:
            startNewChat,

        deleteConversation:
            deleteConversation,

        clearAllConversations:
            clearAllConversations

    };


    console.log(
        "✅ Conversation Manager ready"
    );

})();
