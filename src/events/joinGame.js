const Games = require('../game')

module.exports = {
    name: "joinGame",
    handler: (socket, id) => {
        try {
            Games.joinGame(id, socket);
            socket.emit('joinGameR', { success: true, message: "" });
        } catch (error) {
            console.log(error.message);
            socket.emit('joinGameR', { success: false, message: error.message });
        }
    }
}