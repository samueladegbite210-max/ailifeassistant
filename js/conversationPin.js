"use strict";

console.log("📌 Conversation Pin loading...");

const PINNED_STORAGE_KEY =
    "aiLifeAssistantPinnedConversations";


/* =====================================================
   PIN STORAGE
===================================================== */

function getPinnedConversationIds() {

    try {

        const saved =
            localStorage.getItem(
                PINNED_STORAGE_KEY
            );

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.warn(
            "⚠️ Could not load pinned conversations:",
            error
        );

        return [];
    }
}


function savePinnedConversationIds(ids) {

    try {

        localStorage.setItem(
            PINNED_STORAGE_KEY,
            JSON.stringify(ids)
        );

    } catch (error) {

        console.warn(
            "⚠️ Could not save pinned conversations:",
            error
        );
    }
}


/* =====================================================
   CHECK PINNED
===================================================== */

function isConversationPinned(id) {

    if (!id) {
        return false;
    }

    return getPinnedConversationIds()
        .includes(id);
}


/* =====================================================
   TOGGLE PIN
===================================================== */

function toggleConversationPin(
    conversationId
) {

    if (!conversationId) {
        return;
    }

    let pinnedIds =
        getPinnedConversationIds();

    const alreadyPinned =
        pinnedIds.includes(
            conversationId
        );


    if (alreadyPinned) {

        pinnedIds =
            pinnedIds.filter(
                function (id) {
                    return id !== conversationId;
                }
            );

    } else {

        pinnedIds.push(
            conversationId
        );
    }


    savePinnedConversationIds(
        pinnedIds
    );


    console.log(
        alreadyPinned
            ? "📌 Conversation unpinned"
            : "📌 Conversation pinned",
        conversationId
    );


    updatePinButtons();


    /*
       Refresh the conversation list
       using the existing manager.
    */

    if (
        typeof window.renderConversationList ===
        "function"
    ) {

        try {

            window.renderConversationList();

        } catch (error) {

            console.warn(
                "⚠️ Could not refresh conversation list:",
                error
            );
        }
    }
}


/* =====================================================
   GET CONVERSATION ID
===================================================== */

function getConversationId(
    conversationItem
) {

    if (!conversationItem) {
        return null;
    }


    /*
       First check common data attributes.
    */

    const possibleIds = [
        conversationItem.dataset
            ? conversationItem.dataset.id
            : null,

        conversationItem.dataset
            ? conversationItem.dataset.conversationId
            : null,

        conversationItem.getAttribute(
            "data-id"
        ),

        conversationItem.getAttribute(
            "data-conversation-id"
        )
    ];


    for (
        let i = 0;
        i < possibleIds.length;
        i++
    ) {

        if (possibleIds[i]) {
            return possibleIds[i];
        }
    }


    return null;
}


/* =====================================================
   ADD PIN BUTTON
===================================================== */

function addPinButton(
    conversationItem
) {

    if (!conversationItem) {
        return;
    }


    if (
        conversationItem.querySelector(
            ".pinConversationButton"
        )
    ) {
        return;
    }


    const conversationId =
        getConversationId(
            conversationItem
        );


    if (!conversationId) {
        return;
    }


    const optionsMenu =
        conversationItem.querySelector(
            ".conversationOptionsMenu"
        );


    if (!optionsMenu) {
        return;
    }


    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "conversationOptionButton pinConversationButton";


    const pinned =
        isConversationPinned(
            conversationId
        );


    button.textContent =
        pinned
            ? "📌 Unpin"
            : "📌 Pin";


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            toggleConversationPin(
                conversationId
            );
        }
    );


    /*
       Put Pin at the top of the
       conversation options menu.
    */

    optionsMenu.insertBefore(
        button,
        optionsMenu.firstChild
    );
}


/* =====================================================
   UPDATE BUTTONS
===================================================== */

function updatePinButtons() {

    const items =
        document.querySelectorAll(
            ".conversationItem"
        );


    items.forEach(
        function (item) {

            const id =
                getConversationId(item);

            if (!id) {
                return;
            }


            const button =
                item.querySelector(
                    ".pinConversationButton"
                );

            if (!button) {
                return;
            }


            button.textContent =
                isConversationPinned(id)
                    ? "📌 Unpin"
                    : "📌 Pin";
        }
    );
}


/* =====================================================
   PROCESS CONVERSATION LIST
===================================================== */

function processConversationItems() {

    const items =
        document.querySelectorAll(
            ".conversationItem"
        );


    items.forEach(
        function (item) {

            addPinButton(item);
        }
    );


    updatePinButtons();
}


/* =====================================================
   OBSERVER
===================================================== */

function startConversationPinSystem() {

    processConversationItems();


    const observer =
        new MutationObserver(
            function () {

                processConversationItems();
            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );
}


/* =====================================================
   PUBLIC API
===================================================== */

window.conversationPin = {

    isPinned:
        isConversationPinned,

    toggle:
        toggleConversationPin,

    getPinnedIds:
        getPinnedConversationIds,

    update:
        updatePinButtons
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
        startConversationPinSystem
    );

} else {

    startConversationPinSystem();
}


console.log(
    "✅ Conversation Pin ready."
);
