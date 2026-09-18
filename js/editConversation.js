"use strict";

console.log("🚀 Conversation Edit loading...");

(function () {

    const chatBox =
        document.getElementById("chatBox");

    if (!chatBox) {
        console.error("❌ chatBox not found");
        return;
    }


    /* =====================================================
       CREATE EDIT BUTTON
    ===================================================== */

    function createEditButton(messageElement) {

        if (!messageElement) {
            return;
        }

        if (
            messageElement.dataset &&
            messageElement.dataset.editAdded === "true"
        ) {
            return;
        }


        const messageText =
            messageElement.querySelector(".messageText");

        if (!messageText) {
            return;
        }


        const actions =
            document.createElement("div");

        actions.className =
            "messageActions editActions";


        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.className =
            "messageActionButton";

        editButton.textContent =
            "✏️ Edit";

        editButton.setAttribute(
            "aria-label",
            "Edit message"
        );


        editButton.addEventListener(
            "click",
            function () {

                startEditing(
                    messageElement,
                    messageText,
                    editButton
                );

            }
        );


        actions.appendChild(
            editButton
        );


        messageElement.appendChild(
            actions
        );


        messageElement.dataset.editAdded =
            "true";

    }


    /* =====================================================
       START EDITING
    ===================================================== */

    function startEditing(
        messageElement,
        messageText,
        editButton
    ) {

        if (
            messageElement.dataset.editing === "true"
        ) {
            return;
        }


        const originalText =
            (
                messageText.innerText ||
                messageText.textContent ||
                ""
            )
            .replace(/\u00a0/g, " ")
            .trim();


        if (!originalText) {
            return;
        }


        messageElement.dataset.editing =
            "true";


        /*
         * Save original content so we can
         * restore it if Cancel is pressed.
         */

        const originalHTML =
            messageText.innerHTML;


        /* =================================================
           EDIT AREA
        ================================================= */

        const editor =
            document.createElement("textarea");

        editor.className =
            "conversationEditInput";

        editor.value =
            originalText;

        editor.rows =
            Math.max(
                3,
                Math.min(
                    8,
                    originalText.split("\n").length + 1
                )
            );


        /* =================================================
           EDIT CONTROLS
        ================================================= */

        const controls =
            document.createElement("div");

        controls.className =
            "conversationEditControls";


        const saveButton =
            document.createElement("button");

        saveButton.type =
            "button";

        saveButton.className =
            "messageActionButton editSaveButton";

        saveButton.textContent =
            "✓ Save";


        const cancelButton =
            document.createElement("button");

        cancelButton.type =
            "button";

        cancelButton.className =
            "messageActionButton editCancelButton";

        cancelButton.textContent =
            "✕ Cancel";


        controls.appendChild(
            saveButton
        );

        controls.appendChild(
            cancelButton
        );


        /* =================================================
           REPLACE MESSAGE
        ================================================= */

        messageText.innerHTML =
            "";

        messageText.appendChild(
            editor
        );

        messageText.appendChild(
            controls
        );


        editButton.style.display =
            "none";


        editor.focus();


        /*
         * Put cursor at the end.
         */

        editor.setSelectionRange(
            editor.value.length,
            editor.value.length
        );


        /* =================================================
           CANCEL
        ================================================= */

        cancelButton.addEventListener(
            "click",
            function () {

                messageText.innerHTML =
                    originalHTML;

                editButton.style.display =
                    "";

                delete messageElement.dataset.editing;

            }
        );


        /* =================================================
           SAVE
        ================================================= */

        saveButton.addEventListener(
            "click",
            function () {

                const newText =
                    editor.value
                        .replace(/\u00a0/g, " ")
                        .trim();


                if (!newText) {

                    alert(
                        "Message cannot be empty."
                    );

                    editor.focus();

                    return;

                }


                messageText.textContent =
                    newText;


                editButton.style.display =
                    "";


                delete messageElement.dataset.editing;


                console.log(
                    "✏️ Message edited:",
                    newText
                );

            }
        );

    }


    /* =====================================================
       ENHANCE USER MESSAGE
    ===================================================== */

    function enhanceUserMessage(
        messageElement
    ) {

        if (!messageElement) {
            return;
        }


        if (
            !messageElement.classList.contains(
                "message"
            )
        ) {
            return;
        }


        if (
            !messageElement.classList.contains(
                "user"
            )
        ) {
            return;
        }


        createEditButton(
            messageElement
        );

    }


    /* =====================================================
       EXISTING USER MESSAGES
    ===================================================== */

    chatBox
        .querySelectorAll(
            ".message.user"
        )
        .forEach(
            enhanceUserMessage
        );


    /* =====================================================
       WATCH FOR NEW USER MESSAGES
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
                                        ) &&
                                        node.classList.contains(
                                            "user"
                                        )
                                    ) {

                                        enhanceUserMessage(
                                            node
                                        );

                                    }


                                    if (
                                        node.querySelectorAll
                                    ) {

                                        node
                                            .querySelectorAll(
                                                ".message.user"
                                            )
                                            .forEach(
                                                enhanceUserMessage
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

    window.conversationEditor = {

        enhanceUserMessage:
            enhanceUserMessage,

        startEditing:
            startEditing

    };


    console.log(
        "✅ Conversation Edit ready"
    );

})();
