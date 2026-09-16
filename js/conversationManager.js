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

    const DRAFT_PREFIX =
        "aiLifeAssistantDraft_";

    const NEW_DRAFT_KEY =
        DRAFT_PREFIX + "new";

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

            if (
                error &&
                error.name ===
                "QuotaExceededError"
            ) {

                console.warn(
                    "⚠️ Conversation storage is full."
                );

            }

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
       COMPOSER DRAFT
    ===================================================== */

    function getDraftKey(
        conversationId = currentConversationId
    ) {

        if (conversationId) {

            return (
                DRAFT_PREFIX +
                conversationId
            );

        }

        /*
         * Brand-new chat has no ID yet.
         */

        return NEW_DRAFT_KEY;

    }


    function saveComposerDraft() {

        const input =
            document.getElementById(
                "userInput"
            );

        if (!input) {

            return;

        }


        const key =
            getDraftKey();


        try {

            const value =
                input.value || "";


            if (value.trim()) {

                localStorage.setItem(
                    key,
                    value
                );

                console.log(
                    "📝 Draft saved:",
                    key
                );

            }

            else {

                localStorage.removeItem(
                    key
                );

            }

        }

        catch (error) {

            console.warn(
                "⚠️ Could not save composer draft:",
                error
            );

        }

    }


    function restoreComposerDraft(
        conversationId = currentConversationId
    ) {

        const input =
            document.getElementById(
                "userInput"
            );

        if (!input) {

            return;

        }


        const key =
            getDraftKey(
                conversationId
            );


        try {

            const draft =
                localStorage.getItem(
                    key
                );


            if (draft) {

                input.value =
                    draft;


                input.dispatchEvent(
                    new Event(
                        "input",
                        {
                            bubbles: true
                        }
                    )
                );


                console.log(
                    "📝 Composer draft restored:",
                    key
                );

            }

        }

        catch (error) {

            console.warn(
                "⚠️ Could not restore composer draft:",
                error
            );

        }

    }


    function clearComposerDraft(
        conversationId = currentConversationId
    ) {

        try {

            const key =
                getDraftKey(
                    conversationId
                );


            if (key) {

                localStorage.removeItem(
                    key
                );

            }

        }

        catch (error) {

            console.warn(
                "⚠️ Could not clear composer draft:",
                error
            );

        }

    }


    function migrateNewChatDraft(
        conversationId
    ) {

        if (!conversationId) {

            return;

        }


        try {

            const draft =
                localStorage.getItem(
                    NEW_DRAFT_KEY
                );


            if (!draft) {

                return;

            }


            localStorage.setItem(
                getDraftKey(
                    conversationId
                ),
                draft
            );


            localStorage.removeItem(
                NEW_DRAFT_KEY
            );


            console.log(
                "📝 New-chat draft migrated:",
                conversationId
            );

        }

        catch (error) {

            console.warn(
                "⚠️ Could not migrate composer draft:",
                error
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
       SMART CONVERSATION TITLE
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


        title =
            title.replace(
                /^(please\s+)?(can\s+you|could\s+you|would\s+you)\s+/i,
                ""
            );


        title =
            title.replace(
                /^(please\s+)?(help\s+me)\s+(with\s+)?/i,
                "Help me "
            );


        title =
            title.replace(
                /^i\s+want\s+you\s+to\s+/i,
                ""
            );


        title =
            title.replace(
                /^i\s+need\s+you\s+to\s+/i,
                ""
            );


        title =
            title.replace(
                /^i\s+would\s+like\s+you\s+to\s+/i,
                ""
            );


        title =
            title.trim();


        if (!title) {

            title =
                String(text)
                    .replace(/\s+/g, " ")
                    .trim();

        }


        const sentenceMatch =
            title.match(
                /^(.+?[.!?])(?:\s|$)/
            );


        if (
            sentenceMatch &&
            sentenceMatch[1]
        ) {

            title =
                sentenceMatch[1].trim();

        }


        title =
            title
                .replace(/\s+/g, " ")
                .trim();


        const MAX_TITLE_LENGTH = 55;


        if (
            title.length >
            MAX_TITLE_LENGTH
        ) {

            title =
                title
                    .substring(
                        0,
                        MAX_TITLE_LENGTH
                    )
                    .trim();


            const lastSpace =
                title.lastIndexOf(" ");


            if (
                lastSpace > 25
            ) {

                title =
                    title
                        .substring(
                            0,
                            lastSpace
                        )
                        .trim();

            }


            title += "…";

        }


        return (
            title ||
            "New Chat"
        );

    }


    /* =====================================================
       IMAGE STORAGE
    ===================================================== */

    async function compressImageForStorage(
        imageSource
    ) {

        if (!imageSource) {

            return null;

        }


        try {

            let blob = null;


            if (
                imageSource instanceof Blob
            ) {

                blob =
                    imageSource;

            }

            else if (
                typeof imageSource ===
                "string" &&
                imageSource.startsWith(
                    "data:image/"
                )
            ) {

                const response =
                    await fetch(
                        imageSource
                    );

                blob =
                    await response.blob();

            }


            if (!blob) {

                return null;

            }


            const objectURL =
                URL.createObjectURL(
                    blob
                );


            const image =
                new Image();


            const loaded =
                new Promise(
                    function (
                        resolve,
                        reject
                    ) {

                        image.onload =
                            resolve;

                        image.onerror =
                            reject;

                    }
                );


            image.src =
                objectURL;


            await loaded;


            const MAX_WIDTH =
                1280;

            const MAX_HEIGHT =
                1280;


            let width =
                image.naturalWidth ||
                image.width;

            let height =
                image.naturalHeight ||
                image.height;


            if (
                !width ||
                !height
            ) {

                URL.revokeObjectURL(
                    objectURL
                );

                return null;

            }


            const scale =
                Math.min(
                    1,
                    MAX_WIDTH / width,
                    MAX_HEIGHT / height
                );


            width =
                Math.round(
                    width * scale
                );

            height =
                Math.round(
                    height * scale
                );


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                width;

            canvas.height =
                height;


            const context =
                canvas.getContext(
                    "2d"
                );


            if (!context) {

                URL.revokeObjectURL(
                    objectURL
                );

                return null;

            }


            context.drawImage(
                image,
                0,
                0,
                width,
                height
            );


            const compressedData =
                canvas.toDataURL(
                    "image/jpeg",
                    0.75
                );


            URL.revokeObjectURL(
                objectURL
            );


            return compressedData;

        }

        catch (error) {

            console.error(
                "❌ Failed to compress image:",
                error
            );

            return null;

        }

    }


    async function getVisionContextForStorage() {

        try {

            if (
                typeof window.getActiveVisionContext !==
                "function"
            ) {

                if (
                    window.activeVisionContext &&
                    window.activeVisionContext.image
                ) {

                    return {

                        image:
                            window.activeVisionContext.image,

                        name:
                            window.activeVisionContext.name ||
                            "conversation-image.jpg",

                        mimeType:
                            window.activeVisionContext.mimeType ||
                            "image/jpeg",

                        createdAt:
                            window.activeVisionContext.createdAt ||
                            Date.now()

                    };

                }

                return null;

            }


            const activeContext =
                window.getActiveVisionContext();


            if (
                !activeContext ||
                !activeContext.image
            ) {

                return null;

            }


            const imageData =
                await compressImageForStorage(
                    activeContext.image
                );


            if (!imageData) {

                console.warn(
                    "⚠️ Image could not be stored."
                );

                return null;

            }


            return {

                image:
                    imageData,

                name:
                    activeContext.name ||
                    "conversation-image.jpg",

                mimeType:
                    "image/jpeg",

                createdAt:
                    Date.now()

            };

        }

        catch (error) {

            console.error(
                "❌ Failed to get vision context:",
                error
            );

            return null;

        }

    }


    function restoreVisionContext(
        visionContext
    ) {

        if (
            !visionContext ||
            !visionContext.image
        ) {

            return false;

        }


        try {

            window.activeVisionContext = {

                image:
                    visionContext.image,

                name:
                    visionContext.name ||
                    "conversation-image.jpg",

                mimeType:
                    visionContext.mimeType ||
                    "image/jpeg",

                createdAt:
                    Date.now()

            };


            console.log(
                "🖼️ Saved image context restored:",
                window.activeVisionContext.name
            );


            return true;

        }

        catch (error) {

            console.error(
                "❌ Failed to restore vision context:",
                error
            );

            return false;

        }

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

                    role =
                        "user";

                }

                else if (
                    element.classList.contains(
                        "ai"
                    )
                ) {

                    role =
                        "assistant";

                }


                if (!role) {

                    return;

                }


                if (
                    role === "assistant" &&
                    content.includes(
                        "How can I help you today?"
                    )
                ) {

                    return;

                }


                messages.push({

                    role:
                        role,

                    content:
                        content,

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

    async function saveCurrentConversation() {

        const messages =
            getCurrentMessages();


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
         * Capture the new-chat draft BEFORE
         * any async operation happens.
         */

        const newChatDraft =
            localStorage.getItem(
                NEW_DRAFT_KEY
            );


        let conversation =
            getCurrentConversation();


        let visionContext = null;


        try {

            visionContext =
                await getVisionContextForStorage();

        }

        catch (error) {

            console.error(
                "❌ Vision context storage failed:",
                error
            );

        }


        /* =================================================
           CREATE NEW CONVERSATION
        ================================================= */

        if (!conversation) {

            const id =
                createConversationId();


            conversation = {

                id:
                    id,

                title:
                    createConversationTitle(
                        firstUserMessage.content
                    ),

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString(),

                messages:
                    messages,

                visionContext:
                    visionContext

            };


            conversations.unshift(
                conversation
            );


            setCurrentConversationId(
                id
            );


            /*
             * Move any unfinished draft from
             * the temporary new-chat location
             * to this conversation.
             */

            if (newChatDraft) {

                try {

                    localStorage.setItem(
                        getDraftKey(id),
                        newChatDraft
                    );

                    localStorage.removeItem(
                        NEW_DRAFT_KEY
                    );

                    console.log(
                        "📝 Draft attached to new conversation"
                    );

                }

                catch (error) {

                    console.warn(
                        "⚠️ Could not migrate draft:",
                        error
                    );

                }

            }

        }

        /* =================================================
           UPDATE EXISTING CONVERSATION
        ================================================= */

        else {

            conversation.messages =
                messages;


            conversation.updatedAt =
                new Date().toISOString();


            if (visionContext) {

                conversation.visionContext =
                    visionContext;

            }


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

    function renderConversationList(
        searchTerm = ""
    ) {

        conversationList.innerHTML =
            "";


        const term =
            String(searchTerm)
                .toLowerCase()
                .trim();


        const now =
            new Date();


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


        const filtered =
            sorted.filter(
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


                    const messages =
                        Array.isArray(
                            conversation.messages
                        )
                            ? conversation.messages
                                .map(
                                    function (
                                        message
                                    ) {

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


    /* =====================================================
       RENDER GROUP
    ===================================================== */

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


        item.dataset.id =
            conversation.id;


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


        openButton.type =
            "button";


        openButton.className =
            "conversationOpenButton";


        const icon =
            document.createElement(
                "span"
            );


        icon.className =
            "conversationIcon";


        const hasImage =
            !!(
                conversation.visionContext &&
                conversation.visionContext.image
            );


        icon.textContent =
            hasImage
                ? "🖼️"
                : "💬";


        icon.title =
            hasImage
                ? "This conversation contains an image"
                : "Text conversation";


        icon.setAttribute(
            "aria-label",
            hasImage
                ? "Image conversation"
                : "Text conversation"
        );


        const title =
            document.createElement(
                "span"
            );


        title.className =
            "conversationTitle";


        title.textContent =
            conversation.title ||
            "New Chat";


        const titleWrapper =
            document.createElement(
                "span"
            );


        titleWrapper.className =
            "conversationTitleWrapper";


        titleWrapper.appendChild(
            title
        );


        if (hasImage) {

            const imageBadge =
                document.createElement(
                    "span"
                );


            imageBadge.className =
                "conversationImageBadge";


            imageBadge.textContent =
                "Image";


            imageBadge.setAttribute(
                "aria-label",
                "Contains image"
            );


            titleWrapper.appendChild(
                imageBadge
            );

        }


        openButton.appendChild(
            icon
        );


        openButton.appendChild(
            titleWrapper
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


        optionsButton.type =
            "button";


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

                event.preventDefault();

                event.stopPropagation();


                showConversationOptions(
                    conversation,
                    item
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
         * Save whatever the user was typing
         * before switching away.
         */

        saveComposerDraft();


        setCurrentConversationId(
            conversation.id
        );


        if (
            typeof window.clearConversationHistory ===
            "function"
        ) {

            window.clearConversationHistory();

        }


        if (
            Array.isArray(
                window.conversationHistory
            )
        ) {

            window.conversationHistory =
                (
                    Array.isArray(
                        conversation.messages
                    )
                        ? conversation.messages
                        : []
                )
                .map(
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


        if (
            conversation.visionContext
        ) {

            restoreVisionContext(
                conversation.visionContext
            );

        }


        chatBox.innerHTML =
            "";


        (
            Array.isArray(
                conversation.messages
            )
                ? conversation.messages
                : []
        )
        .forEach(
            function (message) {

                addMessageToChat(
                    message.role,
                    message.content,
                    message.timestamp
                );

            }
        );


        closeSideMenu();


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


        /*
         * Restore the draft belonging to
         * THIS conversation.
         */

        restoreComposerDraft(
            conversation.id
        );


        console.log(
            "📂 Opened:",
            conversation.title
        );

    }


    /* =====================================================
       ADD SAVED MESSAGE
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
                formatted instanceof
                Node
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

    async function startNewChat() {

        /*
         * Save the unfinished text first.
         */

        saveComposerDraft();


        /*
         * Save the current conversation.
         *
         * IMPORTANT:
         * Await it so it cannot race with
         * changing currentConversationId.
         */

        await saveCurrentConversation();


        /*
         * Leave the old conversation.
         */

        setCurrentConversationId(
            null
        );


        /*
         * A new chat should start with
         * an empty composer.
         */

        clearComposerDraft(
            null
        );


        /*
         * Clear AI memory and image context.
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

            window.activeVisionContext =
                null;

        }


        /*
         * Clear visible chat.
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

            input.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );

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
        conversation,
        conversationItem
    ) {

        const existingMenu =
            document.querySelector(
                ".conversationOptionsMenu"
            );


        if (existingMenu) {

            existingMenu.remove();

        }


        const menu =
            document.createElement(
                "div"
            );


        menu.className =
            "conversationOptionsMenu";


        const renameButton =
            document.createElement(
                "button"
            );


        renameButton.type =
            "button";


        renameButton.className =
            "conversationOptionButton";


        renameButton.innerHTML =
            "✏️ <span>Rename</span>";


        renameButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                menu.remove();


                renameConversation(
                    conversation.id
                );

            }
        );


        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.type =
            "button";


        deleteButton.className =
            "conversationOptionButton deleteOption";


        deleteButton.innerHTML =
            "🗑️ <span>Delete</span>";


        deleteButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                menu.remove();


                deleteConversation(
                    conversation.id
                );

            }
        );


        menu.appendChild(
            renameButton
        );


        menu.appendChild(
            deleteButton
        );


        conversationItem.appendChild(
            menu
        );


        setTimeout(
            function () {

                function outsideClick(
                    event
                ) {

                    if (
                        !menu.contains(
                            event.target
                        ) &&
                        !conversationItem.contains(
                            event.target
                        )
                    ) {

                        menu.remove();

                        document.removeEventListener(
                            "click",
                            outsideClick
                        );

                    }

                }


                document.addEventListener(
                    "click",
                    outsideClick
                );

            },
            0
        );


        console.log(
            "✅ Conversation options opened"
        );

    }


    /* =====================================================
       RENAME
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
                    .substring(
                        0,
                        60
                    )
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
         * Remove that conversation's
         * saved draft too.
         */

        try {

            localStorage.removeItem(
                getDraftKey(
                    conversationId
                )
            );

        }

        catch (error) {

            console.warn(
                "⚠️ Could not remove conversation draft:",
                error
            );

        }


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

            else {

                window.conversationHistory =
                    [];

                window.activeVisionContext =
                    null;

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


        /*
         * Remove all conversation drafts.
         */

        try {

            Object.keys(
                localStorage
            )
            .forEach(
                function (key) {

                    if (
                        key.startsWith(
                            DRAFT_PREFIX
                        )
                    ) {

                        localStorage.removeItem(
                            key
                        );

                    }

                }
            );

        }

        catch (error) {

            console.warn(
                "⚠️ Could not clear drafts:",
                error
            );

        }


        if (
            typeof window.clearConversationHistory ===
            "function"
        ) {

            window.clearConversationHistory();

        }

        else {

            window.conversationHistory =
                [];

            window.activeVisionContext =
                null;

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
       SAVE COMPOSER DRAFT WHILE TYPING
    ===================================================== */

    const composerInput =
        document.getElementById(
            "userInput"
        );


    if (composerInput) {

        let draftTimer = null;


        composerInput.addEventListener(
            "input",
            function () {

                clearTimeout(
                    draftTimer
                );


                draftTimer =
                    setTimeout(
                        function () {

                            saveComposerDraft();

                        },
                        300
                    );

            }
        );


        /*
         * Extra protection for page refresh/
         * navigation.
         */

        window.addEventListener(
            "beforeunload",
            function () {

                saveComposerDraft();

            }
        );

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadConversations();


    /*
     * Render list immediately.
     */

    renderConversationList();


    /*
     * Restore previous active conversation.
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

            /*
             * Saved ID no longer exists.
             */

            setCurrentConversationId(
                null
            );


            /*
             * Since there is no active
             * conversation, restore any
             * unfinished new-chat draft.
             */

            setTimeout(
                function () {

                    restoreComposerDraft(
                        null
                    );

                },
                100
            );

        }

    }

    else {

        /*
         * IMPORTANT:
         *
         * This was missing before.
         *
         * If the user was typing in a brand-new
         * chat and refreshed the page, restore
         * the temporary "new" draft.
         */

        setTimeout(
            function () {

                restoreComposerDraft(
                    null
                );

            },
            100
        );

    }


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
            getCurrentConversation,

        saveComposerDraft:
            saveComposerDraft,

        restoreComposerDraft:
            restoreComposerDraft,

        clearComposerDraft:
            clearComposerDraft

    };


    console.log(
        "✅ Conversation Manager ready"
    );

})();
