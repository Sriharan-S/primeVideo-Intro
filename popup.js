document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings (Removed 'muted')
    chrome.storage.local.get(['enabled', 'playAlways'], (result) => {
        document.getElementById('toggleEnabled').checked = result.enabled !== false; // Default true
        document.getElementById('toggleAlways').checked = result.playAlways !== false; // Default true
    });

    // Save settings when button clicked
    document.getElementById('saveBtn').addEventListener('click', () => {
        const enabled = document.getElementById('toggleEnabled').checked;
        const playAlways = document.getElementById('toggleAlways').checked;

        // Save only enabled/playAlways
        chrome.storage.local.set({ enabled, playAlways }, () => {
            // Close popup and reload current tab to see changes
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.reload(tabs[0].id);
                window.close();
            });
        });
    });
});