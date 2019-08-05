export class GameModel {
    rows: number
    coloumns: number
    maxMoves: number
    gameId: string
    state: number[][]
    moveCounter: number
    player1Color: string
    player2Color: string
    myId: number
    currentPlayerId: number
    result: number;
    constructor(id: string) {
        this.rows = 6;
        this.coloumns = 7;
        this.maxMoves = this.coloumns * this.rows;
        this.gameId = id;
        this.state = [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ];
        this.moveCounter = 0;
        this.player1Color = "red";
        this.player2Color = "black";
    }
}
