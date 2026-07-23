 // ==========================
// AI Memory
// ==========================

function getMemory(){

    return JSON.parse(localStorage.getItem("aiMemory")) || {};

}

function saveMemory(memory){

    localStorage.setItem(
        "aiMemory",
        JSON.stringify(memory)
    );

}
