var express = require('express');
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path')
var connections = [];
var allPlayers = []
var counter = 1;

app.get('/', function(req, res){
  console.log('getting')
  res.sendFile(__dirname + '/src/other.html');
  app.use(express.static(path.join(__dirname, 'src')))

  // res.sendFile(__dirname + '/game.js')
  // res.send(test)
});

// io.on('connection', function(socket){
//   console.log('a player connected');
//   socket.on('coordinates', function(coords){
//     io.emit('my coords', coords);
//     console.log('a player' + coords)
//   })
// })

io.on('connection', function(socket){
  console.log('USER CONNECTED')
  console.log(connections.length)
  if (connections.length == 0){
    connections.push('user0')
  }
  else if (connections[0] == 'user0'){
    connections.push('user'+counter.toString())
    counter +=1;
  }
  socket.emit('sendClientUsername', connections.slice(-1)[0])
  console.log(connections.slice(-1)[0])

  if (connections.length > 1){
    socket.emit('allExistingPlayers', connections)
  }

  socket.on('sendingNewPlayer', function(user){
    console.log('New Player BroadCasted')
    socket.broadcast.emit('broadcastingNewPlayer', user)
  })

  socket.on('playerMoved', function(coords){
    console.log('message: ' + coords);
    socket.broadcast.emit('newPlayerCoords', coords);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});



http.listen(8000, function(){
  console.log('listening on *:8000');
});
