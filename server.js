const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // 广播消息给所有连接的客户端
        wss.clients.forEach(function each(client) {
            if (client!== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});