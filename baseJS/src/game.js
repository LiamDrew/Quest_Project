var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

//// TODO:
//_______________________________________________________
//
/*
Fix:
see if class method can be used with raf.
pretty sure no but having a designated function sucks



Develop:
attack method for player

look into player sprites:
draw them in canvas or import image?

game objects
*/
function toDegrees(angle){return angle*180/Math.PI};
function toRadians(angle){return angle*Math.PI/180};

function pickSide(rightSide){
  //this returns an offset and a scalar
  //offset is 0 or playerwidth, scalar is for direction (1 or -1)
  if (rightSide == false){return [0, -1]}
  else if (rightSide == true){return [playerWidth, 1]}
}

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

class Component {
  constructor(name, xcoord, ycoord, boundaries){
    this.name = name;
    this.xcoord = xcoord;
    this.ycoord = ycoord;
    this.boundaries = boundaries;
  }
  checkCollision(objectList){
    //may need to do something to make sure objectList is a 1d array
    //at the moment, collision only measures perfect alignment. this will change
    for (let i = 0; i<objectList.length; i++){
      for (let p = 0; p<objectList.length; p++){
        if (i==p){

          //pass
        }
        //this if statement is where the magic happens
        //to make the collision thing more precise, things need to get changed here
        //also, i will need to establish object boundaries
        //right now 25 is the player boundary
        if (p != i){
          if (Math.abs(objectList[i].xcoord - objectList[p].xcoord) < 25){
            if (Math.abs(objectList[i].ycoord - objectList[p].ycoord) < 25){
              alert('acollision')
              return true
            }
          }
        }

        // if ((p != i) &&(objectList[i].xcoord == objectList[p].xcoord) && (objectList[i].ycoord == objectList[p].ycoord)){
        //   alert('collision')
        //   return true};
      }}//end the for loops
  }//end function
}//end class

class Player extends Component{
  //lots of stuff will need to be added to this (maybe)
  constructor(ctx, xcoord, ycoord, startAngle, boundaries, name){
    super(name, xcoord, ycoord);
    this.ctx = ctx;
    // this.xcoord = xcoord;
    // this.ycoord = ycoord;
    this.startAngle = startAngle;

  }
  //move methods
  moveDirection(xy, lr){
    //xy for horizontal vs vertical: true = x, false =y
    //lr for direction: 1 is positive (down, right), -1 is negative (up, left)
    for (let i=0; i<2; i++){
      if (xy===true){
        this.xcoord=this.xcoord+lr;
      }
      else if (xy === false){
        this.ycoord = this.ycoord+lr;
      }
      myCanvas.drawBoard();
      ctx.beginPath();
      ctx.fillRect(this.xcoord, this.ycoord, 25, 25);
      ctx.stroke();
    }
  return [this.xcoord, this.ycoord];
}

  drawPlayer(){
    //testing the extended class
    ctx.beginPath();
    //draws "player"
    ctx.fillStyle = "blue";
    ctx.fillRect(this.xcoord, this.ycoord, 25, 25);
    ctx.stroke();
  }

  //animates the down-swing

  meleeAttack(off_scal){
    let swordLength = 30;
    let swingSpeed = 2;
    for (let i = 0; i<2; i++){

      //changing the start angle by more each time increases the speed
      //starting at 1, may increase
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

let playerWidth = 25;
let playerHeight = 25;
let playerX = 200;
let playerY = 300;
let boundaries = [[playerX, playerY], [playerX+playerWidth, playerY], [playerX, playerY+playerHeight], [playerX+playerWidth, playerY+playerHeight]];
//creating 2 players for development purposes:
let player1 = new Player(ctx, playerX, playerY, 90, boundaries, 'player1');

//defining player2
let player2Width = 25;
let player2Height = 25;
let player2X = 400;
let player2Y = 500;
let boundaries2 = [[player2X, player2Y], [player2X+player2Width, player2Y], [player2X, player2Y+player2Height], [player2X+player2Width, player2Y+player2Height]];
let player2 = new Player(ctx, player2X, player2Y, 90, boundaries2, 'player2');
//all new players get added to this list
let playerList = [player1, player2]


//for some stupid reason, requestAnimationFrame only works when calling a function
//it doesnt work when calling the method of a class

//organizing player move into one function
function renderMove(xy, lr, playerList, player){
  let coords = player.moveDirection(xy, lr);
  for (let i = 0; i<playerList.length; i++){playerList[i].drawPlayer()};
  let raf = window.requestAnimationFrame(function(){renderMove(xy, lr, playerList, player)});
  window.addEventListener(event="keyup", function(e){window.cancelAnimationFrame(raf)});
  if (coords[0] >= 1300){window.cancelAnimationFrame(raf)};
  if (player1.checkCollision(playerList)==true){
    window.cancelAnimationFrame(raf)
  }
}

function renderMeleeAttack(playerList, player, rightSide){
  let ins_list = pickSide(rightSide);
  //calls player melee attack function
  let matak = player.meleeAttack(ins_list);
  //draws player every time this runs (to refresh the board)
  for (let i = 0; i<playerList.length; i++){playerList[i].drawPlayer()};
  //starts requestAnimationFrame
  let raf2 = window.requestAnimationFrame(function(){renderMeleeAttack(playerList, player, rightSide)})

  let limitAngle = -90
  if (matak < limitAngle){
    window.cancelAnimationFrame(raf2);
  }
}


// NOTE: my current problem of players disappearing when others move
//could possibly be solved by a player list input into the drawBoard() function
function drawAllPlayers(playerList){
  myCanvas.drawBoard();
  for (let i = 0; i<playerList.length; i++){playerList[i].drawPlayer()};
}
//runs on start
drawAllPlayers(playerList);

function swingSide(player, mouseX){
  if (mouseX > player.xcoord){return true}
  else if (mouseX < player.xcoord){return false}
}

window.addEventListener(event ="click", function(e){
  let side = swingSide(player1, e.clientX);
  window.requestAnimationFrame(function(){
    renderMeleeAttack(playerList, player1, side);
  })

})

window.addEventListener(event="keydown", function(e){
  console.log('raf firing')
  if (e.repeat == true){return true};

  switch (e.keyCode){
    //arrow keys control player 1
    case 39:
      window.requestAnimationFrame(function(){renderMove(true, 1, playerList, player1)});
      break;
    case 37:
      window.requestAnimationFrame(function(){renderMove(true, -1, playerList, player1)});
      break;
    case 38:
      window.requestAnimationFrame(function(){renderMove(false, -1, playerList, player1)});
      break;
    case 40:
      window.requestAnimationFrame(function(){renderMove(false, 1, playerList, player1)});
      break;
    //these cases are for player 2 (note rendermove2. I could try making one function but it would be a pain in the butt)
    //WASD keys control player 2
    case 68:
      window.requestAnimationFrame(function(){renderMove(true, 1, playerList, player2)});
      break;
    case 65:
      window.requestAnimationFrame(function(){renderMove(true, -1, playerList, player2)});
      break;
    case 87:
      window.requestAnimationFrame(function(){renderMove(false, -1, playerList, player2)});
      break;
    case 83:
      window.requestAnimationFrame(function(){renderMove(false, 1, playerList, player2)});
      break;
  }
  drawAllPlayers(playerList);
})
