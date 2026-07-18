alert("memory.js loaded");
let memory = JSON.parse(localStorage.getItem("memory")) || {
    name:"",
    birthday:"",
    favoriteColor:"",
    favoriteFood:"",
    favoriteDrink:"",
    favoriteMovie:"",
    favoriteMusic:"",
    favoriteSport:"",
    job:"",
    school:"",
    country:"",
    city:"",
    relationship:"",
    dream:"",
    phone:"",
    language:""
};
console.log("memory.js loaded");

function memoryReply(msg, text){

    // Save Name
    if(
        msg.startsWith("my name is ") ||
        msg.startsWith("i am ") ||
        msg.startsWith("i'm ")
    ){

        let name = text
            .replace(/my name is/i,"")
            .replace(/i am/i,"")
            .replace(/i'm/i,"")
            .trim();

        memory.name = name;

        localStorage.setItem("memory", JSON.stringify(memory));

        return "😊 Nice to meet you, " + name + ". I'll remember your name.";

    }

    // Save Location
    if(
        msg.includes("i live in") ||
        msg.includes("i do live in") ||
        msg.includes("i'm from") ||
        msg.includes("im from") ||
        msg.includes("i come from")
    ){

        let city = text
            .replace(/i do live in/i,"")
            .replace(/i live in/i,"")
            .replace(/i'm from/i,"")
            .replace(/im from/i,"")
            .replace(/i come from/i,"")
            .trim();

        memory.city = city;

        localStorage.setItem("memory", JSON.stringify(memory));

        return "📍 I'll remember that you live in " + city + ".";

    }

    // Save Job
    if(
        msg.startsWith("i work as ") ||
        msg.startsWith("my job is ") ||
        msg.startsWith("i am a ")
    ){

        let job = text
            .replace(/i work as/i,"")
            .replace(/my job is/i,"")
            .replace(/i am a/i,"")
            .trim();

        memory.job = job;

        localStorage.setItem("memory", JSON.stringify(memory));

        return "💼 I'll remember that you work as " + job + ".";

    }

    // Save Favorite Food
    if(
        msg.startsWith("my favorite food is ") ||
        msg.startsWith("i like to eat ")
    ){

        let food = text
            .replace(/my favorite food is/i,"")
            .replace(/i like to eat/i,"")
            .trim();

        memory.favoriteFood = food;

        localStorage.setItem("memory", JSON.stringify(memory));

        return "🍕 I'll remember that your favorite food is " + food + ".";

    }

    // Save Phone
    if(
        msg.startsWith("i use ") ||
        msg.startsWith("my phone is ")
    ){

        let phone = text
            .replace(/i use/i,"")
            .replace(/my phone is/i,"")
            .trim();

        memory.phone = phone;

        localStorage.setItem("memory", JSON.stringify(memory));

        return "📱 I'll remember that you use " + phone + ".";

    }

    // Recall Name
    if(
        msg.includes("what is my name") ||
        msg.includes("who am i")
    ){

        return memory.name
            ? "😊 Your name is " + memory.name + "."
            : "I don't know your name yet.";

    }

    // Recall Location
    if(
        msg.includes("where do i live") ||
        msg.includes("where am i from")
    ){

        return memory.city
            ? "📍 You live in " + memory.city + "."
            : "I don't know where you live yet.";

    }

    // Recall Job
    if(
        msg.includes("what is my job") ||
        msg.includes("where do i work")
    ){

        return memory.job
            ? "💼 You work as " + memory.job + "."
            : "I don't know your job yet.";

    }

    // Recall Food
    if(
        msg.includes("what is my favorite food") ||
        msg.includes("what food do i like")
    ){

        return memory.favoriteFood
            ? "🍕 Your favorite food is " + memory.favoriteFood + "."
            : "I don't know your favorite food yet.";

    }

    // Recall Phone
    if(
        msg.includes("what phone do i use") ||
        msg.includes("what is my phone")
    ){

        return memory.phone
            ? "📱 You use " + memory.phone + "."
            : "I don't know what phone you use yet.";

    }

    return null;

}
