
window.onload = message;

var socket = io();
var rows = parseInt(6);
var columns = parseInt(7);
var maxMoves = rows * columns;
var playerId = parseInt(1);
var moveCounter = parseInt(0);
var connect = 4;
var player1Color = "red";
var player2Color = "black";
var result;
var pid;
var gid;
var cellArray = [];
var created;
var toReload = true;
var isButtonClicked = false;

socket.on('disconnect', function () {
    //document.location.reload(true) 
    if (toReload)
        setTimeout(document.location.assign('/'), 1000);

});
socket.on('startGame', function (gi, pi) {
    pid = parseInt(pi);
    gid = gi;
    startGame();
});
socket.on('otherQuit', function () {
    alert('Other player quit game');
    document.location.assign('/');
});

socket.on('moveR', function (cid) {
    doMove1(parseInt(cid));
});

socket.on('cheating', () => {
    alert('guyz listen, stop cheating ....');
});

socket.on('createGameR', (obj) => {
    console.log(obj)
    if (obj.success == true) {
        document.getElementById('msg').innerHTML =
            `Created game, waiting for other player...`;
        document.getElementById('link').innerHTML =
            `<br>share link to invite : 
        ${window.location.origin}/game?id=${gid}&created=false`;
    } else {
        alert(obj.message);
        document.location.assign('/');
    }
});

socket.on('joinGameR', (obj) => {
    console.log(obj)
    if (obj.success == false) {
        alert(obj.message);
        document.location.assign('/');
    }
});

function getQueryVariable(variable) {
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

function message() {
    document.getElementById('container2').style.display = "none";
    created = getQueryVariable('created');
    gid = getQueryVariable('id');
    if (created == 'true') {
        document.getElementById('msg').innerHTML = 'creating game ....';
        socket.emit('createGame', gid);
    } else {
        document.getElementById('msg').innerHTML = 'joining game ....';
        socket.emit('joinGame', gid);
    }
}


function startGame() {
    document.getElementById('container1').style.display = "none"; document.getElementById('container2').style.display = "inherit";
    constructTables();
    displayInfo();
    displayPlayerColor();
}
function getInput() {
    var change = confirm("Do you want to customize board ?");
    if (!change) {
        alert("Using default settings");
        return;
    }
    alert("Enter Board's Dimensions");
    rows = parseInt(prompt("Enter board rows", 6));
    columns = parseInt(prompt("Enter board coloumns", 7));
    connect = parseInt(prompt("Enter how many coins of same color needed in a line to win ?", 4));
}
function constructTables() {

    for (var i = 0; i < rows; i++) {
        var innerArray = [];
        for (var j = 0; j < columns; j++) {
            innerArray[j] = 0;
        }
        cellArray[i] = innerArray;
    }
    //boardTable
    var table = document.getElementById("boardTable");
    for (var i = 0; i < rows; i++) {
        var row = table.insertRow(i);
        for (var j = 0; j < columns; j++) {
            var c = row.insertCell(j);
            var d = document.createElement("div");
            // d.setAttribute("class","cell") ;
            // d.setAttribute("className",i+","+j)
            d.id = i + "," + j;
            d.className = "cell";
            c.appendChild(d);
        }
    }

    //buttonTable
    table = document.getElementById("buttonTable");
    var row = table.insertRow(0);
    for (var i = 0; i < columns; i++) {
        var c = row.insertCell(i);
        var d = document.createElement("button");
        //d.setAttribute("class","inputButton");
        //d.setAttribute("className","b"+i);
        d.setAttribute("onclick", "doMove(" + i + ")");
        d.className = "inputButton";
        d.id = "b" + i;
        c.appendChild(d);
    }
}
function displayPlayerColor() {
    var infoDiv = document.getElementById("playerColor");
    infoDiv.innerHTML = "Player 1 : " + player1Color + "<br/>Player 2 : " + player2Color;
}
function displayInfo() {
    var infoDiv = document.getElementById("info");
    var infoString;
    if (pid == playerId) {
        infoString = "Your turn";
        infoDiv.classList.add('blinking');
    } else {
        infoString = "Wait for other player";
        infoDiv.classList.remove('blinking');
    }
    info.innerHTML = infoString;// "Player "+ playerId+" should play";
}
function doMove(colId) {
    if (playerId != pid || isButtonClicked)
        return;
    isButtonClicked = true;
    socket.emit('move', gid, colId);
}
function doMove1(colId) {
    var i;
    for (i = rows - 1; i >= 0; i--) {
        if (cellArray[i][colId] == 0) {
            cellArray[i][colId] = playerId;
            break;
        }
    }
    changeColorOfCell(i, colId);
    if (isGameComplete(parseInt(i), parseInt(colId))) {      // console.log("true"); 
        if (maxMoves <= moveCounter) {
            result = 0;
        }
        else {
            result = playerId;
        }
        gameCompleted();
        return;
    }
    //console.log("false");
    moveCounter++;
    playerId = moveCounter % 2 + 1;
    isButtonClicked = false;
    displayInfo();
}
function disableButton(buttonId) {
    var button = document.getElementById(buttonId);
    button.disabled = true;
}
function changeColorOfCell(row, col) {
    var cellId = row + "," + col;
    var color;
    if (playerId == 1) {
        color = player1Color
    }
    else {
        color = player2Color;
    }
    var cell = document.getElementById(cellId);
    cell.style.backgroundColor = color;
    if (row === 0) {
        disableButton("b" + col);
    }
}
//functions for isGameComplete checking
/*
integer values for direction
1   2   3
8  cell 4
7   6   5
*/
function getCoinsCountInDir(r, c, dir) {
    var player = parseInt(cellArray[r][c]);
    var count = 0;
    var changeCol;
    var changeRow;
    switch (dir) {
        case 1:
            changeCol = -1; changeRow = -1;
            break;
        case 2:
            changeCol = 0; changeRow = -1;
            break;
        case 3:
            changeCol = 1; changeRow = -1;
            break;
        case 4:
            changeCol = 1; changeRow = 0;
            break;
        case 5:
            changeCol = 1; changeRow = 1;
            break;
        case 6:
            changeCol = 0; changeRow = 1;
            break;
        case 7:
            changeCol = -1; changeRow = 1;
            break;
        case 8:
            changeCol = -1; changeRow = 0;
            break;
    }
    r += changeRow;
    c += changeCol;
    while (r >= 0 && r < rows && c >= 0 && c < columns) {
        if (player == parseInt(cellArray[r][c])) {
            count++;
            r += changeRow;
            c += changeCol;
        }
        else {
            break;
        }
    }
    return count;
}
function isGameComplete(row, col) {
    if (getCoinsCountInDir(row, col, 1) + getCoinsCountInDir(row, col, 5) >= connect - 1) {
        return true;
    }
    else if (getCoinsCountInDir(row, col, 2) + getCoinsCountInDir(row, col, 6) >= connect - 1) {
        return true;
    }
    else if (getCoinsCountInDir(row, col, 3) + getCoinsCountInDir(row, col, 7) >= connect - 1) {
        return true;
    }
    else if (getCoinsCountInDir(row, col, 4) + getCoinsCountInDir(row, col, 8) >= connect - 1) {
        return true;
    }
    else if (moveCounter >= maxMoves) {
        return true;
    }
    else
        return false;
}
function gameCompleted() {
    var resultString;
    if (result === 0) {
        resultString = "Its a Tie";
    }
    else {
        resultString = "Player " + result + " Wins!";
    }
    var infoDiv = document.getElementById("info");
    infoDiv.innerHTML = resultString;
    for (var i = 0; i < columns; i++) {
        disableButton("b" + i);
    }
    if (pid == 1) {
        socket.emit('endGame', gid)
    }
    toReload = false
    //document.location.reload(true);
}
