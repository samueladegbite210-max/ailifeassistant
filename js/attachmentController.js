"use strict";

console.log("📎 attachmentController.js loading...");

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const attachBtn =
            document.getElementById("attachBtn");

        const attachmentMenu =
            document.getElementById("attachmentMenu");

        const pickImageBtn =
            document.getElementById("pickImageBtn");

        const takePhotoBtn =
            document.getElementById("takePhotoBtn");

        const pickFileBtn =
            document.getElementById("pickFileBtn");

        const imagePicker =
            document.getElementById("imagePicker");

        const cameraPicker =
            document.getElementById("cameraPicker");

        const filePicker =
            document.getElementById("filePicker");


        if (!attachBtn) {

            console.error("❌ attachBtn not found");

            return;

        }


        console.log("✅ attachBtn found");


        attachBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (!attachmentMenu) {

                    console.error(
                        "❌ attachmentMenu not found"
                    );

                    return;

                }


                if (
                    attachmentMenu.style.display ===
                    "block"
                ) {

                    attachmentMenu.style.display =
                        "none";

                } else {

                    attachmentMenu.style.display =
                        "block";

                }

            }
        );


        if (pickImageBtn && imagePicker) {

            pickImageBtn.addEventListener(
                "click",
                function () {

                    imagePicker.click();

                }
            );

        }


        if (takePhotoBtn && cameraPicker) {

            takePhotoBtn.addEventListener(
                "click",
                function () {

                    cameraPicker.click();

                }
            );

        }


        if (pickFileBtn && filePicker) {

            pickFileBtn.addEventListener(
                "click",
                function () {

                    filePicker.click();

                }
            );

        }


        if (imagePicker) {

            imagePicker.addEventListener(
                "change",
                function () {

                    const file =
                        this.files[0];


                    if (!file) {

                        return;

                    }


                    window.aiAttachment = {

                        type: "image",

                        name: file.name,

                        mimeType: file.type,

                        size: file.size,

                        file: file,

                        data: file

                    };


                    alert(
                        "🖼️ Image selected: " +
                        file.name
                    );

                }
            );

        }


        if (cameraPicker) {

            cameraPicker.addEventListener(
                "change",
                function () {

                    const file =
                        this.files[0];


                    if (!file) {

                        return;

                    }


                    window.aiAttachment = {

                        type: "image",

                        name: file.name,

                        mimeType: file.type,

                        size: file.size,

                        file: file,

                        data: file

                    };


                    alert(
                        "📷 Photo selected: " +
                        file.name
                    );

                }
            );

        }


        if (filePicker) {

            filePicker.addEventListener(
                "change",
                function () {

                    const file =
                        this.files[0];


                    if (!file) {

                        return;

                    }


                    window.aiAttachment = {

                        type: "file",

                        name: file.name,

                        mimeType: file.type,

                        size: file.size,

                        file: file

                    };


                    alert(
                        "📄 File selected: " +
                        file.name
                    );

                }
            );

        }


        console.log(
            "✅ attachmentController.js ready"
        );

    }
);
