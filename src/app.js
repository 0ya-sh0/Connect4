const express = require('express')
const app = express();

app.get('/', function(req, res) {
	res.redirect('/home');
});
app.get('/home',function(req,res){
	res.sendFile(__dirname + '/public/views/home.html');
});
app.get('/game',function(req,res){
	res.sendFile(__dirname + '/public/views/game.html');
});

app.use('/styles', express.static(__dirname + '/public/styles'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/tdist', express.static(__dirname + '/public/tdist'));

module.exports = app;