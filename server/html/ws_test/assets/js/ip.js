  const ip = new WebSocket('ws://141.94.223.3:8080');

        ip.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const lines = data.content.split('\n');
        const publicIpLine = lines.find(line => line.includes('Public IP:'));
        if (publicIpLine) {
            const match = publicIpLine.match(/Public IP:\s*(.*)/);
        if (match) {
            document.getElementById('ip').innerHTML = '$connected to : ' + match[1];
        }
    }
        };

        ip.onerror = function(error) {
            console.error('Erreur WebSocket:', error);
        };

        ip.onclose = function() {
            console.log('Connexion WebSocket fermée.');
        };
