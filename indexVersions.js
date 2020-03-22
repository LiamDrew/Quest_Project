var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

//// TODO:
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

class Canvas {
  constructor(ctx) {this.ctx = ctx};

  drawBoard() {
    //clears frame every time
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw game outline
    let screenWidth = canvas.width;
    let screenHeight = canvas.height;
    let topMargin = 100;
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

  checkCollision(posList){
    for (let i = 0; i < posList.length; i++){
      for (let p = 0; p < posList.length; p++){
      //this will need to be changed
      //idk what posList will be yet
      //also this will alert for the same object
        if (posList[i] == posList[p]){
          alert('help');
        }
      }
    }
  }

}

let myCanvas = new Canvas(ctx);

class Player {
  //lots of stuff will need to be added to this
  constructor(ctx, xcoord, ycoord){
    this.ctx = ctx;
    this.xcoord = xcoord;
    this.ycoord = ycoord;
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
  //// NOTE: Trying to move this code outside of the class, because that is where it worked in the test
  // window.requestAnimationFrame(function (){
  //   moveDirection(xy, lr);
  // })
}

  drawPlayer(){
    ctx.beginPath();
    //draws "player"
    ctx.fillStyle = "blue";
    ctx.fillRect(this.xcoord, this.ycoord, 25, 25);
    ctx.stroke();
  }

  // attack(){
  //   ctx.beginPath()
  //   ctx.fillStyle = "red";
  //   ctx.fillRect(this.xcoord, this.ycoord, 10, 10);
  //   ctx.stroke();
  // }
  //

}
//creating 2 players for development purposes:
let player1 = new Player(ctx, 200, 300);
let player2 = new Player(ctx, 400, 500);
//all new players get added to this list
let playerList = [player1, player2]

//for some stupid reason, requestAnimationFrame only works when calling a function
//it doesnt work when calling the method of a class

//organizing player move into one function
function renderMove(xy, lr, playerList, player){
  let coords = player.moveDirection(xy, lr);
  console.log(coords);
  for (let i = 0; i<playerList.length; i++){playerList[i].drawPlayer()};
  let raf = window.requestAnimationFrame(function(){renderMove(xy, lr, playerList, player)});
  window.addEventListener(event="keyup", function(e){window.cancelAnimationFrame(raf)});
  if ((coords[0] >= 1300)|| coords[0] <= 0){window.cancelAnimationFrame(raf)};

}

//no touch
// function stopPlayer(){
//   player1.drawPlayer();
//   window.requestAnimationFrame(function(){
//     stopPlayer()
//   })
//
// }


// NOTE: my current problem of players disappearing when others move
//could possibly be solved by a player list input into the drawBoard() function
function drawAllPlayers(playerList){
  myCanvas.drawBoard();
  for (let i = 0; i<playerList.length; i++){playerList[i].drawPlayer()};
}
drawAllPlayers(playerList);

window.addEventListener(event="keydown", function(e){
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
//making a change for github
