// ==========================
// AI Memory
// ==========================

function getMemory() {
    return JSON.parse(localStorage.getItem("aiMemory")) || {};
}

function saveMemory(memory) {
    localStorage.setItem("aiMemory", JSON.stringify(memory));
}

// Save a memory
function remember(key, value) {

    const memory = getMemory();

    memory[key] = value;

    saveMemory(memory);
}

// Recall a memory
function recall(key) {

    const memory = getMemory();

    return memory[key] || null;

}
