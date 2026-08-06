// ==========================================
// Upload Brain
// Version 1.0
// ==========================================

function uploadReply(msg){

    msg = msg.toLowerCase().trim();

    if(typeof uploadedFiles === "undefined"){
        return null;
    }

    if(uploadedFiles.length === 0){
        return null;
    }

    const lastFile = uploadedFiles[uploadedFiles.length - 1];

    // --------------------------
    // Image Commands
    // --------------------------

    if(lastFile.type === "image"){

        if(msg.includes("describe")){

            return "🖼️ Image description is coming soon. AI Vision is not connected yet.";

        }

        if(msg.includes("read text")){

            return "📝 OCR (Read Text) is coming soon.";

        }

        if(msg.includes("analyze")){

            return "🔍 Image analysis is coming soon.";

        }

        if(msg.includes("question")){

            return "❓ Image question answering will be available after AI Vision is connected.";

        }

    }

    // --------------------------
    // File Commands
    // --------------------------

    if(lastFile.type === "file"){

        if(msg.includes("summarize")){

            return "📑 File summarization is coming soon.";

        }

        if(msg.includes("explain")){

            return "🧠 File explanation is coming soon.";

        }

        if(msg.includes("important")){

            return "🔍 Important information extraction is coming soon.";

        }

        if(msg.includes("question")){

            return "❓ File question answering is coming soon.";

        }

    }

    return null;

}
