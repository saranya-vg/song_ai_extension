function getLyrics() {
    // Priority 1: User highlighted text
    const selectedText = window.getSelection().toString();
    if (selectedText && selectedText.trim().length > 5) {
        return selectedText.trim();
    }

    // Priority 2: Look for common lyric containers (optional but helpful)
    const lyricContainer = document.querySelector(".lyrics, .song-lyrics, #lyrics");
    if (lyricContainer) return lyricContainer.innerText;

    // Priority 3: Fallback to body text
    return document.body ? document.body.innerText.substring(0, 5000) : null; 
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_LYRICS") {
        sendResponse({ lyrics: getLyrics() });
    }
});