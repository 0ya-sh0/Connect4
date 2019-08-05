const socketio = require('socket.io');

module.exports = (http) => {
    const io = socketio(http);
    io.on('connection', connectionHandler);   
}

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
