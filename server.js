
var express = require("express");
var path = require("path")
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');

app.use(session({secret: 'codingdojorocks'}));  // string for encryption
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.get('/', function (req, res){
	if(!req.session.Data){
		req.session.Data = {};
	}
	console.log(__dirname);
  	res.render('index', {});
})

app.post('/process', function (req, res){
	req.session.data = req.body;
  	res.redirect('/result');
})

app.get('/result', function (req, res){
  	res.render('result',{data: req.session.data})
})

// Tell the express app to listen on port 8000
var server = app.listen(8000, function() {
  console.log("listening on port 8000");
})
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log("Client/socket is connected!");
  console.log("Client/socket id is: ", socket.id);

socket.on( "posting_form", function (data){
    console.log( "You emitted the following information to the server: "  + data.name + " " + data.location + " " + data.language + " " + data.message);
    socket.emit( "random_number", {random_number:  Math.floor(Math.random()*1000)+1});
    socket.emit( "updated_message", {response: data});
})
})
