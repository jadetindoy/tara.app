const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        let data = JSON.parse(message);

        switch(data.type) {
            case 'register':
                clients[data.clientId] = ws;
                break;
            case 'offer':
                if (clients[data.targetId]) {
                    clients[data.targetId].send(JSON.stringify({
                        type: 'offer',
                        sdp: data.sdp,
                        clientId: data.clientId
                    }));
                }
                break;
            case 'answer':
                if (clients[data.targetId]) {
                    clients[data.targetId].send(JSON.stringify({
                        type: 'answer',
                        sdp: data.sdp,
                        clientId: data.clientId
                    }));
                }
                break;
            case 'candidate':
                if (clients[data.targetId]) {
                    clients[data.targetId].send(JSON.stringify({
                        type: 'candidate',
                        candidate: data.candidate,
                        clientId: data.clientId
                    }));
                }
                break;
        }
    });

    ws.on('close', () => {
        for (let clientId in clients) {
            if (clients[clientId] === ws) {
                delete clients[clientId];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
