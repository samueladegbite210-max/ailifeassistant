// ================================
// Helper Functions
// ================================

function hasAny(msg, words){

    return words.some(function(word){
        return msg.includes(word);
    });

}

function saveData(key, value){

    localStorage.setItem(key, JSON.stringify(value));

}

function loadData(key, defaultValue){

    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : defaultValue;

}
function match(msg, keywords){

    msg = msg.toLowerCase();

    return keywords.some(function(word){
        return msg.includes(word);
    });

}
