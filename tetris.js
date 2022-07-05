class TetrisPiece {
  constructor(piece) {
    this.name = piece;
    switch (piece) {
      case `I`:
        this.piece = [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.col = 2;
        this.color = `blue`;
        break;
      case `z`:
        this.piece = [
          [2, 2, 0, 0],
          [0, 2, 2, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.col = 3;
        this.color = `red`;
        break;
      case `s`:
        this.piece = [
          [0, 3, 3, 0],
          [3, 3, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = `green`;
        this.col = 3;
        break;
      case `square`:
        this.piece = [
          [4, 4, 0, 0],
          [4, 4, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = `orange`;
        this.col = 4;
        break;
      case `L`:
        this.piece = [
          [0, 0, 5, 0],
          [5, 5, 5, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = `yellow`;
        this.col = 4;
        break;
      case `reverse-L`:
        this.piece = [
          [6, 6, 6, 0],
          [0, 0, 6, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = `purple`;
        this.col = 4;
        break;
      case `t`:
        this.piece = [
          [0, 7, 0, 0],
          [7, 7, 7, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = `cyan`;
        this.col = 4;
        break;
      default:
        console.log(`Invalid pice`);
        break;
    }
    this.row = -1;
  }

  update() {
    this.row++;
  }
  right() {
    this.col++;
  }
  left() {
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
          grid[i + this.row + 1][j + this.col + 2] != 0
        ) {
          possible = false;
          return possible;
        }
      }
    }
    return possible;
  }

  canMoveRight(grid) {
    if (this.row == -1) {
      return false;
    }
    let possible = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          this.row + i < grid.length &&
          this.col + j < grid[0].length - 1 &&
          this.piece[i][j] != 0 &&
          grid[i + this.row][j + this.col + 3] != 0
        ) {
          possible = false;
          break;
        }
      }
    }
    return possible;
  }

  canMoveLeft(grid) {
    if (this.row == -1) {
      return false;
    }
    let possible = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          this.row + i < grid.length &&
          this.col + j < grid[0].length - 1 &&
          this.piece[i][j] != 0 &&
          grid[i + this.row][j + this.col + 1] != 0
        ) {
          possible = false;
          break;
        }
      }
    }
    return possible;
  }

  addToGrid(grid) {
    if (this.row == -1) {
      play = false;
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          this.piece[i][j] != 0 &&
          this.row > -1 &&
          this.row + i < grid.length - 2 &&
          this.col + j < grid[0].length - 2
        )
          grid[this.row + i][this.col + j + 2] = this.piece[i][j];
      }
    }
    return grid;
  }

  rot(array) {
    let temp = array.map((arr) => arr.map((num) => num));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        temp[i][j] = array[j][i];
      }
    }
    return temp.reverse();
  }

  rotate(grid) {
    let temp = this.rot(this.rot(this.rot(this.piece)));
    let canRotate = true;
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        if (temp[j][k] != 0 && grid[j + this.row + 1][k + this.col + 2] != 0) {
          canRotate = false;
        }
      }
    }
    if (canRotate) {
      this.piece = temp;
    }
    //TODO: fix  clipping into set pieces/border bug
  }
}

const gameboard = document.querySelector(`#gameboard`); //canvas is 808x600
const c = gameboard.getContext('2d');
gameboard.width = 800;
gameboard.height = 600;
const sqSide = 25;
let play = true;
let score = 0;
const possiblePieces = [`I`, `z`, `s`, `square`, `L`, `reverse-L`, `t`];
let pieces = [];
let currPiece;
let hold = null;
let canHold = true;

/*Start drawing at startx and starty*/
let board = [
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

function clearBoard() {
  for (let i = 0; i < board.length - 2; i++) {
    for (let j = 2; j < board[i].length - 2; j++) {
      board[i][j] = 0;
    }
  }
}

function init() {
  clearBoard();
  score = 0;
  canHold = true;
  currPiece = generateRandomPiece();

  for (let i = 0; i < 3; i++) {
    pieces.push(generateRandomPiece());
  }
  //start animation calls
  draw();
  //start gameupdate interval
  update();
}

function generateRandomPiece() {
  return new TetrisPiece(
    possiblePieces[Math.floor(Math.random() * possiblePieces.length)]
  );
}

function removeCompletedRows() {
  //for score purpose
  let lineRemoved = 0;
  for (let i = board.length - 3; i > 0; i--) {
    let removed = true;
    for (let j = 2; j < board[i].length - 2; j++) {
      if (board[i][j] == 0) {
        removed = false;
      }
    }
    if (removed) {
      for (let a = i; a > 0; a--) {
        for (let j = 2; j < board[a].length - 2; j++) {
          board[a][j] = board[a - 1][j];
        }
      }
      lineRemoved++;
      i++;
    }
  }
  return lineRemoved;
}

function draw() {
  requestAnimationFrame(draw);
  c.fillStyle = `black`;
  c.fillRect(0, 0, 800, 600); //draw black background and clearing prev draws
  /*double loop to go through the 2D array board*/
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        switch (board[i][j]) {
          case 10:
            c.fillStyle = `white`;
            break;
          case 1:
            c.fillStyle = `blue`;
            break;
          case 2:
            c.fillStyle = `red`;
            break;
          case 3:
            c.fillStyle = `green`;
            break;
          case 4:
            c.fillStyle = `orange`;
            break;
          case 5:
            c.fillStyle = `yellow`;
            break;
          case 6:
            c.fillStyle = `purple`;
            break;
          case 7:
            c.fillStyle = `cyan`;
            break;
        }
        c.fillRect(
          startX + j * sqSide,
          20 + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  //draw current piece
  c.fillStyle = currPiece.color;
  for (let j = 0; j < currPiece.getPiece().length; j++) {
    for (let k = 0; k < currPiece.getPiece()[j].length; k++) {
      if (currPiece.getPiece()[j][k] !== 0) {
        //2 for the board border
        c.fillRect(
          startX + 2 * sqSide + currPiece.col * sqSide + k * sqSide,
          startY + currPiece.row * sqSide + j * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  //draw score
  c.fillStyle = `white`;
  c.font = `25px sans-serif`;
  c.fillText(`Score: `, 30, 40);
  c.fillText(score, 30, 70);
  c.fillText(`Hold `, 70, 100);
  c.fillRect(50, 130, 100, 100);
  c.fillStyle = `black`;
  c.fillRect(51, 131, 98, 98);
  c.fillStyle = `white`;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (hold != null && hold.getPiece()[i][j] !== 0) {
        c.fillRect(52 + j * sqSide, 132 + i * sqSide, sqSide - 2, sqSide - 2);
      }
    }
  }

  //draw hold piece
}

function update() {
  if (play) {
    if (currPiece.canMoveDown(board)) {
      currPiece.update();
    } else {
      //Add piece to board
      board = currPiece.addToGrid(board);
      canHold = true;
      score += Math.pow(10, removeCompletedRows());
      //make new piece
      pieces.push(generateRandomPiece());
      currPiece = pieces.shift();
      if (currPiece.canMoveDown(board)) {
        currPiece.update();
      }
    }
  }
  setTimeout(update, `1000`);
}

function downSmash() {
  let lineTraveled = 0;
  while (currPiece.canMoveDown(board)) {
    currPiece.update();
    lineTraveled++;
  }
  score += parseInt(Math.pow(lineTraveled * 2, 2));
}

function holdSwap() {
  if (canHold) {
    if (hold == null) {
      hold = currPiece;
      currPiece = new TetrisPiece(`I`);
    } else {
      let temp = currPiece;
      currPiece = hold;
      currPiece.row = 0;
      hold = temp;
    }
  }
  canHold = false;
}

addEventListener(`keydown`, () => {
  if (play) {
    if (event.key == `ArrowRight`) {
      if (currPiece.canMoveRight(board)) {
        currPiece.right();
      }
    }
    if (event.key == `ArrowLeft`) {
      if (currPiece.canMoveLeft(board)) {
        currPiece.left();
      }
    }
    if (event.key == `ArrowUp`) {
      currPiece.rotate(board);
    }
    if (event.key == `ArrowDown`) {
      if (currPiece.canMoveDown(board)) {
        currPiece.update();
      } else {
        board = currPiece.addToGrid(board);
        pieces.push(generateRandomPiece());
        currPiece = pieces.shift();
        score += Math.pow(10, removeCompletedRows());
        canHold = true;
      }
    }
    if (event.key == ` `) {
      downSmash();
      board = currPiece.addToGrid(board);
      pieces.push(generateRandomPiece());
      currPiece = pieces.shift();
      score += Math.pow(10, removeCompletedRows());
      canHold = true;
    }
    if (event.key == `c`) {
      holdSwap();
    }
    console.log(event);
  }
});

init();
