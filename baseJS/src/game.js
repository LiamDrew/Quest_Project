function toDegrees(angle){return angle*180/Math.PI};
function toRadians(angle){return angle*Math.PI/180};

class Canvas {
  constructor(players) {
    this.players = players;
  };
  drawBoard() {
    //clears frame every time
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw game outline
    let screenWidth = canvas.width;
    let screenHeight = canvas.height;
    const topMargin = 0;
    //easily changed
    const gridSize = 25;
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

let myCanvas = new Canvas([]);

//at the moment, this Component class doesnt add much
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

//now I am glad to have the extra structure
class Sword extends Component{
  constructor(ctx, xcoord, ycoord, color, name, playerSword){
    super(ctx, xcoord, ycoord, name, color);
    this.playerSword = playerSword;
    this.startAngle = 90;
  }
  drawSword(){
    //just draws
  }

  pickSidetoSwing(mouseX, playerX){
    if (mouseX > playerX){
      return [gameSettings.playerwidth, -1]
    }
    else if (mouseX < playerX){

      //returns [offset, scalar]
      //scalar determines swing direction, offset ensures it is at the edge of the player
      return [0, 1]
    }
  }

  swingSword(mouseX, playerX){
    let off_scal = this.pickSidetoSwing(mouseX, playerX)

    //either of these could be updated in the constructor
    const swordLength = 30;
    const swingSpeed = 2;

    for (let i = 0; i<2; i++){
      //changing the start angle by more each time increases the speed
      this.startAngle = this.startAngle-swingSpeed;

      //positions for the end of the sword
      let swordX = Math.cos(toRadians(this.startAngle))*swordLength;
      let swordY = Math.sin(toRadians(this.startAngle))*swordLength;
      // swordX = Math.cos(startAngle)
      myCanvas.drawBoard();

      //this draws the sword
      //this will need to be changed for better graphics
      ctx.beginPath()
      ctx.fillStyle = "red";
      //x coordinate of the sword. depends on player and offset
      ctx.moveTo(this.xcoord + off_scal[0], this.ycoord);
      //y coord of sword. this
      ctx.lineTo(this.xcoord+(swordX*off_scal[1])+off_scal[0], this.ycoord-swordY)
      ctx.stroke()
    }

    //this is some badly written code to stop the loop error
    if (this.startAngle > -90){return(this.startAngle)};
    if (this.startAngle <= -90){
      this.startAngle = 90;
      return (-91)};
  }

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
    const speed = 1;
    for (let i = 0; i<2; i++){
      if (angle == 0){this.ycoord -=speed}
      else if (angle == 180){this.ycoord +=speed}
      else if (angle == 90){this.xcoord +=speed}
      else if (angle == 270){this.xcoord -=speed}
    }

    myCanvas.drawBoard();
    this.drawPlayer();
    return [this.xcoord, this.ycoord];
  }


  drawPlayer(){
    ctx.beginPath();
    //draws "player"
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xcoord, this.ycoord, this.dimensions[0], this.dimensions[1]);
    ctx.stroke();
  }

  requestMove(keycode){socket.emit('requestingMove', keycode)}
  requestStop(keycode){socket.emit('requestingStop', keycode)}

  requestSwing(mouseX){
    socket.emit('requestingSwing', mouseX)
  }

}

function drawAllPlayers(players){for (let i = 0; i<players.length; i++){players[i].drawPlayer()}}



var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

var socket = io();

let myUsername;
let player1;
let existingPlayers = [];

//will be adding weapons to this list
let playerWeapons = [];

let gameSettings;
let playerDimensions;

let toRender = {
  key: [],
  action: [],

  event: {
    player: [],
    type: [],
    data: []
  }
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

  playerWeapons.push(new Sword(ctx, 200, 300, 'black', 'asword', myUsername));
  player1 = existingPlayers.slice(-1)[0];
  sword1 = playerWeapons.slice(-1)[0];
  //// NOTE: I am not sending swords yet.
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



window.addEventListener(event="click", function(e){
  let mouseX = e.clientX;
  player1.requestSwing(mouseX);
})

socket.on('sendingData', function(queue){
  //this for loop converts the user id recieved from the server and converts it into its corresponding instance of the player class
  // toRender.player = [];
  // for (let i = 0; i<queue.player.length; i++){toRender.player.push(getPlayerbyName(queue.player[i]))}

  // toRender.player.push(getPlayerbyName(queue.player))
  //clear movement arrays
  toRender.key = []
  toRender.key.push(queue.key)

  toRender.action = [];
  toRender.action.push(queue.action)

  toRender.event = queue.event;
  console.log(toRender.event)
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

  //this code animates player movement:
  if ((toRender.action[0] != undefined)){
    //if there are any actions to execute
    if (toRender.action[0][0] != undefined){
      //parses through actions
      for (let i = 0; i < toRender.action[0].length; i++){

        let player = getPlayerbyName(toRender.action[0][i])
        if (player != undefined){
          player.drawPlayer()
          //render every key pressed
          for (let k = 0; k<toRender.key[0][i].length; k++){
            let angle = getAngleFromKey(toRender.key[0][i][k]);
            player.moveDirection(angle)
            drawAllPlayers(existingPlayers)
          }
        }
      }
    }
  }

  //this code handles events:
  //parses through all events
  for (let i = 0; i<toRender.event.type.length; i++){

    //checks for types of events
    if (toRender.event.type[i] == 'Swing'){
      let player = getPlayerbyName(toRender.event.player[i]);

    }
    //add literally anything i want here
    //else if (toRender.event.type[i] == 'Shoot'){}

  }


  if (toRender.event.type == '')
  // if (toRender.swing[0] != undefined){
  //   if (toRender.swing[0][0] != undefined){
  //     console.log('swinging')
  //
  //     for (let i = 0; i < toRender.swing[0].length; i++){
  //       let actingPlayer = getPlayerbyName(toRender.swing[0][i][0]);
  //       if (actingPlayer != undefined){
  //         console.log('drawing player')
  //         actingPlayer.drawPlayer()
  //         //consider adding a for loop to render every key pressed, for now no need;
  //         //access sword from player name
  //         for (let k = 0; k<existingPlayers.length; k++){
  //           console.log('parsing')
  //           if (existingPlayers[k].name == toRender.swing[0][i][0]){
  //             console.log('found player')
  //             let actingSword = playerWeapons[k];
  //             console.log(actingSword);
  //             actingSword.swingSword(toRender.swing[0][i][1], existingPlayers[k].xcoord);
  //             drawAllPlayers(existingPlayers);
  //           }
  //         }
  //       }
  //     }
  //
  //   }
  // }

  window.requestAnimationFrame(function(){
    animate()
  })
}

//fix above

window.requestAnimationFrame(function(){animate()})
