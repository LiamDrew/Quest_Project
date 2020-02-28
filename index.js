var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");


class Canvas {
  constructor(ctx) {
    this.ctx = ctx;
  }

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
}

let myCanvas = new Canvas(ctx);
// myCanvas.drawBoard();

class Player {
  //lots of stuff will need to be added to this
  constructor(ctx, xcoord, ycoord){
    this.ctx = ctx;
    this.xcoord = xcoord;
    this.ycoord = ycoord;
  }
  moveRight(xcoord, ycoord){
    for (let i=0; i<100; i++){
      myCanvas.drawBoard();
      ctx.beginPath();
      ctx.fillRect(xcoord+i, ycoord, 25, 25);
      ctx.stroke();
    }
    // myCanvas.drawBoard();
    // ctx.beginPath();
    // ctx.fillRect(400, 400, 25, 25);
    // ctx.stroke();
  }

  drawPlayer(xcoord, ycoord){
    console.log(xcoord);
    ctx.beginPath();
    //draws "player"
    ctx.fillStyle = "blue";
    ctx.fillRect(xcoord, ycoord, 25, 25);
    ctx.stroke();
  }
}

let player1 = new Player(ctx, 200, 300);

// myCanvas.drawBoard();
// player1.drawPlayer(player1.xcoord, player1.ycoord)
// window.addEventListener(event="keydown", function(e){
//   console.log('happened');
//   myCanvas.drawBoard();
//
//   if (e.keyCode == 39){
//     player1.moveRight(player1.xcoord, player1.ycoord);
//   }
// })
myCanvas.drawBoard();
player1.drawPlayer(player1.xcoord, player1.ycoord)

function RunGame(){
  window.addEventListener(event="keydown", function(e){
    console.log('happened');
    myCanvas.drawBoard();

    if (e.keyCode == 39){
      window.requestAnimationFrame(player1.moveRight(player1.xcoord, player1.ycoord));
    }
  })
}
RunGame()
