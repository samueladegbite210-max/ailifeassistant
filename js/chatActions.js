"use strict";

console.log("🚀 Phase 9A chat actions loading...");

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


        /* ================================================
           iPHONE / FALLBACK COPY
        ================================================= */

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

        /* ================================================
           ONLY LATEST RESPONSE
        ================================================= */

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


        /* ================================================
           PREVIOUS USER MESSAGE
        ================================================= */

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


        /* ================================================
           CHECK AI SYSTEM
        ================================================= */

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


        /* ================================================
           SAVE ORIGINAL RESPONSE
        ================================================= */

        const originalResponse =
            getMessageText(
                aiMessage
            );


        const originalButtonText =
            button.textContent;

        button.disabled = true;

        button.textContent =
            "⏳ Regenerating...";


        /* ================================================
           REMOVE OLD HISTORY PAIR
        ================================================= */

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


                console.log(
                    "🧹 Removed old conversation pair before regeneration"
                );

            }

            else {

                console.warn(
                    "⚠️ Conversation history did not match the visible message."
                );

            }

        }


        /* ================================================
           SHOW THINKING STATE
        ================================================= */

        const messageText =
            aiMessage.querySelector(
                ".messageText"
            );

        if (messageText) {

            messageText.innerHTML =
                "🧠 <em>Regenerating...</em>";

        }


        try {

            /* ============================================
               CALL EXISTING AI SYSTEM
            ============================================ */

            const newResponse =
                await window.smartAIReply(
                    userText
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


            /* ============================================
               RENDER NEW RESPONSE
            ============================================ */

            if (
                messageText &&
                typeof window.formatAIResponse ===
                "function"
            ) {

                const formatted =
                    window.formatAIResponse(
                        String(newResponse)
                    );


                messageText.innerHTML =
                    "";


                /*
                 * IMPORTANT:
                 *
                 * formatAIResponse() returns a
                 * DocumentFragment.
                 *
                 * Do NOT put it inside innerHTML.
                 */

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


            console.log(
                "✅ Response regenerated successfully"
            );


            /* ============================================
               RESTORE BUTTON
            ============================================ */

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


            /* ============================================
               SCROLL
            ============================================ */

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


            /* ============================================
               RESTORE VISIBLE OLD RESPONSE
            ============================================ */

            if (messageText) {

                if (
                    typeof window.formatAIResponse ===
                    "function"
                ) {

                    const restored =
                        window.formatAIResponse(
                            originalResponse
                        );


                    messageText.innerHTML =
                        "";


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


            /* ============================================
               RESTORE ORIGINAL HISTORY
            ============================================ */

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
       CREATE ACTION BAR
    ===================================================== */

    function createActionBar(
        messageElement
    ) {

        if (!messageElement) {
            return;
        }


        /* ================================================
           DON'T ADD TWICE
        ================================================= */

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


        /* ================================================
           COPY
        ================================================= */

        const copyButton =
            createCopyButton(
                messageElement
            );

        actions.appendChild(
            copyButton
        );


        /* ================================================
           REGENERATE
        ================================================= */

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
       ENHANCE AI MESSAGE
    ===================================================== */

    function enhanceMessage(
        messageElement
    ) {

        if (!messageElement) {
            return;
        }


        if (
            !messageElement.classList.contains(
                "ai"
            )
        ) {

            return;

        }


        createActionBar(
            messageElement
        );

    }


    /* =====================================================
       EXISTING AI MESSAGES
    ===================================================== */

    chatBox
        .querySelectorAll(
            ".message.ai"
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


                                    /* ==================================
                                       DIRECT AI MESSAGE
                                    ================================== */

                                    if (
                                        node.classList &&
                                        node.classList.contains(
                                            "message"
                                        ) &&
                                        node.classList.contains(
                                            "ai"
                                        )
                                    ) {

                                        enhanceMessage(
                                            node
                                        );

                                    }


                                    /* ==================================
                                       AI MESSAGE INSIDE ELEMENT
                                    ================================== */

                                    if (
                                        node.querySelectorAll
                                    ) {

                                        node
                                            .querySelectorAll(
                                                ".message.ai"
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
            regenerateResponse

    };


    console.log(
        "✅ Phase 9A Copy + Regenerate ready"
    );

})();
