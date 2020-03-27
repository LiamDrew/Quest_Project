var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

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

//Runs stuff
let myCanvas = new Canvas(ctx);
myCanvas.drawBoard();

class Player extends Component{
  //lots of stuff will need to be added to this (maybe)
  constructor(ctx, xcoord, ycoord, dimensions, color, name){
    super(ctx, name, xcoord, ycoord, color, dimensions);
  }
  //for debugging purposes
  isProperty(){
    console.log('I am a property that can be called')
  }

  moveTo(x, y){
    this.xcoord = x;
    this.ycoord = y;
    myCanvas.drawBoard();
    this.drawPlayer()
    return [this.xcoord, this.ycoord];
  }
  //move methods
  moveDirection(isHorizontal, posNeg){
    var self = this;
    //isHorizontal for horizontal vs vertical: true = x, false =y
    //posNeg for direction: 1 is positive (down, right), -1 is negative (up, left). Also determines speed.
    for (let i=0; i<2; i++){
      if (isHorizontal===true){this.xcoord=this.xcoord+posNeg}
      else if (isHorizontal === false){this.ycoord = this.ycoord+posNeg}};
    myCanvas.drawBoard();
    for (let p; p< existingPlayers.length; p++){
      existingPlayers[p].drawPlayer();
    }
    this.drawPlayer()

    let raf = window.requestAnimationFrame(function(){self.moveDirection(isHorizontal, posNeg)});
    window.addEventListener(event="keyup", function(e){window.cancelAnimationFrame(raf)})
    socket.emit('playerMoved', [myUser, this.xcoord, this.ycoord]);
    return [this.xcoord, this.ycoord];
  }

  drawPlayer(){
    ctx.beginPath();
    //draws "player"
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xcoord, this.ycoord, this.dimensions[0], this.dimensions[1]);
    ctx.stroke();
  }
}

var myUser = null
var player1 = null;
var existingPlayers = []
let player1Dimensions = [25, 25];

function drawAllPlayers(players){
  for (let i = 0; i<players.length; i++){
    players[i].drawPlayer();
  }

}
//socket stuff
var socket = io();
socket.on('sendClientUsername', function(user){
  console.log(user)
  myUser = user;
  player1 = new Player(ctx, 200, 300, player1Dimensions, 'green', myUser[0])
  socket.emit('sendingNewPlayer', user);
})

socket.on('allExistingPlayers', function(connections){
  for (let i=0; i<connections.length; i++){
    if (connections[i] == myUser){
      console.log('do nothing, this is me')
    }
    else{
      let newPlayer = new Player(ctx, 600, 600, player1Dimensions, 'black', connections[i])
      existingPlayers.push(newPlayer);
    }
  }
  console.log('all players loaded')
  console.log(existingPlayers)
})

socket.on('broadcastingNewPlayer', function(user){
  let aNewPlayer = new Player(ctx, 500, 400, player1Dimensions, 'brown', user)
  existingPlayers.push(aNewPlayer);
  console.log('new player loaded')
  console.log(existingPlayers)
})

// let otherPlayer = new Player(ctx, 500, 500, player1Dimensions, 'red', 'otherPlayer');


socket.on('newPlayerCoords', function(coords){
  console.log('recieving coords')
  if (coords[0] == myUser[0]){
    console.log('my own coords')
    return true
  }
  else {
    console.log('Another Player Moved')
    player1.drawPlayer()
    for (i=0; i<existingPlayers.length; i++){
      if (coords[0]==existingPlayers[i].name){
        console.log('made it jere')
        existingPlayers[i].moveTo(coords[1], coords[2]);
      }
    }
  }
})

window.addEventListener(event="keydown", function(e){
  if (e.repeat == true){return true};

  switch (e.keyCode){
    case 39:
      let outsideRaf = window.requestAnimationFrame(function(){
        player1.moveDirection(true, 1)
        // renderMove(player1);
      })
      break;

    case 37:
      window.requestAnimationFrame(function(){player1.moveDirection(true, -1, existingPlayers)});
      break;

    case 38:
      window.requestAnimationFrame(function(){player1.moveDirection(false, -1, existingPlayers)});
      break;

    case 40:
      window.requestAnimationFrame(function(){player1.moveDirection(false, 1, existingPlayers)});
      break;

  }
})


//for debugging purposes only:
// function renderMove(player){
//   let coords = player.moveDirection(true, 1)
//   let raf = window.requestAnimationFrame(function(){renderMove(player)})
//   window.addEventListener(event="keyup", function(e){
//     window.cancelAnimationFrame(raf);
//   })
// }
