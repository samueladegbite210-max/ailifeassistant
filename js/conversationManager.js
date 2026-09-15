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

            /*
             * localStorage can become full when
             * conversations contain images.
             */

            if (
                error &&
                (
                    error.name ===
                    "QuotaExceededError"
                )
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


    /*
     * Remove common unnecessary opening phrases.
     *
     * Example:
     *
     * "Please can you help me plan my day?"
     *
     * becomes:
     *
     * "Help me plan my day?"
     */

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


    /*
     * If removing the opening phrase made the
     * title empty, fall back to the original text.
     */

    if (!title) {

        title =
            String(text)
                .replace(/\s+/g, " ")
                .trim();

    }


    /*
     * Prefer the first complete sentence/question
     * when the user sends a long message.
     */

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


    /*
     * Remove accidental line breaks.
     */

    title =
        title.replace(
            /\s+/g,
            " "
        ).trim();


    /*
     * Keep conversation titles short enough
     * for the mobile side menu.
     */

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


        /*
         * Avoid ending in the middle of a word.
         */

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


    /*
     * Final fallback.
     */

    if (!title) {

        return "New Chat";

    }


    return title;

}

    /* =====================================================
       IMAGE STORAGE
    ===================================================== */

    /*
     * Images can be much larger than the amount of
     * localStorage available in a browser.
     *
     * We therefore create a smaller copy before
     * storing it with the conversation.
     */

    async function compressImageForStorage(
        imageSource
    ) {

        if (!imageSource) {

            return null;

        }


        try {

            let blob = null;


            /*
             * If the source is already a Blob,
             * use it directly.
             */

            if (
                imageSource instanceof Blob
            ) {

                blob = imageSource;

            }


            /*
             * If the source is a data URL,
             * convert it to a Blob.
             */

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


            /*
             * Maximum stored image size.
             */

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


    /*
     * Get the currently active vision image.
     */

    async function getVisionContextForStorage() {

        try {

            if (
                typeof window.getActiveVisionContext !==
                "function"
            ) {

                /*
                 * Fallback for the current global
                 * implementation.
                 */

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


            let imageData =
                activeContext.image;


            /*
             * Compress only if needed.
             */

            if (
                typeof imageData ===
                "string" &&
                imageData.startsWith(
                    "data:image/"
                )
            ) {

                /*
                 * Already a data URL.
                 * Compress it anyway so saved
                 * conversations don't become huge.
                 */

                imageData =
                    await compressImageForStorage(
                        imageData
                    );

            }

            else {

                imageData =
                    await compressImageForStorage(
                        imageData
                    );

            }


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


    /*
     * Restore saved image context into the
     * AI Life Assistant vision system.
     */

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

            /*
             * The current smartAI.js exposes the
             * active vision context globally.
             */

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


        /*
         * Get active image context.
         */

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

                /*
                 * Persistent image context.
                 */

                visionContext:
                    visionContext

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
             * Only replace the stored image
             * when an active image exists.
             *
             * This prevents a normal follow-up
             * message from accidentally deleting
             * the conversation's image context.
             */

            if (visionContext) {

                conversation.visionContext =
                    visionContext;

            }


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


        if (
            conversation.visionContext
        ) {

            console.log(
                "🖼️ Image context saved with conversation"
            );

        }


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


        /*
         * Sort newest first.
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
         * Search.
         */

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


        /*
         * Group conversations.
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
         * Render groups.
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


        /* =========================================
           OPEN CONVERSATION BUTTON
        ========================================= */

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

if (hasImage) {

    icon.title =
        "This conversation contains an image";

    icon.setAttribute(
        "aria-label",
        "Image conversation"
    );

}

else {

    icon.title =
        "Text conversation";

    icon.setAttribute(
        "aria-label",
        "Text conversation"
    );

}


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


        /* =========================================
           OPTIONS BUTTON
        ========================================= */

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


        /* =========================================
           ADD ELEMENTS
        ========================================= */

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
         * Clear current AI context.
         */

        if (
            typeof window.clearConversationHistory ===
            "function"
        ) {

            window.clearConversationHistory();

        }


        /*
         * Restore conversation history.
         */

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


        /*
         * Restore saved image context.
         */

        if (
            conversation.visionContext
        ) {

            restoreVisionContext(
                conversation.visionContext
            );

        }

        else {

            /*
             * Make sure an old image from
             * another chat cannot leak into
             * this conversation.
             */

            if (
                typeof window.clearConversationHistory ===
                "function"
            ) {

                /*
                 * clearConversationHistory already
                 * clears active vision context.
                 */

            }

        }


        /*
         * Clear visible chat.
         */

        chatBox.innerHTML =
            "";


        /*
         * Render saved messages.
         */

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


        if (
            conversation.visionContext
        ) {

            console.log(
                "🖼️ Vision context restored for conversation"
            );

        }

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

    function startNewChat() {

        /*
         * Save current conversation
         * before leaving it.
         */

        saveCurrentConversation();


        /*
         * Forget old conversation ID.
         */

        setCurrentConversationId(
            null
        );


        /*
         * Clear AI conversation memory.
         *
         * This also clears active vision
         * context in the current smartAI.js.
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


        /* =========================================
           RENAME
        ========================================= */

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


        /* =========================================
           DELETE
        ========================================= */

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


        /*
         * Close when clicking outside.
         */

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
         * open conversation, clear
         * the active AI context.
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
       INITIAL LOAD
    ===================================================== */

    loadConversations();


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
