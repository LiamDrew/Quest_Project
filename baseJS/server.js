//all the imports for servers and sockets;
var express = require('express');
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path')

//functionality I want to add:
//when a key is released, only cancel that key input, not the entire move input.
//fix whatever the hyperspace thing is
//defnitely a server side problem

//this is an array for all active socket connections. Contains both user ids and socket ids
var connections = [];
//counts how many users are connected to assign user ids.
var counter = 0;

//game settings determined here and sent to clients
//clients cant be trusted, so we determine this here
let gameSettings = {
  // this stuff is self explanatory
  canvasWidth: 700,
  canvasHeight: 700,
  playerWidth: 25,
  playerHeight: 25,
  //the send interval determines how ofter i emit basic game information to all users
  //this is slowed down for development purposes, but when finalized this will be 16 milliseconds
  sendInterval: 16 //in milliseconds
}

//this is the queue object that I emit with the send interval frequency
//this is all the stuff that changed, and the client needs to render it


let queue = {
  player: [],
  key: [],
  action: []
  // movePlayer: [],
}





//gets username from socket id
// this makes things easy for the socket functions
function getNameFromId(id){for (let i = 0; i < connections.length; i++){if (id == connections[i][1]){return connections[i][0]}}}

function keyInList(list, keycode){
  if (list != undefined){
    for (let p = 0; p< list.length; p++){
      //same key cant be pressed twice
      if (list[p] == keycode){
        //do nothing
        return true
      }
    }

  }
  return false
}
//gets game.js and html files
//this is done for local host, not the sockets
//this is a basic server getting these files on client load
app.get('/', function(req, res){
  console.log('getting')
  res.sendFile(__dirname + '/src/gamepage.html');
  app.use(express.static(path.join(__dirname, 'src')))
});

//this io.on function runs whenever a new socket is connected.
io.on('connection', function(socket){
  //checking sockets
  console.log(`new connection ${socket.id}$`)
  //this emits the game settings to the clients
  //this is the first thing that runs, just so clients can set up the Canvas
  socket.emit('getGameSettings', gameSettings)

  console.log('USER CONNECTED')
  console.log(connections.length)

  //I put the socket id in an array with the userId. User id is for the players and game, socket id is for the socket disconnect
  connections.push(['user'+counter.toString(), socket.id])
  //adds one to the counter when a new user connects so the next user gets a different id
  counter +=1



  //sends the client its own user name
  socket.emit('sendClientUsername', connections.slice(-1)[0][0])
  //logs the last user to connect
  // console.log(connections.slice(-1)[0][0])

  //if there are already players in the game, these player id's are sent to the newly connected player.
  if (connections.length > 1){
    socket.emit('allExistingPlayers', connections)
  }

  //once this new player recieves its player id, the server sends this id to all the other players in the game so they know a next player joined
  socket.on('sendingNewPlayer', function(user){
    console.log('New Player Broadcasted')
    socket.broadcast.emit('broadcastingNewPlayer', user)
  })
//when a player disconnects, the server removes the player from the player list.
//the server also emits the username of the disconnected player so the client can stop rendering them
  socket.on('disconnect', function(){
    console.log('PLAYER DISCONNECTED')
    connections.forEach((element, index) => {
      if (element[1] == socket.id){
        socket.broadcast.emit('playerDisconnected', connections[index][0]);
        connections.splice(index, 1);
        for (let p = 0; p <queue.action.length; p++){
          if (getNameFromId(socket.id) == queue.action[p]){
            queue.action.splice(p, 1);
            queue.key.splice(p, 1)
          }
        }

      }
    })
  });


//this appears to work, so now I need to figure out how to cancel moves
  socket.on('requestingMove', function(keycode){
    console.log(getNameFromId(socket.id), 'is requesting to MOVE', keycode)

    //if no moves exist
    if (queue.action.length == 0){
      //request move
      queue.action.push(getNameFromId(socket.id));
      queue.key.push([keycode])
      console.log('First Player Acting')
    }


    else if (queue.action.length > 0){
      //if moves already exist:
      //search existing moves
      for (let i = 0; i<queue.action.length; i++){
        console.log('action length', queue.action.length)
        //if player name is already in the action queue

        if (getNameFromId(socket.id) == queue.action[i]){
          console.log('Player is already in  queue')
          //check existing keys
          //this for loop searches through the keys list for that particular player
          if (keyInList(queue.key[i], keycode) == false){
            console.log('New Key has been pressed')
            queue.key[i].push(keycode)
          }

          else if (keyInList(queue.key[i], keycode) == true){
            console.log('Key is already in queue')
            //do nothing to avoid having the same function called multiple times
          }
        }

      }

      if (queue.action.includes(getNameFromId(socket.id)) == false){
        // console.log('NEW player acting')
        queue.action.push(getNameFromId(socket.id));
        queue.key.push([keycode])
      }

    }

  })

  socket.on('requestingStop', function(keycode){
    name = getNameFromId(socket.id)
    console.log(name, 'is requesting to stop', keycode)
    for (let i =0; i <queue.action.length; i++){
      //making sure the player is in the action queue
      if (name == queue.action[i]){
        let al = queue.key[i].length
        //search all keys in the queue
        for (let k = 0; k < al; k++){
          if (queue.key[i][k] == keycode){
            queue.key[i].splice(k, 1)
            if (queue.key[i].length == 0){
              queue.key.splice(i, 1)
              queue.action.splice(i, 1)
            }
          }
        }
      }
    }
  })

  setInterval(()=>{
    for (let i = 0; i < connections.length; i++){
      queue.player.push(connections[i][0])
    }
    // console.log('interval firing')
    // console.log('outbound queue', queue)
    io.emit('sendingData', queue)
    queue.player = [];

  }, gameSettings.sendInterval);
});


http.listen(8000, function(){
  console.log('listening on *:8000');
});
