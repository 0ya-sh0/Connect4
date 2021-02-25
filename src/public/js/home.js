function createGame() {
    game = document.getElementById("gid").value;
    window.location.assign(`/game.html?id=${game}&created=true`);
}

function joinGame() {
    game = document.getElementById("gid").value;
    window.location.assign(`/game.html?id=${game}&created=false`);
}

function random() {
    document.getElementById("gid").value = Math.floor(Math.random() * 9999999) + 1;
}