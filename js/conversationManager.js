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


            /*
             * Make sure old conversations that were
             * created before branching existed remain
             * compatible.
             */

            conversations.forEach(
                function (conversation) {

                    if (
                        !Array.isArray(
                            conversation.branches
                        )
                    ) {

                        conversation.branches =
                            [];

                    }

                }
            );

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


    function createBranchId() {

        return (
            "branch_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );

    }


    /* =====================================================
       SMART TITLE
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
                    title.substring(
                        0,
                        lastSpace
                    ).trim();

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


            const MAX_WIDTH = 1280;
            const MAX_HEIGHT = 1280;


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
       MESSAGE COMPARISON
    ===================================================== */

    function messagesMatch(
        first,
        second
    ) {

        if (
            !first ||
            !second
        ) {

            return false;

        }


        return (
            first.role ===
            second.role &&
            String(
                first.content || ""
            ).trim() ===
            String(
                second.content || ""
            ).trim()
        );

    }


    function isStrictPrefix(
        shorter,
        longer
    ) {

        if (
            !Array.isArray(shorter) ||
            !Array.isArray(longer)
        ) {

            return false;

        }


        if (
            shorter.length >=
            longer.length
        ) {

            return false;

        }


        for (
            let i = 0;
            i < shorter.length;
            i++
        ) {

            if (
                !messagesMatch(
                    shorter[i],
                    longer[i]
                )
            ) {

                return false;

            }

        }


        return true;

    }


    /* =====================================================
       PRESERVE EDITED BRANCH
    ===================================================== */

    function preserveConversationBranch(
        conversation,
        currentMessages
    ) {

        if (
            !conversation ||
            !Array.isArray(
                conversation.messages
            ) ||
            !Array.isArray(
                currentMessages
            )
        ) {

            return false;

        }


        /*
         * If the current visible conversation is a
         * strict prefix of the previously saved
         * conversation, something was removed from
         * the end.
         *
         * Our Edit feature intentionally does exactly
         * this when creating a new branch.
         */

        if (
            !isStrictPrefix(
                currentMessages,
                conversation.messages
            )
        ) {

            return false;

        }


        const previousMessages =
            conversation.messages.map(
                function (message) {

                    return {

                        role:
                            message.role,

                        content:
                            message.content,

                        timestamp:
                            message.timestamp ||
                            null

                    };

                }
            );


        if (!previousMessages.length) {
            return false;
        }


        if (
            !Array.isArray(
                conversation.branches
            )
        ) {

            conversation.branches =
                [];

        }


        /*
         * Prevent duplicate branch snapshots.
         */

        const alreadySaved =
            conversation.branches.some(
                function (branch) {

                    if (
                        !Array.isArray(
                            branch.messages
                        )
                    ) {

                        return false;

                    }


                    if (
                        branch.messages.length !==
                        previousMessages.length
                    ) {

                        return false;

                    }


                    return (
                        branch.messages.every(
                            function (
                                message,
                                index
                            ) {

                                return messagesMatch(
                                    message,
                                    previousMessages[index]
                                );

                            }
                        )
                    );

                }
            );


        if (alreadySaved) {

            return false;

        }


        conversation.branches.push({

            id:
                createBranchId(),

            createdAt:
                new Date().toISOString(),

            messages:
                previousMessages

        });


        /*
         * Keep branch storage controlled.
         *
         * Five previous branches per conversation
         * is enough for now and prevents localStorage
         * from growing forever.
         */

        const MAX_BRANCHES = 5;


        if (
            conversation.branches.length >
            MAX_BRANCHES
        ) {

            conversation.branches =
                conversation.branches.slice(
                    -MAX_BRANCHES
                );

        }


        console.log(
            "🌿 Previous conversation branch preserved"
        );


        return true;

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


        const newChatDraft =
            localStorage.getItem(
                NEW_DRAFT_KEY
            );


        let conversation =
            getCurrentConversation();


        /*
         * =================================================
         * PHASE 9C.10 BRANCH DETECTION
         * =================================================
         *
         * Before replacing the saved messages, check
         * whether the visible conversation became a
         * shorter version of the saved conversation.
         */

        if (conversation) {

            if (
                preserveConversationBranch(
                    conversation,
                    messages
                )
            ) {

                console.log(
                    "🌿 Edit detected — old branch preserved"
                );

            }

        }


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
                    visionContext,

                branches:
                    []

            };


            conversations.unshift(
                conversation
            );


            setCurrentConversationId(
                id
            );


            if (newChatDraft) {

                try {

                    localStorage.setItem(
                        getDraftKey(id),
                        newChatDraft
                    );

                    localStorage.removeItem(
                        NEW_DRAFT_KEY
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
                !Array.isArray(
                    conversation.branches
                )
            ) {

                conversation.branches =
                    [];

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
                    conversation.title || ""
                ).toLowerCase();

            const messages =
                Array.isArray(
                    conversation.messages
                )
                    ? conversation.messages
                    : [];

            const messageText =
                messages
                    .map(
                        function (message) {

                            return String(
                                message.content || ""
                            );

                        }
                    )
                    .join(" ")
                    .toLowerCase();

            return (
                title.includes(term) ||
                messageText.includes(term)
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

        else {

            window.activeVisionContext =
                null;

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


        restoreComposerDraft(
            conversation.id
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

    console.log("🆕 Starting new chat...");

    /* =================================================
       SAVE CURRENT CHAT FIRST
    ================================================= */

    try {

        await saveCurrentConversation();

    } catch (error) {

        console.warn(
            "⚠️ Could not save previous conversation:",
            error
        );
    }


    /* =================================================
       CREATE A NEW CONVERSATION IMMEDIATELY
    ================================================= */

    const newConversationId =
        createConversationId();

    const now =
        Date.now();

    const newConversation = {

        id: newConversationId,

        title: "New Chat",

        messages: [],

        createdAt: now,

        updatedAt: now,

        hasImage: false,

        visionContext: null
    };


    /* =================================================
       ADD NEW CHAT TO CONVERSATION LIST
    ================================================= */

    conversations.unshift(
        newConversation
    );


    /* =================================================
       SET IT AS CURRENT CHAT
    ================================================= */

    currentConversationId =
        newConversationId;

    localStorage.setItem(
        CURRENT_CHAT_KEY,
        currentConversationId
    );


    /* =================================================
       SAVE CONVERSATIONS
    ================================================= */

    saveConversations();


    /* =================================================
       CLEAR AI CONTEXT
    ================================================= */

    window.conversationHistory = [];

    window.activeVisionContext = null;


    if (
        typeof window.clearActiveVisionContext ===
        "function"
    ) {

        try {

            window.clearActiveVisionContext();

        } catch (error) {

            console.warn(
                "⚠️ Could not clear vision context:",
                error
            );
        }
    }


    /* =================================================
       CLEAR CHAT WINDOW
    ================================================= */

    if (chatBox) {

        chatBox.innerHTML = "";
    }


    /* =================================================
       RESTORE WELCOME MESSAGE
    ================================================= */

    if (
        typeof window.addWelcomeMessage ===
        "function"
    ) {

        window.addWelcomeMessage();

    } else if (chatBox) {

        const welcome =
            document.createElement("div");

        welcome.className =
            "message ai";

        const welcomeText =
            document.createElement("div");

        welcomeText.className =
            "messageText";

        welcomeText.textContent =
            "How can I help you today?";

        welcome.appendChild(
            welcomeText
        );

        chatBox.appendChild(
            welcome
        );
    }


    /* =================================================
       CLEAR COMPOSER
    ================================================= */

    if (
        typeof clearComposerDraft ===
        "function"
    ) {

        clearComposerDraft();
    }


    /* =================================================
       CLOSE SIDE MENU
    ================================================= */

    const sideMenu =
        document.getElementById(
            "sideMenu"
        );

    if (sideMenu) {

        sideMenu.classList.remove(
            "open"
        );
    }


    /* =================================================
       REFRESH CONVERSATION LIST
    ================================================= */

    renderConversationList();


    /* =================================================
       SCROLL
    ================================================= */

    if (chatBox) {

        chatBox.scrollTop =
            chatBox.scrollHeight;
    }


    console.log(
        "✅ New conversation created:",
        newConversationId
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


    /* =================================================
       PIN / UNPIN
    ================================================= */

    const pinButton =
        document.createElement(
            "button"
        );


    pinButton.type =
        "button";


    pinButton.className =
        "conversationOptionButton pinConversationOption";


    const isPinned =
        conversation.pinned === true;


    pinButton.innerHTML =
        isPinned
            ? "📌 <span>Unpin</span>"
            : "📌 <span>Pin</span>";


    pinButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            /*
             * Toggle pinned state
             */

            conversation.pinned =
                !conversation.pinned;


            /*
             * Save immediately
             */

            saveConversations();


            /*
             * Close menu
             */

            menu.remove();


            /*
             * Refresh conversation list
             */

            renderConversationList(
                searchInput
                    ? searchInput.value
                    : ""
            );


            console.log(
                conversation.pinned
                    ? "📌 Conversation pinned"
                    : "📌 Conversation unpinned"
            );

        }
    );


    /* =================================================
       RENAME
    ================================================= */

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


    /* =================================================
       DELETE
    ================================================= */

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


    /* =================================================
       ADD OPTIONS
    ================================================= */

    menu.appendChild(
        pinButton
    );


    menu.appendChild(
        renameButton
    );


    menu.appendChild(
        deleteButton
    );


    /* =================================================
       SHOW MENU
    ================================================= */

    conversationItem.appendChild(
        menu
    );


    /* =================================================
       CLOSE WHEN CLICKING OUTSIDE
    ================================================= */

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
       AUTO SAVE
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
       DRAFT SAVING
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

    renderConversationList();


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
            clearComposerDraft,

        /*
         * New Phase 9C.10 API
         */
        preserveConversationBranch:
            preserveConversationBranch

    };


    console.log(
        "✅ Conversation Manager ready — Phase 9C.10 Branching"
    );

})();
