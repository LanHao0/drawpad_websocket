var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

const WebSocket = require('ws');

const server = new WebSocket.Server({
    clientTracking: true,
    port: 8083
});

let drawHistory;

server.on('connection', function connection(ws) {
    console.log('server: receive connection.');

    ws.on('message', function incoming(message) {
        let data = JSON.parse(message);

        let split = data.split_character;
        data.clickX.push(data.clickX[data.clickX.length - 1]);
        data.clickY.push(data.clickY[data.clickY.length - 1]);
        data.brushSize.push(data.brushSize[data.brushSize.length - 1]);
        data.brushColor.push(data.brushColor[data.brushColor.length - 1]);
        data.dragging.push(1);
        data.end_draw.push(null);


        data = data.clickX + split +
            data.clickY + split +
            data.brushSize + split +
            data.brushColor + split +
            data.dragging + split +
            data.end_draw;

        drawHistory = data;

        server.clients.forEach(function (client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, function (err) {
                    err && console.log(err);
                });
            }
        });

    });

    ws.send(drawHistory);
});

module.exports = router;
