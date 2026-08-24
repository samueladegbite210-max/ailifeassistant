"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   attachmentController.js

   RESPONSIBILITY ONLY:
   - Attachment button
   - Attachment menu
   - Photo picker
   - Camera picker
   - File picker
   - Save current attachment

   IMPORTANT:
   This file does NOT control:
   - Send button
   - Enter key
   - AI replies
   - Chat messages
========================================== */

console.log(
    "📎 attachmentController.js loading..."
);


/* ==========================================
   GET ELEMENTS
========================================== */

const attachBtn =
    document.getElementById(
        "attachBtn"
    );

const attachmentMenu =
    document.getElementById(
        "attachmentMenu"
    );

const pickImageBtn =
    document.getElementById(
        "pickImageBtn"
    );

const takePhotoBtn =
    document.getElementById(
        "takePhotoBtn"
    );

const pickFileBtn =
    document.getElementById(
        "pickFileBtn"
    );

const imagePicker =
    document.getElementById(
        "imagePicker"
    );

const cameraPicker =
    document.getElementById(
        "cameraPicker"
    );

const filePicker =
    document.getElementById(
        "filePicker"
    );


/* ==========================================
   ATTACHMENT STATE
========================================== */

if (
    !window.aiAttachment
) {

    window.aiAttachment =
        null;

}


if (
    !Array.isArray(
        window.uploadedFiles
    )
) {

    window.uploadedFiles =
        [];

}


/* ==========================================
   OPEN MENU
========================================== */

function openAttachmentMenu() {

    if (!attachmentMenu) {

        console.error(
            "❌ attachmentMenu not found"
        );

        return;

    }


    attachmentMenu.classList.add(
        "show"
    );


    attachmentMenu.style.display =
        "block";


    console.log(
        "📎 Attachment menu opened"
    );

}


/* ==========================================
   CLOSE MENU
========================================== */

function closeAttachmentMenu() {

    if (!attachmentMenu) {

        return;

    }


    attachmentMenu.classList.remove(
        "show"
    );


    attachmentMenu.style.display =
        "none";

}


/* ==========================================
   ATTACH BUTTON
========================================== */

if (attachBtn) {

    attachBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                attachmentMenu.classList.contains(
                    "show"
                )
            ) {

                closeAttachmentMenu();

            } else {

                openAttachmentMenu();

            }

        }
    );


    console.log(
        "✅ Attach button connected"
    );

} else {

    console.error(
        "❌ attachBtn not found"
    );

}


/* ==========================================
   PHOTO BUTTON
========================================== */

if (pickImageBtn) {

    pickImageBtn.addEventListener(
        "click",
        function () {

            closeAttachmentMenu();


            if (!imagePicker) {

                return;

            }


            imagePicker.value =
                "";


            imagePicker.click();

        }
    );

}


/* ==========================================
   CAMERA BUTTON
========================================== */

if (takePhotoBtn) {

    takePhotoBtn.addEventListener(
        "click",
        function () {

            closeAttachmentMenu();


            if (!cameraPicker) {

                return;

            }


            cameraPicker.value =
                "";


            cameraPicker.click();

        }
    );

}


/* ==========================================
   FILE BUTTON
========================================== */

if (pickFileBtn) {

    pickFileBtn.addEventListener(
        "click",
        function () {

            closeAttachmentMenu();


            if (!filePicker) {

                return;

            }


            filePicker.value =
                "";


            filePicker.click();

        }
    );

}


/* ==========================================
   SAVE IMAGE
========================================== */

function saveImageAttachment(
    file
) {

    if (!file) {

        return;

    }


    window.aiAttachment = {

        type:
            "image",

        name:
            file.name,

        mimeType:
            file.type,

        size:
            file.size,

        file:
            file,

        data:
            file

    };


    window.uploadedFiles.push({

        name:
            file.name,

        type:
            file.type ||
            "image",

        size:
            file.size,

        uploadedAt:
            new Date().toISOString()

    });


    console.log(
        "🖼️ Image attached:",
        file.name
    );


    alert(
        "🖼️ Image attached: " +
        file.name +
        "\n\nNow type a message such as:\n" +
        "Read the text from image"
    );

}


/* ==========================================
   SAVE FILE
========================================== */

function saveFileAttachment(
    file
) {

    if (!file) {

        return;

    }


    window.aiAttachment = {

        type:
            "file",

        name:
            file.name,

        mimeType:
            file.type,

        size:
            file.size,

        file:
            file

    };


    window.uploadedFiles.push({

        name:
            file.name,

        type:
            file.type ||
            "application/octet-stream",

        size:
            file.size,

        uploadedAt:
            new Date().toISOString()

    });


    console.log(
        "📄 File attached:",
        file.name
    );


    alert(
        "📄 File attached: " +
        file.name +
        "\n\nNow type a message such as:\n" +
        "Read the file"
    );

}


/* ==========================================
   IMAGE PICKER
========================================== */

if (imagePicker) {

    imagePicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                return;

            }


            saveImageAttachment(
                file
            );

        }
    );

}


/* ==========================================
   CAMERA PICKER
========================================== */

if (cameraPicker) {

    cameraPicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                return;

            }


            saveImageAttachment(
                file
            );

        }
    );

}


/* ==========================================
   FILE PICKER
========================================== */

if (filePicker) {

    filePicker.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                return;

            }


            saveFileAttachment(
                file
            );

        }
    );

}


/* ==========================================
   CLOSE WHEN CLICKING OUTSIDE
========================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            !attachmentMenu ||
            !attachBtn
        ) {

            return;

        }


        if (
            !attachmentMenu.contains(
                event.target
            ) &&
            !attachBtn.contains(
                event.target
            )
        ) {

            closeAttachmentMenu();

        }

    }
);


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.openAttachmentMenu =
    openAttachmentMenu;

window.closeAttachmentMenu =
    closeAttachmentMenu;

window.saveImageAttachment =
    saveImageAttachment;

window.saveFileAttachment =
    saveFileAttachment;


/* ==========================================
   READY
========================================== */

console.log(
    "================================="
);

console.log(
    "✅ attachmentController.js ready"
);

console.log(
    "attachBtn:",
    !!attachBtn
);

console.log(
    "attachmentMenu:",
    !!attachmentMenu
);

console.log(
    "imagePicker:",
    !!imagePicker
);

console.log(
    "cameraPicker:",
    !!cameraPicker
);

console.log(
    "filePicker:",
    !!filePicker
);

console.log(
    "================================="
);
