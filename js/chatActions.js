"use strict";

console.log("🚀 Phase 9A chat actions loading...");

(function () {

    const chatBox = document.getElementById("chatBox");

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

        } catch (error) {
            console.warn("⚠️ Clipboard API failed:", error);
        }

        /* iPhone / fallback */

        try {

            const textarea = document.createElement("textarea");

            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            textarea.style.top = "0";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            const success = document.execCommand("copy");

            textarea.remove();

            return success;

        } catch (error) {

            console.error("❌ Copy failed:", error);

            return false;
        }
    }


    /* =====================================================
       CREATE ACTION BUTTON
    ===================================================== */

    function createCopyButton(messageElement) {

        if (!messageElement) return;

        if (
            messageElement.dataset &&
            messageElement.dataset.actionsAdded === "true"
        ) {
            return;
        }

        const messageText =
            messageElement.querySelector(".messageText");

        if (!messageText) return;


        /* Action bar */

        const actions = document.createElement("div");

        actions.className = "messageActions";


        /* Copy button */

        const copyButton = document.createElement("button");

        copyButton.type = "button";
        copyButton.className = "messageActionButton";
        copyButton.textContent = "📋 Copy";
        copyButton.setAttribute(
            "aria-label",
            "Copy AI response"
        );


        copyButton.addEventListener("click", async function () {

            const text =
                messageText.innerText ||
                messageText.textContent ||
                "";

            const cleanText =
                text
                    .replace(/\u00a0/g, " ")
                    .trim();

            if (!cleanText) return;


            copyButton.disabled = true;

            const originalText =
                copyButton.textContent;

            const success =
                await copyText(cleanText);


            if (success) {

                copyButton.textContent = "✓ Copied";

                setTimeout(function () {

                    copyButton.textContent =
                        originalText;

                    copyButton.disabled = false;

                }, 1500);

            } else {

                copyButton.textContent =
                    "❌ Failed";

                setTimeout(function () {

                    copyButton.textContent =
                        originalText;

                    copyButton.disabled = false;

                }, 1500);
            }

        });


        actions.appendChild(copyButton);

        messageElement.appendChild(actions);

        messageElement.dataset.actionsAdded = "true";
    }


    /* =====================================================
       CHECK MESSAGE
    ===================================================== */

    function enhanceMessage(messageElement) {

        if (!messageElement) return;

        /*
         * Only add Copy to AI messages.
         */

        if (
            !messageElement.classList.contains("ai")
        ) {
            return;
        }

        createCopyButton(messageElement);
    }


    /* =====================================================
       EXISTING MESSAGES
    ===================================================== */

    chatBox
        .querySelectorAll(".message.ai")
        .forEach(enhanceMessage);


    /* =====================================================
       WATCH FOR NEW AI MESSAGES
    ===================================================== */

    const observer =
        new MutationObserver(function (mutations) {

            mutations.forEach(function (mutation) {

                mutation.addedNodes.forEach(function (node) {

                    if (
                        node.nodeType !== Node.ELEMENT_NODE
                    ) {
                        return;
                    }


                    /* Direct AI message */

                    if (
                        node.classList &&
                        node.classList.contains("message") &&
                        node.classList.contains("ai")
                    ) {
                        enhanceMessage(node);
                    }


                    /* AI message inside another element */

                    if (
                        node.querySelectorAll
                    ) {

                        node
                            .querySelectorAll(".message.ai")
                            .forEach(enhanceMessage);
                    }

                });

            });

        });


    observer.observe(chatBox, {
        childList: true,
        subtree: true
    });


    /* =====================================================
       GLOBAL
    ===================================================== */

    window.chatActions = {

        copyText: copyText,

        enhanceMessage: enhanceMessage

    };


    console.log("✅ Phase 9A Copy action ready");

})();
