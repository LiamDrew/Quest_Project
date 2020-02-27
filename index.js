//import react
import React from 'react';
import ReactDOM from 'react-dom';
//import css
import './index.css';

/*
//creates Game class
class Game extends React.Component {
  constructor(props){
    super(props);
    //creates a state for game values
  }
  render() {
    return null
  }
}
*/

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: new Player(30, 40),
      player2: new Player(200, 200),
    }
    this.getName = this.getName.bind(this);
    this.renderPlayer = this.renderPlayer.bind(this);

  }


  getName(){
    // this.setState({player2: new Player(500, 500)});
    this.setState(state => ({
      player2.xcoord: !state.open

    //this.setState({xcoord: 500});
    this.drawBoard();
  }

  renderPlayer(ctx, xcoord, ycoord){
    ctx.beginPath();
    ctx.fillStyle = 'black';
    //fills in player
    ctx.fillRect(xcoord, ycoord, 25, 25);
    ctx.stroke();
  }

  drawBoard() {
    let canvas = this.refs.canvas;
    let ctx = canvas.getContext("2d")
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

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.rect(0, topMargin, screenWidth, screenHeight-1);
    ctx.moveTo(0, screenHeight);
    ctx.lineTo(screenWidth, screenHeight);
    ctx.stroke();

    //draw player
    this.renderPlayer(ctx, this.state.player2.xcoord, this.state.player2.ycoord);


    return (this.state.player2)
    //draw grid
}

  componentDidMount(){
    let pvalue = this.drawBoard()
    console.log(pvalue)
  }
  componentDidUpdate(){
    let avalue = this.drawBoard()
    console.log(avalue)
  }

  render() {
    return (
      <div>
        <canvas ref="canvas" width="1420" height="733">
        Your browser does not support the canvas element.
        </canvas>
        <div>
        <button id="add" type="submit" onClick={this.getName}>Get Name</button>
        </div>
      </div>

          // <Game />
    );
  }
}


class Player extends React.Component {
  constructor(xcoord, ycoord){
    super();
    this.xcoord = xcoord;
    this.ycoord = ycoord;
    // this.refs = refs;
    // this.canvas = canvas;

  //state of player:
  //this will need to be expanded and updated significantly
  this.state = {
    // xcoord: 80,
    // ycoord: null,
    health: null,
    // inventory: [],
    // weapon: null,
    // damage: null
  }
}
  render(){
    console.log(Canvas.getName())
    return (
      <div>
        <Canvas />
      </div>
    );
  }
}

// export default Canvas

ReactDOM.render(
  <Canvas />,
  document.getElementById('root')
);
