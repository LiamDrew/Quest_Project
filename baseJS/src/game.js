class Canvas {
  constructor(ctx) {this.ctx = ctx};
  drawBoard() {
    //clears frame every time
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw game outline
    let screenWidth = canvas.width;
    let screenHeight = canvas.height;
    let topMargin = 0;
    //easily changed
    let gridSize = 25;
    //horizontal lines
    for (let i = 0; i < screenHeight; i++){
      ctx.beginPath();
      ctx.moveTo(0, (topMargin+(i*gridSize)));
      ctx.lineWidth = 0.3;
      ctx.lineTo(screenWidth, (topMargin+(i*gridSize)));
      ctx.stroke();
    }
    //vertical lines
    for (let i = 0; i< screenWidth; i++){
      ctx.beginPath();
      ctx.moveTo(i*gridSize, topMargin);
      ctx.lineWidth = 0.3;
      ctx.lineTo(i*gridSize, screenHeight);
      ctx.stroke();
    }
    //border grid
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.rect(0, topMargin, screenWidth, screenHeight-1);
    ctx.moveTo(0, screenHeight);
    ctx.lineTo(screenWidth, screenHeight);
    ctx.stroke();
  }

}

let myCanvas = new Canvas(ctx);

//at the moment, this doesn't do anything
//this is extra structure that I don't yet need but might want
class Component {
  constructor(ctx, name, xcoord, ycoord, color, dimensions){
    this.ctx = ctx;
    this.name = name;
    this.xcoord = xcoord;
    this.ycoord = ycoord;
    this.dimensions = dimensions;
    this.color = color}
}

class Player extends Component{
  //lots of stuff will need to be added to this (maybe)
  constructor(ctx, xcoord, ycoord, dimensions, color, canvas, name){
    super(ctx, name, xcoord, ycoord, color, dimensions);
    this.time = 0;
    this.canvas = canvas;
  }
  //for debugging purposes
  isProperty(){console.log('I am a property that can be called')}

  moveTo(x, y){
    this.xcoord = x;
    this.ycoord = y;
    myCanvas.drawBoard();
    this.drawPlayer()
    return [this.xcoord, this.ycoord];
  }

  //move methods

  //planning on making a new move method instead of an old one
  moveDirection(angle){
    for (let i = 0; i<2; i++){
      if (angle == 0){this.ycoord -=1}
      else if (angle == 180){this.ycoord +=1}
      else if (angle == 90){this.xcoord +=1}
      else if (angle == 270){this.xcoord -=1}
    }
    myCanvas.drawBoard();
    this.drawPlayer();
    return [this.xcoord, this.ycoord];
  }

  // move2Direction(isHorizontal, posNeg){
  //   // console.log('function called')
  //   var self = this;
  //   //isHorizontal for horizontal vs vertical: true = x, false =y
  //   //posNeg for direction: 1 is positive (down, right), -1 is negative (up, left). Also determines speed.
  //
  //   //time cancels the loop automatically and reruns it
  //   this.time +=1;
  //
  //
  //   for (let i=0; i<2; i++){
  //     if (isHorizontal===true){this.xcoord +=posNeg}
  //     else if (isHorizontal === false){this.ycoord +=posNeg}};
  //   myCanvas.drawBoard();
  //   // for (let p; p< existingPlayers.length; p++){
  //   //   existingPlayers[p].drawPlayer();
  //   // }
  //   this.drawPlayer()
  //   return [this.xcoord, this.ycoord];
  // }

  drawPlayer(){
    ctx.beginPath();
    //draws "player"
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xcoord, this.ycoord, this.dimensions[0], this.dimensions[1]);
    ctx.stroke();
  }

  requestMove(keycode){
      socket.emit('requestingMove', keycode)
  }

  requestStop(keycode){
    socket.emit('requestingStop', keycode)
  }

}

function drawAllPlayers(players){for (let i = 0; i<players.length; i++){players[i].drawPlayer()}}



var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

var socket = io();

let myUsername;
let player1;
let existingPlayers = [];
let gameSettings;
let playerDimensions;

let toRender = {
  player: [],
  key: [],
  action: [],
  angle: []
  // movePlayer: []

}
let otherPlayer;

function getPlayerbyName(name){for (let i =0; i< existingPlayers.length; i++){if (name ==existingPlayers[i].name){return existingPlayers[i]}}}

function checkIfMe(user){if (user == myUsername){return true}}
//all this socket stuff takes care of the protocols when players leave and join

socket.on('getGameSettings', function(input){
  gameSettings=input;
  playerDimensions = [gameSettings.playerWidth, gameSettings.playerHeight];
  // otherPlayer = new Player(ctx, 100, 100, playerDimensions, 'brown', myCanvas, 'testplayer');
  canvas.width = gameSettings.canvasWidth;
  canvas.height = gameSettings.canvasHeight;
  myCanvas.drawBoard();
})

socket.on('sendClientUsername', function(user){
  console.log(user)
  myUsername = user;
  //this player is me
  existingPlayers.push(new Player(ctx, 200, 300, playerDimensions, 'green', myCanvas, myUsername));
  player1 = existingPlayers.slice(-1)[0];
  socket.emit('sendingNewPlayer', user);
})

socket.on('allExistingPlayers', function(connections){
  for (let i=0; i<connections.length; i++){
    console.log('connectsion[i]', connections[i])
    if (connections[i][0] == myUsername){console.log('do nothing, this is me')}

    else{existingPlayers.push(new Player(ctx, 400, 400, playerDimensions, 'black', myCanvas, connections[i][0]))}
  }
  console.log('ALL EXISTING PLAYERS HAVE BEEN LOADED')
})

socket.on('broadcastingNewPlayer', function(user){
  existingPlayers.push(new Player(ctx, 300, 250, playerDimensions, 'orange', myCanvas, user));
  console.log('A NEW PLAYER HAS JOINED')
})

socket.on('playerDisconnected', function(user){
  existingPlayers.forEach((element, index, array) => {
    if (element.name[0]==user){
      console.log( `${user} HAS DISCONNECTED`)
      existingPlayers.splice(index, 1);
    }
  })
})

window.addEventListener(event="keydown", function(e){
  //idk if i need to worry about repeating
  if (e.repeat == true){return true};
  let keycode = e.keyCode;
  player1.requestMove(keycode)
})

window.addEventListener(event="keyup", function(e){
  let keycode = e.keyCode;
  player1.requestStop(keycode);
})

socket.on('sendingData', function(queue){
  //this for loop converts the user id recieved from the server and converts it into its corresponding instance of the player class
  // toRender.player = [];
  // for (let i = 0; i<queue.player.length; i++){toRender.player.push(getPlayerbyName(queue.player[i]))}

  // toRender.player.push(getPlayerbyName(queue.player))
  toRender.key = []
  toRender.key.push(queue.key)
  // console.log(toRender.key)
  // toRender.angle = []
  // toRender.angle.push(queue.angle);
  // console.log(toRender.angle)

  toRender.action = [];
  toRender.action.push(queue.action)
  // render()
})

//this function can be configurable depending on if I choose WASD or arrows
//it gets the move angle from the keycode
//at the moment, my players can only move one direction at a time
//I doubt the problem is here, but is possible
// BUG:

//use this
function getAngleFromKey(key){
  switch (key) {
    case 39:
      return 90;
      break;

    case 37:
      return 270
      break;

    case 38:
      return 0;
      break;

    case 40:
      return 180;
      break;

    default:
      return false
  }
}

//use this

//needs to get updated
function animate(){
  // console.log('animating')
  if ((toRender.action[0] != undefined)){
    //if there are any actions to execute
    if (toRender.action[0][0] != undefined){
      //parses through actions
      for (let i = 0; i < toRender.action[0].length; i++){

        let player = getPlayerbyName(toRender.action[0][i])
        if (player != undefined){
          player.drawPlayer()
          for (let k = 0; k<toRender.key[0][i].length; k++){
            let angle = getAngleFromKey(toRender.key[0][i][k]);
            player.moveDirection(angle)
            drawAllPlayers(existingPlayers)
          }


        }

      }
    }
  }
  // toRender.action = []
  window.requestAnimationFrame(function(){
    animate()
  })
}

//fix above

window.requestAnimationFrame(function(){animate()})
