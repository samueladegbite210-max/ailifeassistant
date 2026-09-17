"use strict";

console.log("🚀 Phase 9C.9 chat actions loading...");

(function () {

    const chatBox =
        document.getElementById("chatBox");

    if (!chatBox) {
        console.error("❌ chatBox not found");
        return;
    }


    /* =====================================================
       COPY TEXT
    ===================================================== */

    async function copyText(text) {

        if (!text) return false;

        try {

            if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText === "function"
            ) {

                await navigator.clipboard.writeText(text);

                return true;
            }

        }

        catch (error) {

            console.warn(
                "⚠️ Clipboard API failed:",
                error
            );

        }


        try {

            const textarea =
                document.createElement("textarea");

            textarea.value = text;

            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            textarea.style.top = "0";
            textarea.style.opacity = "0";

            document.body.appendChild(
                textarea
            );

            textarea.focus();
            textarea.select();

            const success =
                document.execCommand("copy");

            textarea.remove();

            return success;

        }

        catch (error) {

            console.error(
                "❌ Copy failed:",
                error
            );

            return false;

        }

    }


    /* =====================================================
       GET MESSAGE TEXT
    ===================================================== */

    function getMessageText(
        messageElement
    ) {

        if (!messageElement) {
            return "";
        }

        const messageText =
            messageElement.querySelector(
                ".messageText"
            );

        if (!messageText) {
            return "";
        }

        return (
            messageText.innerText ||
            messageText.textContent ||
            ""
        )
        .replace(/\u00a0/g, " ")
        .trim();

    }


    /* =====================================================
       FIND PREVIOUS USER MESSAGE
    ===================================================== */

    function getPreviousUserMessage(
        aiMessage
    ) {

        if (!aiMessage) {
            return null;
        }

        let node =
            aiMessage.previousElementSibling;

        while (node) {

            if (
                node.classList &&
                node.classList.contains("message") &&
                node.classList.contains("user")
            ) {

                return node;

            }

            node =
                node.previousElementSibling;

        }

        return null;

    }


    /* =====================================================
       GET LATEST AI MESSAGE
    ===================================================== */

    function getLatestAIMessage() {

        const messages =
            chatBox.querySelectorAll(
                ".message.ai"
            );

        if (!messages.length) {
            return null;
        }

        return messages[
            messages.length - 1
        ];

    }


    /* =====================================================
       IS LATEST AI MESSAGE?
    ===================================================== */

    function isLatestAIMessage(
        messageElement
    ) {

        return (
            getLatestAIMessage() ===
            messageElement
        );

    }


    /* =====================================================
       COPY BUTTON
    ===================================================== */

    function createCopyButton(
        messageElement
    ) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "messageActionButton";

        button.textContent =
            "📋 Copy";

        button.setAttribute(
            "aria-label",
            "Copy AI response"
        );


        button.addEventListener(
            "click",
            async function () {

                const text =
                    getMessageText(
                        messageElement
                    );

                if (!text) {
                    return;
                }

                const originalText =
                    button.textContent;

                button.disabled = true;

                const success =
                    await copyText(text);


                if (success) {

                    button.textContent =
                        "✓ Copied";

                    setTimeout(
                        function () {

                            button.textContent =
                                originalText;

                            button.disabled =
                                false;

                        },
                        1500
                    );

                }

                else {

                    button.textContent =
                        "❌ Failed";

                    setTimeout(
                        function () {

                            button.textContent =
                                originalText;

                            button.disabled =
                                false;

                        },
                        1500
                    );

                }

            }
        );


        return button;

    }


    /* =====================================================
       REGENERATE BUTTON
    ===================================================== */

    function createRegenerateButton(
        messageElement
    ) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "messageActionButton";

        button.textContent =
            "🔄 Regenerate";

        button.setAttribute(
            "aria-label",
            "Regenerate AI response"
        );


        button.addEventListener(
            "click",
            async function () {

                await regenerateResponse(
                    messageElement,
                    button
                );

            }
        );


        return button;

    }


    /* =====================================================
       REGENERATE RESPONSE
    ===================================================== */

    async function regenerateResponse(
        aiMessage,
        button
    ) {

        if (
            !isLatestAIMessage(
                aiMessage
            )
        ) {

            alert(
                "Regenerate is available for the latest AI response."
            );

            return;

        }


        const userMessage =
            getPreviousUserMessage(
                aiMessage
            );

        if (!userMessage) {

            alert(
                "I couldn't find the user message for this response."
            );

            return;

        }


        const userText =
            getMessageText(
                userMessage
            );

        if (!userText) {

            alert(
                "I couldn't recover the original question."
            );

            return;

        }


        if (
            typeof window.smartAIReply !==
            "function"
        ) {

            alert(
                "AI system is not ready yet."
            );

            return;

        }


        console.log(
            "🔄 Regenerating response for:",
            userText
        );


        const originalResponse =
            getMessageText(
                aiMessage
            );


        const originalButtonText =
            button.textContent;

        button.disabled = true;

        button.textContent =
            "⏳ Regenerating...";


        const history =
            window.conversationHistory;

        let removedUser =
            null;

        let removedAssistant =
            null;


        if (
            Array.isArray(history) &&
            history.length >= 2
        ) {

            const last =
                history[
                    history.length - 1
                ];

            const secondLast =
                history[
                    history.length - 2
                ];


            const lastIsAssistant =
                last &&
                last.role === "assistant";


            const previousIsUser =
                secondLast &&
                secondLast.role === "user";


            const sameQuestion =
                previousIsUser &&
                String(
                    secondLast.content || ""
                ).trim() ===
                userText.trim();


            if (
                lastIsAssistant &&
                previousIsUser &&
                sameQuestion
            ) {

                removedAssistant =
                    history.pop();

                removedUser =
                    history.pop();

            }

        }


        const messageText =
            aiMessage.querySelector(
                ".messageText"
            );

        if (messageText) {

            messageText.innerHTML =
                "🧠 <em>Regenerating...</em>";

        }


        try {

            const newResponse =
                await window.askOnlineAI(
                    userText,
                    null,
                    true,
                    true
                );


            if (
                !newResponse ||
                !String(
                    newResponse
                ).trim()
            ) {

                throw new Error(
                    "AI returned an empty response."
                );

            }


            if (
                messageText &&
                typeof window.formatAIResponse ===
                "function"
            ) {

                const formatted =
                    window.formatAIResponse(
                        String(newResponse)
                    );

                messageText.innerHTML = "";

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

            else if (messageText) {

                messageText.textContent =
                    String(newResponse);

            }


            button.textContent =
                "✓ Regenerated";


            setTimeout(
                function () {

                    button.textContent =
                        originalButtonText;

                    button.disabled =
                        false;

                },
                1500
            );


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

        }

        catch (error) {

            console.error(
                "❌ Regenerate failed:",
                error
            );


            if (messageText) {

                if (
                    typeof window.formatAIResponse ===
                    "function"
                ) {

                    const restored =
                        window.formatAIResponse(
                            originalResponse
                        );

                    messageText.innerHTML = "";

                    if (
                        restored instanceof
                        DocumentFragment
                    ) {

                        messageText.appendChild(
                            restored
                        );

                    }

                    else if (
                        restored instanceof Node
                    ) {

                        messageText.appendChild(
                            restored
                        );

                    }

                    else {

                        messageText.innerHTML =
                            String(restored);

                    }

                }

                else {

                    messageText.textContent =
                        originalResponse;

                }

            }


            if (
                Array.isArray(
                    window.conversationHistory
                )
            ) {

                if (removedUser) {

                    window.conversationHistory.push(
                        removedUser
                    );

                }

                if (removedAssistant) {

                    window.conversationHistory.push(
                        removedAssistant
                    );

                }

            }


            button.textContent =
                "🔄 Regenerate";

            button.disabled =
                false;


            alert(
                "I couldn't regenerate the response. Please try again."
            );

        }

    }


    /* =====================================================
       FIND CHAT COMPOSER
    ===================================================== */

    function getChatComposer() {

        const selectors = [
            "#messageInput",
            "#userInput",
            "#chatInput",
            "#promptInput",
            "textarea[name='message']",
            "textarea"
        ];

        for (
            let i = 0;
            i < selectors.length;
            i++
        ) {

            const element =
                document.querySelector(
                    selectors[i]
                );

            if (element) {
                return element;
            }

        }

        return null;

    }


    /* =====================================================
       EDIT MESSAGE
    ===================================================== */

    async function editMessage(
        userMessage
    ) {

        if (!userMessage) {
            return;
        }


        const originalText =
            getMessageText(
                userMessage
            );

        if (!originalText) {

            alert(
                "I couldn't recover this message."
            );

            return;

        }


        console.log(
            "✏️ Editing message:",
            originalText
        );


        const composer =
            getChatComposer();


        /*
         * Put the message into the existing composer.
         */
        if (composer) {

            composer.value =
                originalText;

            composer.dispatchEvent(
                new Event(
                    "input",
                    {
                        bubbles: true
                    }
                )
            );

            composer.focus();

        }

        else {

            /*
             * Safe fallback if the composer ID
             * is different.
             */
            const editedText =
                window.prompt(
                    "Edit your message:",
                    originalText
                );

            if (
                editedText === null ||
                !editedText.trim()
            ) {

                return;

            }

            const fallbackComposer =
                getChatComposer();

            if (fallbackComposer) {

                fallbackComposer.value =
                    editedText.trim();

            }

        }


        /*
         * Find this user message's position
         * among visible user messages.
         */
        const userMessages =
            Array.from(
                chatBox.querySelectorAll(
                    ".message.user"
                )
            );

        const visibleIndex =
            userMessages.indexOf(
                userMessage
            );


        if (visibleIndex === -1) {

            console.warn(
                "⚠️ Could not determine message position."
            );

            return;

        }


        /*
         * Remove this message and everything
         * after it from the visible chat.
         */
        const allMessages =
            Array.from(
                chatBox.querySelectorAll(
                    ".message"
                )
            );


        const messagePosition =
            allMessages.indexOf(
                userMessage
            );


        if (messagePosition !== -1) {

            for (
                let i =
                    allMessages.length - 1;
                i >= messagePosition;
                i--
            ) {

                const node =
                    allMessages[i];

                if (
                    node &&
                    node.parentNode
                ) {

                    node.parentNode.removeChild(
                        node
                    );

                }

            }

        }


        /*
         * Remove the edited message and every
         * later conversation entry from memory.
         */
        if (
            Array.isArray(
                window.conversationHistory
            )
        ) {

            let userCount = 0;

            let historyIndex = -1;


            for (
                let i = 0;
                i <
                window.conversationHistory.length;
                i++
            ) {

                const item =
                    window.conversationHistory[i];

                if (
                    !item ||
                    item.role !== "user"
                ) {

                    continue;

                }


                if (
                    userCount === visibleIndex
                ) {

                    historyIndex = i;

                    break;

                }


                userCount++;

            }


            if (historyIndex !== -1) {

                window.conversationHistory =
                    window.conversationHistory.slice(
                        0,
                        historyIndex
                    );

                console.log(
                    "🧹 Conversation history branched from edited message"
                );

            }

        }


        /*
         * Focus composer and let the user
         * review/edit before sending.
         */
        if (composer) {

            composer.focus();

            try {

                const length =
                    composer.value.length;

                composer.setSelectionRange(
                    length,
                    length
                );

            }

            catch (error) {
                console.warn(
                    "⚠️ Could not position cursor:",
                    error
                );
            }

        }


        console.log(
            "✏️ Message loaded into composer."
        );

    }


    /* =====================================================
       CREATE EDIT BUTTON
    ===================================================== */

    function createEditButton(
        messageElement
    ) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "messageActionButton";

        button.textContent =
            "✏️ Edit";

        button.setAttribute(
            "aria-label",
            "Edit message"
        );


        button.addEventListener(
            "click",
            async function () {

                button.disabled = true;

                try {

                    await editMessage(
                        messageElement
                    );

                }

                finally {

                    button.disabled =
                        false;

                }

            }
        );


        return button;

    }


    /* =====================================================
       CREATE AI ACTION BAR
    ===================================================== */

    function createAIActionBar(
        messageElement
    ) {

        if (!messageElement) {
            return;
        }


        if (
            messageElement.dataset &&
            messageElement.dataset.actionsAdded ===
            "true"
        ) {

            return;

        }


        const messageText =
            messageElement.querySelector(
                ".messageText"
            );

        if (!messageText) {
            return;
        }


        const actions =
            document.createElement("div");

        actions.className =
            "messageActions";


        const copyButton =
            createCopyButton(
                messageElement
            );

        actions.appendChild(
            copyButton
        );


        const regenerateButton =
            createRegenerateButton(
                messageElement
            );

        actions.appendChild(
            regenerateButton
        );


        messageElement.appendChild(
            actions
        );


        messageElement.dataset.actionsAdded =
            "true";

    }


    /* =====================================================
       CREATE USER ACTION BAR
    ===================================================== */

    function createUserActionBar(
        messageElement
    ) {

        if (!messageElement) {
            return;
        }


        if (
            messageElement.dataset &&
            messageElement.dataset.actionsAdded ===
            "true"
        ) {

            return;

        }


        const messageText =
            messageElement.querySelector(
                ".messageText"
            );

        if (!messageText) {
            return;
        }


        const actions =
            document.createElement("div");

        actions.className =
            "messageActions";


        const editButton =
            createEditButton(
                messageElement
            );

        actions.appendChild(
            editButton
        );


        messageElement.appendChild(
            actions
        );


        messageElement.dataset.actionsAdded =
            "true";

    }


    /* =====================================================
       ENHANCE MESSAGE
    ===================================================== */

    function enhanceMessage(
        messageElement
    ) {

        if (!messageElement) {
            return;
        }


        if (
            messageElement.classList.contains(
                "ai"
            )
        ) {

            createAIActionBar(
                messageElement
            );

        }


        if (
            messageElement.classList.contains(
                "user"
            )
        ) {

            createUserActionBar(
                messageElement
            );

        }

    }


    /* =====================================================
       EXISTING MESSAGES
    ===================================================== */

    chatBox
        .querySelectorAll(
            ".message.ai, .message.user"
        )
        .forEach(
            enhanceMessage
        );


    /* =====================================================
       WATCH FOR NEW MESSAGES
    ===================================================== */

    const observer =
        new MutationObserver(
            function (mutations) {

                mutations.forEach(
                    function (mutation) {

                        mutation.addedNodes
                            .forEach(
                                function (node) {

                                    if (
                                        node.nodeType !==
                                        Node.ELEMENT_NODE
                                    ) {

                                        return;

                                    }


                                    if (
                                        node.classList &&
                                        node.classList.contains(
                                            "message"
                                        )
                                    ) {

                                        enhanceMessage(
                                            node
                                        );

                                    }


                                    if (
                                        node.querySelectorAll
                                    ) {

                                        node
                                            .querySelectorAll(
                                                ".message.ai, .message.user"
                                            )
                                            .forEach(
                                                enhanceMessage
                                            );

                                    }

                                }
                            );

                    }
                );

            }
        );


    observer.observe(
        chatBox,
        {
            childList: true,
            subtree: true
        }
    );


    /* =====================================================
       GLOBAL API
    ===================================================== */

    window.chatActions = {

        copyText:
            copyText,

        enhanceMessage:
            enhanceMessage,

        regenerateResponse:
            regenerateResponse,

        editMessage:
            editMessage

    };


    console.log(
        "✅ Phase 9C.9 Copy + Regenerate + Edit ready"
    );

})();
