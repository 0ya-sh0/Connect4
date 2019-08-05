import { GameController } from "./game_controller";
import "socket.io-client"
export class GameIO {
    socket: SocketIOClient.Socket;
    controller: GameController;
    gameId: string;
    constructor(controller: GameController) {
        this.gameId = getQueryVariable('id');
        this.socket = io();
        this.controller = controller;
        this.controller.io = this;
        this.socket.on('createGameR', (obj: any)=>{
            obj.id = this.gameId;
            this.controller.displayCreateMessage(obj);
        });
        this.socket.on('joinGameR', (obj: any)=>{
            obj.id = this.gameId;
            this.controller.displayJoinMessage(obj);
        });
        this.socket.on('startGame', (gameId, myId) => {
            this.controller.startGame(gameId, myId);
        });
        this.socket.on('moveR', (col)=>{
            this.controller.doMove(col);
        });
        this.socket.on('disconnect',this.controller.disconnect);
        this.socket.on('otherQuit',this.controller.otherQuit);
        this.socket.on('cheating', ()=>{
            alert('guyz listen, stop cheating ....');
        });
    }

    begin() {
        let created: string = getQueryVariable('created');
        if(created == 'true') {
            console.log('creating game...');
            this.socket.emit('createGame', this.gameId);
        } else {
            console.log('joining game...');
            this.socket.emit('joinGame', this.gameId);
        }
    }
}


function getQueryVariable(variable: string) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

