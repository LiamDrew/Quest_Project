var express = require('express');
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path')
// var gamecode = require('/game.js')


app.get('/', function(req, res){
  console.log('getting')
  res.sendFile(__dirname + '/src/other.html');
  app.use(express.static(path.join(__dirname, 'src')))

  // res.sendFile(__dirname + '/game.js')
  // res.send(test)
});


// io.on('connection', function(socket){
//   socket.broadcast.emit('hi');
//   console.log('a user connected');
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//     console.log('message: ' + msg);
//   });
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });
//
//


http.listen(8000, function(){
  console.log('listening on *:8000');
});
