"use strict";

/* ==========================================
   AI LIFE ASSISTANT
   voiceAI.js
   Version 1.0

   RESPONSIBILITIES:
   - Speech recognition
   - Voice input
   - Speech synthesis
   - AI voice responses
========================================== */

console.log("🎤 voiceAI.js loading...");


/* ==========================================
   VOICE VARIABLES
========================================== */

let recognition = null;

let isListening = false;

let isSpeaking = false;


/* ==========================================
   CHECK SPEECH RECOGNITION SUPPORT
========================================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


/* ==========================================
   INITIALIZE SPEECH RECOGNITION
========================================== */

function initializeVoiceRecognition() {

    if (!SpeechRecognition) {

        console.warn(
            "⚠️ Speech recognition is not supported"
        );

        return false;

    }


    recognition =
        new SpeechRecognition();


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.lang =
        "en-US";


    recognition.maxAlternatives =
        1;


    /* ======================================
       START
    ====================================== */

    recognition.onstart =
        function () {

            isListening = true;


            console.log(
                "🎤 Voice recognition started"
            );


            updateVoiceButton();

        };


    /* ======================================
       RESULT
    ====================================== */

    recognition.onresult =
        function (event) {

            const transcript =
                event.results[0][0]
                .transcript;


            console.log(
                "🗣️ Voice transcript:",
                transcript
            );


            window.dispatchEvent(
                new CustomEvent(
                    "voiceTranscript",
                    {

                        detail: {

                            text:
                                transcript

                        }

                    }
                )
            );

        };


    /* ======================================
       END
    ====================================== */

    recognition.onend =
        function () {

            isListening = false;


            console.log(
                "🎤 Voice recognition ended"
            );


            updateVoiceButton();

        };


    /* ======================================
       ERROR
    ====================================== */

    recognition.onerror =
        function (event) {

            console.error(
                "❌ Voice recognition error:",
                event.error
            );


            isListening =
                false;


            updateVoiceButton();


            window.dispatchEvent(
                new CustomEvent(
                    "voiceError",
                    {

                        detail: {

                            error:
                                event.error

                        }

                    }
                )
            );

        };


    return true;

}


/* ==========================================
   START LISTENING
========================================== */

function startListening() {

    if (!recognition) {

        const initialized =
            initializeVoiceRecognition();


        if (!initialized) {

            return false;

        }

    }


    if (isListening) {

        console.log(
            "🎤 Already listening"
        );

        return true;

    }


    try {

        recognition.start();

        return true;

    }

    catch (error) {

        console.error(
            "❌ Could not start microphone:",
            error
        );

        return false;

    }

}


/* ==========================================
   STOP LISTENING
========================================== */

function stopListening() {

    if (
        recognition &&
        isListening
    ) {

        recognition.stop();

    }

}


/* ==========================================
   SPEAK TEXT
========================================== */

function speakText(text) {

    if (!text) {

        return false;

    }


    if (
        !("speechSynthesis" in window)
    ) {

        console.warn(
            "⚠️ Speech synthesis not supported"
        );

        return false;

    }


    stopSpeaking();


    const utterance =
        new SpeechSynthesisUtterance(
            String(text)
        );


    utterance.lang =
        "en-US";


    utterance.rate =
        1;


    utterance.pitch =
        1;


    utterance.onstart =
        function () {

            isSpeaking = true;


            console.log(
                "🔊 AI started speaking"
            );

        };


    utterance.onend =
        function () {

            isSpeaking = false;


            console.log(
                "🔇 AI finished speaking"
            );

        };


    utterance.onerror =
        function (error) {

            isSpeaking = false;


            console.error(
                "❌ Speech error:",
                error
            );

        };


    window.speechSynthesis.speak(
        utterance
    );


    return true;

}


/* ==========================================
   STOP SPEAKING
========================================== */

function stopSpeaking() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }


    isSpeaking =
        false;

}


/* ==========================================
   TOGGLE VOICE INPUT
========================================== */

function toggleListening() {

    if (isListening) {

        stopListening();

    }

    else {

        startListening();

    }

}


/* ==========================================
   VOICE BUTTON UI
========================================== */

function updateVoiceButton() {

    const voiceBtn =
        document.getElementById(
            "voiceBtn"
        );


    if (!voiceBtn) {

        return;

    }


    if (isListening) {

        voiceBtn.classList.add(
            "listening"
        );


        voiceBtn.setAttribute(
            "aria-label",
            "Stop listening"
        );

    }

    else {

        voiceBtn.classList.remove(
            "listening"
        );


        voiceBtn.setAttribute(
            "aria-label",
            "Start voice input"
        );

    }

}


/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.initializeVoiceRecognition =
    initializeVoiceRecognition;

window.startListening =
    startListening;

window.stopListening =
    stopListening;

window.toggleListening =
    toggleListening;

window.speakText =
    speakText;

window.stopSpeaking =
    stopSpeaking;


/* ==========================================
   READY
========================================== */

console.log(
    "========================================"
);

console.log(
    "✅ voiceAI.js ready"
);

console.log(
    "🎤 Speech Recognition:",
    !!SpeechRecognition
);

console.log(
    "🔊 Speech Synthesis:",
    "speechSynthesis" in window
);

console.log(
    "========================================"
);
