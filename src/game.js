class Game {
    constructor(id, p1s) {
        this.gameId = id;
        this.p1s = p1s;
        this.p2s = null;
        this.isGameOn = false;
        p1s.gameId = this.gameId;
        this.state = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];
        this.moveCounter = 0;
        this.currentPlayer = 1;
    }

    startGame() {
        this.p2s.gameId = this.gameId;
        this.p1s.emit('startGame', this.gameId, 1);
        this.p2s.emit('startGame', this.gameId, 2);
        this.isGameOn = true;
        console.log(`starting game, id : ${this.gameId}`);
    }

    endGame() {
        console.log(`ending game, id : ${this.gameId}`);
        console.log(this.state);
        delete this.p1s.gameId;
        this.p1s.disconnect();
        delete this.p2s.gameId;
        this.p2s.disconnect();
    }

    doMove(move) {
        var i, rows = this.state.length;
        for (i = rows - 1; i >= 0; i--) {
            if (this.state[i][move] == 0) {
                this.state[i][move] = this.currentPlayer;
                break;
            }
        }
        this.moveCounter++;
        this.currentPlayer = (this.moveCounter % 2) + 1;
    }
}

const Games = new Map();

const createGame = (id, p1s) => {
    if (id == null || id == '') {
        throw new Error(`id cannot be null or empty`);
    }
    if (Games.has(id)) {
        throw new Error(`Game with id : ${id} already exists`);
    }
    Games.set(id, new Game(id, p1s));
    console.log(`new game created with id : ${id}`);
}

const joinGame = (id, p2s) => {
    if (id == null || id == '') {
        throw new Error(`id cannot be null or empty`);
    }
    if (!Games.has(id)) {
        throw new Error(`Game with id : ${id} does not exists`);
    }
    const game = Games.get(id);
    if (game.isGameOn) {
        throw new Error(`Game with id : ${id} is already started`);
    }
    if (game.p1s === p2s) {
        throw new Error(`Player already joined`);
    }
    game.p2s = p2s;
    game.startGame();
}

const endGame = (socket, id) => {
    if (!Games.has(id)) {
        throw new Error(`Game with id : ${id} does not exists`);
    }
    const game = Games.get(id);
    if (!game.isGameOn) {
        throw new Error(`Game with id : ${id} is not started`);
    }
    if (game.p1s != socket && game.p2s != socket) {
        throw new Error(`Socket does not belong to game : ${id}`);
    }
    game.endGame();
    Games.delete(id);
}

const move = (socket, id, move) => {
    if (!Games.has(id)) {
        throw new Error(`Game with id : ${id} does not exists`);
    }
    const game = Games.get(id);
    if (!game.isGameOn) {
        throw new Error(`Game with id : ${id} is not started`);
    }
    if (game.p1s != socket && game.p2s != socket) {
        throw new Error(`Socket does not belong to game : ${id}`);
    }
    console.log(`move recieved game id : ${id}, move : ${move}`);

    if (game.currentPlayer == 1 && socket == game.p2s) {
        game.p2s.emit('cheating');
        throw new Error(`game id : ${id}, cheating move by p2`);
    }

    if (game.currentPlayer == 2 && socket == game.p1s) {
        game.p1s.emit('cheating');
        throw new Error(`game id : ${id}, cheating move by p1`);
    }

    game.doMove(move);
    game.p1s.emit('moveR', move);
    game.p2s.emit('moveR', move);
}

const disconnect = (socket) => {
    const id = socket.gameId;
    if (!Games.has(id)) {
        return;
    }
    const game = Games.get(id);
    if (game.isGameOn) {
        if (game.p1s == socket) {
            game.p2s.emit('otherQuit');
            delete game.p2s.gameId;
            game.p2s.disconnect();
            Games.delete(id);
            console.log(`Game with id : ${id} closed, p1 left`);
        } else {
            game.p1s.emit('otherQuit');
            delete game.p1s.gameId;
            game.p1s.disconnect();
            Games.delete(id);
            console.log(`Game with id : ${id} closed, p2 left`);
        }
    } else {
        Games.delete(id);
        console.log(`Game with id : ${id} closed, it was not started`);
    }
}

module.exports = {
    createGame,
    joinGame,
    move,
    endGame,
    disconnect
}
