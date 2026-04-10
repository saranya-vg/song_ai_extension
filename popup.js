let chatHistory = [];

const appendMessage = (role, text) => {
    const container = document.getElementById("chat-container");
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${role === 'user' ? 'user-msg' : 'ai-msg'}`;
    msgDiv.innerText = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
};

const processChat = async (text, isFirstAnalysis = false) => {
    const loader = document.getElementById("loader");
    const chatInterface = document.getElementById("chat-interface");
    const setupArea = document.getElementById("setup-area");

    loader.style.display = "block";
    
    // If it's the first time, hide the big button and show the chat box
    if (isFirstAnalysis) {
        setupArea.style.display = "none";
    } else {
        appendMessage("user", text);
    }
    
    chatHistory.push({ role: "user", content: text });

    chrome.runtime.sendMessage({ action: "CHAT_WITH_AI", history: chatHistory }, (res) => {
        loader.style.display = "none";
        chatInterface.style.display = "block"; // Reveal chat after first response

        if (res && res.result) {
            appendMessage("ai", res.result);
            chatHistory.push({ role: "assistant", content: res.result });
        } else {
            appendMessage("ai", "Sorry, I couldn't process that. Try again!");
        }
    });
};

// The "Analyze" button logic
document.getElementById("analyze").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab) return;

        chrome.tabs.sendMessage(tab.id, { action: "GET_LYRICS" }, (response) => {
            if (chrome.runtime.lastError) {
                alert("Please refresh the music page and try again.");
                return;
            }

            if (response && response.lyrics) {
                processChat(`Please analyze these lyrics, translate if necessary, and explain the mood:\n\n${response.lyrics}`, true);
            } else {
                alert("No lyrics detected. Try highlighting the text manually!");
            }
        });
    });
});

// Follow-up question logic
document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("user-input");
    if (input.value.trim()) {
        processChat(input.value);
        input.value = "";
    }
});

// Allow "Enter" key to send messages
document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("send-btn").click();
    }
});