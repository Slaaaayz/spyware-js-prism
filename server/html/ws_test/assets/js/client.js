const imgElement = document.getElementById('liveImage');
const ws = new WebSocket('ws://141.94.223.3:8080/');

ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onmessage = function(event) {
    console.log('New image data received');
    imgElement.src = event.data;
};

ws.onerror = function(error) {
    console.error('WebSocket Error:', error);
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};
