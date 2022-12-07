let WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function (ws) {
    console.log('客户端已连接');
	ws.onmessage = function(evt){
		wss.clients.forEach(function each(client){
			client.send(evt.data);
		});
		console.log(evt.data.length);
	}
});
