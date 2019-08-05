import { GameModel } from "./game_model";
import { GameView } from "./game_view";
import { GameIO } from "./game_io";

export class GameController {
    model: GameModel
    view: GameView
    io: GameIO
    toReload: boolean;
    isButtonClicked: boolean;
    constructor(view: GameView) {
        this.isButtonClicked = false;
        this.toReload = true;
        this.view = view;
        this.onButtonClick = this.onButtonClick.bind(this);
        this.otherQuit = this.otherQuit.bind(this);
        this.disconnect = this.disconnect.bind(this);
    }

    otherQuit() {
        alert('Other player quit game');
        document.location.assign('/');
    }

    disconnect() {
        if(this.toReload) {
            document.location.assign('/');
        }
    }

    displayCreateMessage(obj : any) {
        if(obj.success == true) {
            this.view.setMsg(`Created game, waiting for other player...`);
            this.view.setLink(
                `<br>share link to invite : 
                ${window.location.origin}/game?id=${obj.id}&created=false`
            );
        } else {
            alert(obj.message);
            document.location.assign('/');
        }
    }

    displayJoinMessage(obj : any) {
        console.log(obj)
        if(obj.success == false) {
            alert(obj.message);
            document.location.assign('/');
        }
    }

    startGame(gameId: string, myId: number) {
        console.log(`starting game.. ${gameId} ${myId}`);
        this.model = new GameModel(gameId);
        this.model.myId = myId;
        this.model.currentPlayerId = 1;
        this.view.model = this.model;
        this.view.onButtonClick = this.onButtonClick;
        this.view.toggleContainers();
        this.view.constructTables();
        this.view.displayInfo();
        this.view.displayPlayerColor();
    }

    onButtonClick(buttonId: string) {
        let row: number = parseInt(buttonId[1]); 
        if(this.model.currentPlayerId != this.model.myId || this.isButtonClicked) {
            return; 
        }
        this.isButtonClicked = true;
        this.io.socket.emit('move',this.model.gameId, row);
    }

    doMove(col: number) {
        let i:number;
        for(i=this.model.rows-1;i>=0;i--){
            if(this.model.state[i][col]==0){
                this.model.state[i][col] = this.model.currentPlayerId; 
                break ;
            }
        }
        if(i == 0) {
            this.view.disableButton("b"+col);
        }
        this.view.changeColorOfCell(i,col);
        if(this.isGameComplete(i,col)) { 
            if(this.model.maxMoves<= this.model.moveCounter){
                this.model.result = 0;
            }
            else {
                this.model.result = this.model.currentPlayerId; 
            }
            this.gameCompleted();
            return ;
        }
        this.model.moveCounter++;
        this.model.currentPlayerId = this.model.moveCounter%2+1;
        this.isButtonClicked = false;
        this.view.displayInfo();
    }

    gameCompleted() {
        let resultString: string;
        if(this.model.result===0){
            resultString = "Its a Tie";
        }  
        else{
            resultString = "Player "+this.model.result+" Wins!";
        }  
        this.view.info.innerHTML = resultString;
        if(this.model.myId = this.model.result) {
            this.view.info.classList.add('blinking');
        }
        for(var i=0;i<this.model.coloumns;i++){
            this.view.disableButton("b"+i);
        }
        if(this.model.myId == 1) {
            this.io.socket.emit('endGame',this.model.gameId)
        }
        this.toReload = false;
    }

    isGameComplete(row: number, col: number):boolean {
        let connect: number = 4;
        if(this.getCoinsCountInDir(row,col,1)+ this.getCoinsCountInDir(row,col,5)>= connect-1){
            return true ;
        }  
        else if(this.getCoinsCountInDir(row,col,2)+ this.getCoinsCountInDir(row,col,6)>= connect-1){
            return true ;
        }
        else if(this.getCoinsCountInDir(row,col,3)+ this.getCoinsCountInDir(row,col,7)>= connect-1){
            return true ;
        }  
        else if(this.getCoinsCountInDir(row,col,4)+ this.getCoinsCountInDir(row,col,8)>= connect-1){
            return true ;
        }  
        else if(this.model.moveCounter>= this.model.maxMoves){
            return true ;
        }
        else
        return false ;
    }
    
    getCoinsCountInDir(r: any, c: any, dir: number): number {
        let player: number = this.model.state[r][c];
        let count: number = 0;
        dir -= 1;
        let dirRow: number[] = [-1,-1,-1,0,1,1,1,0];
        let dirCol: number[] = [-1,0,1,1,1,0,-1,-1];
        let changeCol: number = dirCol[dir];
        let changeRow: number = dirRow[dir];

        r += changeRow ;
        c += changeCol ; 

        while(r>=0&&r<this.model.rows&&c>=0&&c<this.model.coloumns){
        if(player == this.model.state[r][c]){
                count++;
                r += changeRow ;
                c += changeCol ; 
            }
            else{
                break ;
            }
        }
        return count;
    }
}



