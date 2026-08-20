// ==========================================
// AI Life Assistant Chat
// Version 3.1 (Improved)
// ==========================================

const chatBox        = document.getElementById("chatBox");
const userInput      = document.getElementById("userInput");
const sendBtn        = document.getElementById("sendBtn");
const attachBtn      = document.getElementById("attachBtn");
const voiceBtn       = document.getElementById("voiceBtn");
const attachmentMenu = document.getElementById("attachmentMenu");
const imagePicker    = document.getElementById("imagePicker");
const filePicker     = document.getElementById("filePicker");

// ==========================================
// Upload Memory
// ==========================================
let uploadedFiles = [];

function rememberUpload(file, type) {
    uploadedFiles.unshift({
        name: file.name,
        type: type,
        size: file.size,
        date: new Date()
    });
}

// -------------------------
// Helpers
// -------------------------
function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// -------------------------
// Add Message (safer)
// -------------------------
function addMessage(type, content, isHTML = false) {
    const message = document.createElement("div");
    message.className = `message ${type}`;

    const textDiv = document.createElement("div");
    textDiv.className = "messageText";

    if (isHTML) {
        textDiv.innerHTML = content;          // only for trusted content (images/files)
    } else {
        textDiv.textContent = content;        // safe for normal text
    }

    const timeDiv = document.createElement("div");
    timeDiv.className = "messageTime";
    timeDiv.textContent = getCurrentTime();

    message.appendChild(textDiv);
    message.appendChild(timeDiv);
    chatBox.appendChild(message);

    scrollBottom();
}

// ==========================================
// Typing Indicator
// ==========================================
function showTyping() {
    const typing = document.createElement("div");
    typing.className = "message ai typing";
    typing.id = "typingIndicator";
    typing.innerHTML = `
        <div class="typingBubble">
            <span></span><span></span><span></span>
        </div>
    `;
    chatBox.appendChild(typing);
    scrollBottom();
}

function hideTyping() {
    const typing = document.getElementById("typingIndicator");
    if (typing) typing.remove();
}

// -------------------------
// Auto Expand + Composer State
// -------------------------
function updateComposer() {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";

    if (userInput.value.trim().length > 0) {
        sendBtn.classList.add("active");
        if (voiceBtn) voiceBtn.style.display = "none";
    } else {
        sendBtn.classList.remove("active");
        if (voiceBtn) voiceBtn.style.display = "flex";
    }
}

userInput.addEventListener("input", updateComposer);
updateComposer();

// -------------------------
// Send Message (Fixed)
// -------------------------

function sendMessage() {
    console.log("Send button clicked");           // ← temporary debug

    const text = userInput.value.trim();

    if (!text) {
        console.log("Empty message – ignored");
        return;
    }

    // Show user message
    addMessage("user", text);

    // Save conversation
    if (typeof saveContext === "function") {
        saveContext("user", text);
    }

    // Clear input
    userInput.value = "";
    userInput.style.height = "auto";
    updateComposer();

    // Ask AI
    aiReply(text);
}

// Enter to send
userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Send Button
sendBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
});

// -------------------------
// AI Reply
// -------------------------
async function aiReply(text) {
    showTyping();
    userInput.disabled = true;
    sendBtn.disabled = true;

    try {
        if (typeof smartAIReply !== "function") {
            throw new Error("smartAIReply is not available");
        }

        const answer = await smartAIReply(text);
        hideTyping();
        addMessage("ai", answer);

        if (typeof saveContext === "function") {
            saveContext("ai", answer);
        }
    } catch (error) {
        hideTyping();
        addMessage("ai", "⚠️ Sorry, something went wrong. Please try again.");
        console.error(error);
    }

    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
}

// ==========================================
// AI Upload Reply
// ==========================================
function aiUploadReply(type, file) {
    let reply = "";

    if (type === "image") {
        reply = `📷 Nice! I received your image.

I can help you:
📝 Read text from the image
👀 Describe what I see
🔍 Analyze objects
😊 Explain charts
❓ Answer questions about the image

(Coming soon: Full AI Vision)`;
    }

    if (type === "file") {
        reply = `📄 I received: **${file.name}**

I can help you:
📑 Summarize it
🧠 Explain it
🔍 Find important information
📚 Study with you
❓ Answer questions

(Coming soon: Smart document reading)`;
    }

    setTimeout(() => {
        addMessage("ai", reply);
    }, 700);
}

// ==========================================
// Attachment Menu
// ==========================================
function openAttachmentMenu() {
    attachmentMenu.classList.toggle("show");
}

function closeAttachmentMenu() {
    attachmentMenu.classList.remove("show");
}

attachBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openAttachmentMenu();
});

document.addEventListener("click", (e) => {
    if (!attachmentMenu.contains(e.target) && e.target !== attachBtn) {
        closeAttachmentMenu();
    }
});

// ==========================================
// Image Upload
// ==========================================
function pickImage() {
    imagePicker.removeAttribute("capture");
    imagePicker.click();
}

function takePhoto() {
    imagePicker.setAttribute("capture", "environment");
    imagePicker.click();
}

imagePicker.addEventListener("change", () => {
    const file = imagePicker.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        addMessage("user", `<img src="${e.target.result}" class="chatImage" alt="Uploaded image">`, true);
    };
    reader.readAsDataURL(file);

    rememberUpload(file, "image");
    aiUploadReply("image", file);

    imagePicker.value = "";
    closeAttachmentMenu();
});

// ==========================================
// File Upload
// ==========================================
function pickFile() {
    filePicker.click();
}

filePicker.addEventListener("change", () => {
    const file = filePicker.files[0];
    if (!file) return;

    const html = `
        <div class="chatFile">
            <div class="fileIcon">📄</div>
            <div class="fileInfo">
                <div class="fileName">${escapeHTML(file.name)}</div>
                <div class="fileSize">${formatFileSize(file.size)}</div>
            </div>
        </div>
    `;

    addMessage("user", html, true);
    rememberUpload(file, "file");
    aiUploadReply("file", file);

    filePicker.value = "";
    closeAttachmentMenu();
});

// ==========================================
// Voice Button (placeholder)
// ==========================================
if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
        addMessage("ai", "🎤 Voice input is coming soon!");
    });
}
// Temporary debug – remove later
console.log("chat.js fully loaded");
console.log("sendBtn exists?", !!sendBtn);
console.log("userInput exists?", !!userInput);
