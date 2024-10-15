  const socket = new WebSocket('ws://141.94.223.3:8080/');

        socket.onopen = function() {
            console.log('WebSocket connection established');
        };

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            document.getElementById('info').innerHTML = data.content;
        };

        socket.onerror = function(error) {
            console.error('WebSocket Error:', error);
        };

        socket.onclose = function() {
            console.log('WebSocket connection closed');
            document.getElementById('info').innerHTML = 'WebSocket connection closed';
        };

