const Games = require('../game')

module.exports = {
    name: "endGame",
    handler: (socket, id) => {
        try {
            Games.endGame(socket, id);
        } catch (error) {
            console.log(error.message);
        }
    }
}