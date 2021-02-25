const Games = require('../game')

module.exports = {
    name: "move",
    handler: (socket, id, move) => {
        try {
            Games.move(socket, id, move);
        } catch (error) {
            console.log(error.message);
        }
    }
}