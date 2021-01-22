var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

const WebSocket = require('ws');

const server = new WebSocket.Server({
    clientTracking: true,
    port: 8080
});

let drawHistory;

server.on('connection', function connection(ws) {
    console.log('server: receive connection.');

    ws.on('message', function incoming(message) {
        console.log(message)
        drawHistory = message;

        server.clients.forEach(function (client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message, function (err) {
                    err && console.log(err);
                });
            }
        });

    });

    ws.send(drawHistory);
});

module.exports = router;
