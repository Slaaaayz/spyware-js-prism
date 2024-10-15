<?php
session_start();

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: connexion.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/css/style.css">
    <title>Prism - Monitoring</title>
</head>
<body>
<div class="connection">
    <p id="ip">Waiting for IP resolving...</p>
</div>

<div class="containerDirect">
    <img src="" id="liveImage"alt="">
    <a href="#" id="link">Links</a>
</div>

<div id="popup" class="popup">
    <div class="popup-content">
        <span class="close">&times;</span>
        <div id="info"></div>
    </div>
</div>

<script src="./assets/js/script.js"></script>
<script src="./assets/js/ip.js"></script>
<script src="./assets/js/message.js"></script>
<script src="./assets/js/client.js"></script>
</body>
</html>
