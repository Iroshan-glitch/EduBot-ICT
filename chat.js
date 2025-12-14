const sendBtn = document.querySelector('input[type="button"]');
const userMsg = document.getElementById('msg');
const chatBox = document.querySelector('.chat');

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
    let message = userMsg.value.trim();
    if (message === "") return;

    addMessage("You", message);
    userMsg.value = "";

    // FIRST : Check if message is related to ICT
    if (!isICTRelated(message)) {
        addMessage("Bot", "❌ Sorry, I can answer only ICT-related questions.");
        return;
    }

    callAPI(message);
}

// FUNCTION: Add message to chat window
function addMessage(sender, text) {
    const div = document.createElement("div");

    if (sender === "You") {
        div.className = "msg user-msg";
    } else {
        div.className = "msg bot-msg";
    }

    div.innerHTML = `<span>${text}</span>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// FUNCTION: Check ICT related content
function isICTRelated(text) {
    const keywords = [
        "computer", "ict", "information", "technology", "network",
        "programming", "code", "software", "hardware", "database",
        "algorithm", "logic", "ai", "web", "html", "css", "java",
        "c#", "python", "system", "it", "internet", "security"
    ];

    text = text.toLowerCase();

    return keywords.some(word => text.includes(word));
}


// FUNCTION: Send request to ChatGPT API
async function callAPI(question) {
    const API_KEY = "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";

    addMessage("Bot", "⏳ Thinking...");

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful AL ICT chatbot. Answer only ICT-related questions." },
                    { role: "user", content: question }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        addMessage("Bot", reply);

    } catch (error) {
        addMessage("Bot", "⚠️ Error connecting to ChatGPT API.");
        console.error(error);
    }
}
