const Games = require('../game')

module.exports = {
    name : "disconnect",
    handler : (socket) => {
        if(socket.gameId != undefined){        
            Games.disconnect(socket);
        } else {
            console.log('user disconnected ...');
        }	
    }
}