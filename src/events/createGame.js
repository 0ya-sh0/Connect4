const Games = require('../game');

module.exports = {
    name: "createGame",
    handler: (socket, id) => {
        try {
            Games.createGame(id, socket);
            socket.emit('createGameR', { success: true, message: "" });
        } catch (error) {
            console.log(error.message);
            socket.emit('createGameR', { success: false, message: error.message });
        }
    }
}