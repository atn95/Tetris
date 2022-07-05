class TetrisPiece {
  constructor(piece) {
    this.name = piece;
    switch (piece) {
      case `l`:
        this.piece = [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.col = 2;
        this.color = `red`;
        break;
      case `z`:
        this.piece = [
          [1, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.col = 3;
        this.color = `blue`;
        break;
      case `s`:
        this.piece = [
          [0, 1, 1, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = `green`;
        this.col = 3;
        break;
      case `square`:
        this.piece = [
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = `yellow`;
        this.col = 4;
        break;
      default:
        console.log(`Invalid pice`);
        break;
    }
    this.row = 0;
  }

  update() {
    this.row++;
  }
  right() {
    this.col++;
  }
  right() {
    this.col--;
  }

  getPiece() {
    return this.piece;
  }

  canMoveDown(grid) {
    let possible = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          this.piece[i][j] != 0 &&
          grid[i + this.row + 1][j + this.col] != 0
        ) {
          possible = false;
          return possible;
        }
      }
    }
    return possible;
  }

  rotate() {
    //z
    /*[1,1,0,0]
      [0,1,1,0]
      [0,0,0,0]
      [0,0,0,0]
      
      [1,1,0,0]
      [0,1,1,0]
      [0,0,0,0]
      [0,0,0,0]
      */
  }
}

const gameboard = document.querySelector(`#gameboard`); //canvas is 808x600
const c = gameboard.getContext('2d');
gameboard.width = 800;
gameboard.height = 600;
const sqSide = 25;
let play = true;
let currPiece = new TetrisPiece(`s`);

/*Start drawing at startx and starty*/
const board = [
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10],
  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
];

const startX = (gameboard.width - board[0].length * sqSide) / 2; // X value where board is drawn
const startY = 20; // Y value where board is drawn

function draw() {
  requestAnimationFrame(draw);
  c.fillStyle = `black`;
  c.fillRect(0, 0, 800, 800); //draw black background and clearing prev draws
  /*double loop to go through the 2D array board*/
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] == 10) {
        // 10 represents border piece
        c.fillStyle = `white`;
        c.fillRect(
          startX + j * sqSide,
          20 + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  c.fillStyle = currPiece.color;
  for (let j = 0; j < currPiece.getPiece().length; j++) {
    for (let k = 0; k < currPiece.getPiece()[j].length; k++) {
      if (currPiece.getPiece()[j][k] !== 0) {
        //2 for the board border
        console.log(
          startX + 2 * sqSide + currPiece.col * sqSide + k * sqSide,
          startY + currPiece.row * sqSide + k * sqSide,
          sqSide - 2,
          sqSide - 2
        );
        c.fillRect(
          startX + 2 * sqSide + currPiece.col * sqSide + k * sqSide,
          startY + currPiece.row * sqSide + j * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }
}

//start animation calls
draw();

function update() {
  if (play) {
    if (currPiece.canMoveDown(board)) {
      currPiece.row++;
    } else {
      //Add piece to board
      //make new piece
      currPiece = new TetrisPiece(`z`);
    }
  }
}

setInterval(update, `1000`);
