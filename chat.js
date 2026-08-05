// ==========================================
// AI Life Assistant Chat
// Version 3.0
// ==========================================

// -------------------------
// Elements
// -------------------------

const chatBox = document.getElementById("chatBox");

const userInput = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");

const attachBtn = document.getElementById("attachBtn");

const voiceBtn = document.getElementById("voiceBtn");

const attachmentMenu = document.getElementById("attachmentMenu");

const imagePicker = document.getElementById("imagePicker");

const filePicker = document.getElementById("filePicker");

// -------------------------
// Upload Memory
// -------------------------

let uploadedFiles = [];
// -------------------------
// Helpers
// -------------------------

function getCurrentTime(){

    return new Date().toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

function scrollBottom(){

    chatBox.scrollTop = chatBox.scrollHeight;

}
// -------------------------
// Auto Expand
// -------------------------

userInput.addEventListener("input",function(){

    this.style.height = "auto";

    this.style.height = this.scrollHeight + "px";

});

// -------------------------
// Composer State
// -------------------------

function updateComposer(){

    if(userInput.value.trim().length > 0){

        sendBtn.classList.add("active");

        if(voiceBtn){

            voiceBtn.style.display = "none";

        }

    }else{

        sendBtn.classList.remove("active");

        if(voiceBtn){

            voiceBtn.style.display = "flex";

        }

    }

}

userInput.addEventListener("input",updateComposer);

updateComposer();

