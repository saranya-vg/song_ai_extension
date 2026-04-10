const API_KEY = "your-api-key(openrouter.ai)";

async function callChatAPI(history) {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: [
                    { role: "system", content: "You are a music expert. Help the user analyze lyrics, translate them, and explain cultural context." },
                    ...history
                ]
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } catch (error) {
        return "Sorry, I'm having trouble connecting to the brain.";
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "CHAT_WITH_AI") {
        callChatAPI(request.history).then(result => sendResponse({ result }));
        return true;
    }
});