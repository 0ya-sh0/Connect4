const express = require('express');
const expressServer = express();

expressServer.get('/', function (req, res) {
	res.redirect('/home.html');
});
expressServer.use('/', express.static(__dirname + '/public/'));

const http = require('http');
const httpServer = http.Server(expressServer);
const { port } = require('./config.json');
const socketio = require('socket.io');

const io = socketio(httpServer);
io.on('connection', connectionHandler);

function connectionHandler(socket) {
	console.log('user connected ...');

	const CreateGame = require('./events/createGame');
	socket.on(CreateGame.name, (id) => CreateGame.handler(socket, id));

	const JoinGame = require('./events/joinGame');
	socket.on(JoinGame.name, (id) => JoinGame.handler(socket, id));

	const Move = require('./events/move');
	socket.on(Move.name, (id, move) => Move.handler(socket, id, move));

	const EndGame = require('./events/endGame');
	socket.on(EndGame.name, (id) => EndGame.handler(socket, id));

	const Disconnect = require('./events/disconnect');
	socket.on(Disconnect.name, (id) => Disconnect.handler(socket));
}

httpServer.listen(port, () => {
	console.log('listening...');
});
