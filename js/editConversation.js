"use strict";

console.log("✏️ Conversation Editor loading...");


/* =====================================================
   ELEMENTS
===================================================== */

const editChatBox =
    document.getElementById("chatBox");


/* =====================================================
   CREATE EDIT BUTTON
===================================================== */

function createEditButton(messageElement) {

    if (!messageElement) return;

    if (
        messageElement.querySelector(
            ".editMessageButton"
        )
    ) {
        return;
    }

    let actions =
        messageElement.querySelector(
            ".messageActions"
        );

    if (!actions) {

        actions =
            document.createElement("div");

        actions.className =
            "messageActions editActions";

        messageElement.appendChild(actions);
    }

    const editButton =
        document.createElement("button");

    editButton.type = "button";
    editButton.className =
        "editMessageButton";

    editButton.textContent =
        "✏️ Edit";

    editButton.addEventListener(
        "click",
        function () {

            startEditing(messageElement);
        }
    );

    actions.appendChild(
        editButton
    );
}


/* =====================================================
   GET MESSAGE TEXT
===================================================== */

function getMessageText(messageElement) {

    const textElement =
        messageElement.querySelector(
            ".messageText"
        );

    if (!textElement) {
        return "";
    }

    return textElement.textContent.trim();
}


/* =====================================================
   FIND HISTORY INDEX
===================================================== */

function getUserMessageIndex(
    messageElement
) {

    const history =
        window.conversationHistory || [];

    if (!history.length) {
        return -1;
    }

    const userMessages =
        Array.from(
            document.querySelectorAll(
                "#chatBox .message.user"
            )
        );

    const domIndex =
        userMessages.indexOf(
            messageElement
        );

    if (domIndex === -1) {
        return -1;
    }

    let userCount = 0;

    for (
        let i = 0;
        i < history.length;
        i++
    ) {

        if (
            history[i].role === "user"
        ) {

            if (
                userCount === domIndex
            ) {
                return i;
            }

            userCount++;
        }
    }

    return -1;
}


/* =====================================================
   START EDITING
===================================================== */

function startEditing(messageElement) {

    if (!messageElement) return;

    if (
        messageElement.classList.contains(
            "editingMessage"
        )
    ) {
        return;
    }

    const textElement =
        messageElement.querySelector(
            ".messageText"
        );

    if (!textElement) {
        return;
    }

    const originalText =
        textElement.textContent;

    messageElement.classList.add(
        "editingMessage"
    );

    const textarea =
        document.createElement("textarea");

    textarea.className =
        "conversationEditInput";

    textarea.value =
        originalText;

    textarea.setAttribute(
        "aria-label",
        "Edit message"
    );

    const controls =
        document.createElement("div");

    controls.className =
        "conversationEditControls";

    const saveButton =
        document.createElement("button");

    saveButton.type = "button";
    saveButton.className =
        "editSaveButton";

    saveButton.textContent =
        "Save & Regenerate";

    const cancelButton =
        document.createElement("button");

    cancelButton.type = "button";
    cancelButton.className =
        "editCancelButton";

    cancelButton.textContent =
        "Cancel";

    controls.appendChild(
        saveButton
    );

    controls.appendChild(
        cancelButton
    );

    textElement.style.display =
        "none";

    messageElement.insertBefore(
        textarea,
        textElement.nextSibling
    );

    messageElement.insertBefore(
        controls,
        textarea.nextSibling
    );

    textarea.focus();

    textarea.setSelectionRange(
        textarea.value.length,
        textarea.value.length
    );


    /* =================================================
       CANCEL
    ================================================= */

    cancelButton.addEventListener(
        "click",
        function () {

            textarea.remove();
            controls.remove();

            textElement.style.display =
                "";

            messageElement.classList.remove(
                "editingMessage"
            );
        }
    );


    /* =================================================
       SAVE
    ================================================= */

    saveButton.addEventListener(
        "click",
        async function () {

            const newText =
                textarea.value.trim();

            if (!newText) {
                textarea.focus();
                return;
            }

            saveButton.disabled =
                true;

            cancelButton.disabled =
                true;

            saveButton.textContent =
                "Generating...";

            try {

                await saveEditedMessage(
                    messageElement,
                    newText
                );

            } catch (error) {

                console.error(
                    "❌ Edit failed:",
                    error
                );

                saveButton.disabled =
                    false;

                cancelButton.disabled =
                    false;

                saveButton.textContent =
                    "Save & Regenerate";

                alert(
                    "Unable to regenerate this message. Please try again."
                );
            }
        }
    );
}


/* =====================================================
   SAVE EDITED MESSAGE
===================================================== */

async function saveEditedMessage(
    messageElement,
    newText
) {

    const historyIndex =
        getUserMessageIndex(
            messageElement
        );

    if (historyIndex === -1) {

        throw new Error(
            "Message was not found in conversation history."
        );
    }


    /* =================================================
       UPDATE VISIBLE USER MESSAGE
    ================================================= */

    const textElement =
        messageElement.querySelector(
            ".messageText"
        );

    if (textElement) {

        textElement.textContent =
            newText;

        textElement.style.display =
            "";
    }


    const textarea =
        messageElement.querySelector(
            ".conversationEditInput"
        );

    const controls =
        messageElement.querySelector(
            ".conversationEditControls"
        );

    if (textarea) {
        textarea.remove();
    }

    if (controls) {
        controls.remove();
    }

    messageElement.classList.remove(
        "editingMessage"
    );


    /* =================================================
       REMOVE EVERYTHING AFTER EDITED MESSAGE
    ================================================= */

    let next =
        messageElement.nextElementSibling;

    while (next) {

        const removeThis =
            next;

        next =
            next.nextElementSibling;

        removeThis.remove();
    }


    /* =================================================
       REBUILD HISTORY
       Keep everything BEFORE edited message.
    ================================================= */

    const oldHistory =
        window.conversationHistory || [];

    const rebuiltHistory =
        oldHistory.slice(
            0,
            historyIndex
        );

    rebuiltHistory.push({
        role: "user",
        content: newText,
        timestamp: Date.now()
    });

    window.conversationHistory =
        rebuiltHistory;


    /* =================================================
       ONLINE AI
    ================================================= */

    if (
        typeof window.askOnlineAI !==
        "function"
    ) {

        throw new Error(
            "Online AI function is unavailable."
        );
    }


    /* =================================================
       ACTIVE IMAGE CONTEXT
    ================================================= */

    let useImageContext = false;

    if (
        typeof window.getActiveVisionContext ===
        "function"
    ) {

        try {

            useImageContext =
                !!window.getActiveVisionContext();

        } catch (error) {

            console.warn(
                "⚠️ Could not check image context:",
                error
            );
        }
    }


    /* =================================================
       GENERATE NEW RESPONSE
    ================================================= */

    const newResponse =
        await window.askOnlineAI(
            newText,
            null,
            true,
            useImageContext
        );


    /* =================================================
       CREATE AI MESSAGE
    ================================================= */

    const aiMessage =
        document.createElement("div");

    aiMessage.className =
        "message ai";

    const aiText =
        document.createElement("div");

    aiText.className =
        "messageText";


    /* =================================================
       FORMAT RESPONSE
    ================================================= */

    if (
        typeof window.formatAIResponse ===
        "function"
    ) {

        try {

            const formatted =
                window.formatAIResponse(
                    newResponse
                );

            if (
                formatted instanceof
                DocumentFragment
            ) {

                aiText.appendChild(
                    formatted
                );

            } else if (
                formatted instanceof
                HTMLElement
            ) {

                aiText.appendChild(
                    formatted
                );

            } else {

                aiText.innerHTML =
                    formatted;
            }

        } catch (error) {

            console.warn(
                "⚠️ Formatting failed:",
                error
            );

            aiText.textContent =
                newResponse;
        }

    } else {

        aiText.textContent =
            newResponse;
    }


    aiMessage.appendChild(
        aiText
    );


    /* =================================================
       INSERT NEW AI RESPONSE
    ================================================= */

    messageElement.after(
        aiMessage
    );


    /* =================================================
       ADD AI RESPONSE TO HISTORY
    ================================================= */

    window.conversationHistory.push({
        role: "assistant",
        content: newResponse,
        timestamp: Date.now()
    });


    /* =================================================
       SAVE CONVERSATION
    ================================================= */

    if (
        typeof window.saveCurrentConversation ===
        "function"
    ) {

        try {

            await window.saveCurrentConversation();

        } catch (error) {

            console.warn(
                "⚠️ Conversation save failed:",
                error
            );
        }
    }


    /* =================================================
       SCROLL
    ================================================= */

    setTimeout(
        function () {

            aiMessage.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        },
        50
    );


    console.log(
        "✅ Older message edited and regenerated."
    );
}


/* =====================================================
   OBSERVE CHAT
===================================================== */

function observeMessages() {

    if (!editChatBox) {

        console.warn(
            "⚠️ chatBox not found."
        );

        return;
    }


    function processUserMessages() {

        const userMessages =
            editChatBox.querySelectorAll(
                ".message.user"
            );

        userMessages.forEach(
            function (message) {

                createEditButton(
                    message
                );
            }
        );
    }


    processUserMessages();


    const observer =
        new MutationObserver(
            function () {

                processUserMessages();
            }
        );

    observer.observe(
        editChatBox,
        {
            childList: true,
            subtree: true
        }
    );
}


/* =====================================================
   PUBLIC API
===================================================== */

window.conversationEditor = {

    startEditing:
        startEditing,

    createEditButton:
        createEditButton,

    saveEditedMessage:
        saveEditedMessage
};


/* =====================================================
   START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        observeMessages
    );

} else {

    observeMessages();
}


console.log(
    "✅ Conversation Editor ready."
);
