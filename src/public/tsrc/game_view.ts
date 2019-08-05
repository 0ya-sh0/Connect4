import { GameModel } from "./game_model";
import { SrvRecord } from "dns";

export class GameView  {
    msg: HTMLElement
    link: HTMLElement
    container1: HTMLElement
    container2: HTMLElement
    infoDiv: HTMLElement
    info: HTMLElement
    model: GameModel
    boardTable: HTMLTableElement
    buttonTable: HTMLTableElement
    onButtonClick: (buttonId: string) => void;
    constructor() {
        this.boardTable = <HTMLTableElement> document.getElementById("boardTable");
        this.buttonTable = <HTMLTableElement> document.getElementById("buttonTable")
        this.info = document.getElementById("info");
        this.infoDiv = document.getElementById("playerColor");
        this.msg = document.getElementById('msg');
        this.link = document.getElementById('link');
        this.container1 = document.getElementById('container1');
        this.container2 = document.getElementById('container2');
        this.container2.style.display = "none";
    }

    setMsg(content) {
        this.msg.innerHTML = content;
    }

    setLink(content) {
        this.link.innerHTML = content;
    }
    toggleContainers() {
        this.container1.style.display = "none";
        this.container2.style.display = "inherit";
    }


    constructTables() {
        let table = this.boardTable;
        for(let i=0;i<this.model.rows;i++){
            let row = table.insertRow(i);
            for(let j=0;j<this.model.coloumns;j++){
                let c = row.insertCell(j); 
                let d = document.createElement("div");
                d.id = i+","+j;
                d.className = "cell";
                c.appendChild(d);
            }
        }  
        table = this.buttonTable;
        let row = table.insertRow(0) ;
        for(let i=0;i<this.model.coloumns;i++){
            let c = row.insertCell(i);
            let d:HTMLButtonElement = document.createElement("button");
            //d.setAttribute("onclick","doMove("+i+")");
            d.addEventListener('click',(e)=>{
                let el:HTMLButtonElement = <HTMLButtonElement> e.target;
                console.log(el.id);
                this.onButtonClick(el.id)
            })
            d.className = "inputButton";
            d.id = "b"+i;
            c.appendChild(d);
        }
    }

    displayPlayerColor(){
        this.infoDiv.innerHTML = "Player 1 : "+ this.model.player1Color+"<br/>Player 2 : "+ this.model.player2Color ;
    }
    displayInfo(){
        let infoString;
        if(this.model.myId == this.model.currentPlayerId) {
            infoString = "Your turn";
            this.info.classList.add('blinking');
        }else {
                infoString = "Wait for other player"; 
                this.info.classList.remove('blinking');   
        }
        this.info.innerHTML = infoString;
    }

    changeColorOfCell(row: number, col: number) {
        let cellId: string = row+","+col;
        let color: string;
        if(this.model.currentPlayerId == 1){
            color = this.model.player1Color    
        }
        else{
            color = this.model.player2Color ;
        }
        let cell: HTMLElement = document.getElementById(cellId);
        cell.style.backgroundColor = color;
    }

    disableButton(buttonId: string) {
        let button: HTMLButtonElement = <HTMLButtonElement> document.getElementById(buttonId);
        button.disabled = true
    }
}
