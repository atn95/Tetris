class TetrisPiece {
  constructor(piece) {
    this.name = piece;
    switch (piece) {
      case `I`:
        this.piece = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        this.col = 2;
        this.color = 1;
        break;
      case `z`:
        this.piece = [
          [0, 0, 0, 0],
          [2, 2, 0, 0],
          [0, 2, 2, 0],
          [0, 0, 0, 0]
        ];
        this.col = 3;
        this.color = 2;
        break;
      case `s`:
        this.piece = [
          [0, 0, 0, 0],
          [0, 3, 3, 0],
          [3, 3, 0, 0],
          [0, 0, 0, 0]
        ];
        this.color = 3;
        this.col = 3;
        break;
      case `square`:
        this.piece = [
          [0, 0, 0, 0],
          [0, 4, 4, 0],
          [0, 4, 4, 0],
          [0, 0, 0, 0]
        ];
        this.color = 4;
        this.col = 4;
        break;
      case `L`:
        this.piece = [
          [0, 0, 0, 0],
          [0, 0, 5, 0],
          [5, 5, 5, 0],
          [0, 0, 0, 0]
        ];
        this.color = 5;
        this.col = 4;
        break;
      case `reverse-L`:
        this.piece = [
          [0, 0, 0, 0],
          [6, 6, 6, 0],
          [0, 0, 6, 0],
          [0, 0, 0, 0]
        ];
        this.color = 6;
        this.col = 4;
        break;
      case `t`:
        this.piece = [
          [0, 0, 0, 0],
          [0, 7, 0, 0],
          [7, 7, 7, 0],
          [0, 0, 0, 0]
        ];
        this.color = 7;
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
    return this.piece.map((arr) => arr);
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

  getColorIndex() {
    return this.color;
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
    //rotating 3 times because it provides a smoother rotation due to the method used to shift the array
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
  }
}

const bgm = new Audio(`./bgm.mp3`);
const lineClearedSound = new Audio(`./lineclear.wav`);
const gameboard = document.querySelector(`#gameboard`); //canvas is 808x600
const c = gameboard.getContext('2d');
const scoreLoc = document.querySelector(`#score`);
const playBtn = document.querySelector(`#play`);
const clearBtn = document.querySelector(`#clear`);
const arrowKeyImg = new Image(90, 90);
arrowKeyImg.src = `arrow.png`;
const spaceKeyImg = new Image(59, 19);
spaceKeyImg.src = 'space.png';
const cKeyImg = new Image(19, 19);
cKeyImg.src = 'c.png';
// check if on mobile display
const mobile = window.matchMedia('screen and (max-width:600px)').matches;
const volumeSlider = document.querySelector(`#volume`);
let volume = volumeSlider.value / 100;
const musicCheckBox = document.querySelector(`#mute`);
let mute = musicCheckBox.checked;
// 375, 667 cmmon mobile screen
gameboard.width = !mobile ? 800 : window.innerWidth;
gameboard.height = 600;
const cWidth = gameboard.width;
const cHeight = gameboard.height;
const sqSide = !mobile ? 25 : 21;
const color = [
  `black`,
  `blue`,
  `red`,
  `green`,
  `orange`,
  `yellow`,
  `purple`,
  `cyan`
];
const pieceBoxSize = 4 * sqSide + 1;
let highscores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const possiblePieces = [`I`, `z`, `s`, `square`, `L`, `reverse-L`, `t`];
let play = false;
let score = 0;
let ghost;
let pieces = [];
let level = 1;
let currPiece;
let hold = null;
let canHold = true;
let sendScore = false;
let combo = 0;

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
const startY = !mobile ? 20 : 30; // Y value where board is drawn

//Mouse controls for mobile
let mouseOnClick = { x: 0, y: 0 };
let mouseReleased = { x: 0, y: 0 };
let touched = false;
let mouseDelta = 10;
let updateTicks = 0;
let holdCounter = 0;
let canMoveHor = true;

function clearBoard() {
  for (let i = 0; i < board.length - 2; i++) {
    for (let j = 2; j < board[i].length - 2; j++) {
      board[i][j] = 0;
    }
  }
}

function init() {
  currPiece = generateRandomPiece();
  for (let i = 0; i < 3; i++) {
    pieces.push(generateRandomPiece());
  }
  loadScore();
  writeScore();
  //start the update logic
  update();

  //start animation calls
  if (!mobile) {
    draw();
  } else {
    drawMobile();
  }
}

function start() {
  if (bgm.paused && !mute) {
    bgm.play();
    //increase to increase max volume or decrease if still too loud
    bgm.volume = volume;
    lineClearedSound.volume = volume;
  }
  playBtn.classList.add(`hidden`);
  playBtn.innerText = `Play Again`;
  clearBoard();
  score = 0;
  canHold = true;
  level = 1;
  sendScore = false;
  loadScore();
  //genereate initial piece and pieces array
  currPiece = generateRandomPiece();
  if (pieces.length < 3) {
    for (let i = 0; i < 3; i++) {
      pieces.push(generateRandomPiece());
    }
  }
  //start gameupdate interval
  play = true;
}

function replayMusic() {
  bgm.currentTime = 0;
  bgm.play();
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
  if (lineRemoved > 0) {
    lineClearedSound.play();
  }
  return lineRemoved;
}

function drawMobile() {
  requestAnimationFrame(drawMobile);
  c.fillStyle = `black`;
  c.fillRect(0, 0, cWidth, cHeight);

  //Draw score/level/combo
  c.strokeStyle = `white`;
  c.fillStyle = `white`;
  c.lineWidth = 2;
  c.font = `20px VT323`;
  c.strokeRect(0, 0, cWidth, startY - 2);
  c.fillText(` Level:${level}  | Combo: ${combo}  | Score: ${score}`, 0, 20);
  //drawgrid
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        switch (board[i][j]) {
          case 10:
            c.fillStyle = `white`;
            break;
          default:
            c.fillStyle = color[board[i][j]];
        }
        c.fillRect(
          startX + j * sqSide,
          startY + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  //draw current piece
  for (let i = 0; i < currPiece.getPiece().length; i++) {
    for (let j = 0; j < currPiece.getPiece()[i].length; j++) {
      if (currPiece.getPiece()[i][j] !== 0) {
        c.fillStyle = color[currPiece.getColorIndex()];
        //2 for the board border
        c.fillRect(
          startX + 2 * sqSide + currPiece.col * sqSide + j * sqSide,
          startY + currPiece.row * sqSide + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  //draw ghost piece
  //clone piece
  ghost = new TetrisPiece(currPiece.name);
  ghost.piece = currPiece.getPiece();
  ghost.col = currPiece.col;
  ghost.row = currPiece.row;
  //move to when possible bottom
  while (ghost.canMoveDown(board)) {
    ghost.update();
  }
  for (let i = 0; i < ghost.getPiece().length; i++) {
    for (let j = 0; j < ghost.getPiece()[i].length; j++) {
      if (ghost.getPiece()[i][j] !== 0) {
        //2 for the board border
        c.fillStyle = `white`;
        c.strokeRect(
          startX + 2 * sqSide + ghost.col * sqSide + j * sqSide,
          startY + ghost.row * sqSide + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  let boardEndYValue = startY + board.length * sqSide;
  let miniSqSide = sqSide - 5;

  //draw hold piece

  c.fillText(`Hold `, 35, boardEndYValue + 17);
  c.strokeRect(20, boardEndYValue + 25, 4 * miniSqSide + 1, 4 * miniSqSide + 1);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (hold != null && hold.getPiece()[i][j] !== 0) {
        c.fillStyle = color[hold.getColorIndex()];
        c.fillRect(
          22 + j * miniSqSide,
          25 + boardEndYValue + i * miniSqSide,
          miniSqSide - 2,
          miniSqSide - 2
        );
      }
    }
  }

  //draw next few pieces

  c.fillStyle = `white`;
  c.fillText(`Next:`, 160, boardEndYValue + 17);
  for (let a = 0; a < pieces.length; a++) {
    c.fillStyle = `white`;
    c.strokeRect(
      150 + a * (miniSqSide * 4 + 1),
      25 + boardEndYValue,
      4 * miniSqSide + 1,
      4 * miniSqSide + 1
    );
    c.fillStyle = color[pieces[a].getColorIndex()];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (pieces[a].getPiece()[i][j] !== 0) {
          c.fillRect(
            151 + j * miniSqSide + a * (miniSqSide * 4 + 1),
            25 + boardEndYValue + i * miniSqSide,
            miniSqSide - 2,
            miniSqSide - 2
          );
        }
      }
    }
  }

  //mobile var helping with touch events
  if (play) {
    updateTicks++;
    if (updateTicks % 15 === 0) {
      canMoveHor = true;
    }
    if (touched) {
      holdCounter++;
    }
  }
}

function draw() {
  requestAnimationFrame(draw);

  //draw black background and clearing prev draws
  c.fillStyle = `black`;
  c.fillRect(0, 0, 800, 600);

  //drawing border
  c.lineWidth = 5;
  c.strokeStyle = `white`;
  c.strokeRect(0, 0, 800, 600);
  c.lineWidth = 1;
  //draw arrow Key image
  c.fillStyle = `white`;
  c.fillText(`Controls`, 20, 400);
  c.drawImage(arrowKeyImg, 90, 400, 90, 90);
  c.drawImage(spaceKeyImg, 60, 490, 88.5, 28.5);
  c.drawImage(cKeyImg, 40, 450, 28.5, 28.5);
  //draw ghost piece
  //clone piece
  ghost = new TetrisPiece(currPiece.name);
  ghost.piece = currPiece.getPiece();
  ghost.col = currPiece.col;
  ghost.row = currPiece.row;
  //move to when possible bottom
  while (ghost.canMoveDown(board)) {
    ghost.update();
  }

  for (let i = 0; i < ghost.getPiece().length; i++) {
    for (let j = 0; j < ghost.getPiece()[i].length; j++) {
      if (ghost.getPiece()[i][j] !== 0) {
        //2 for the board border
        c.fillStyle = `white`;
        c.strokeRect(
          startX + 2 * sqSide + ghost.col * sqSide + j * sqSide,
          startY + ghost.row * sqSide + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  /*double loop to go through the 2D array board*/
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        switch (board[i][j]) {
          case 10:
            c.fillStyle = `white`;
            break;
          default:
            c.fillStyle = color[board[i][j]];
        }
        c.fillRect(
          startX + j * sqSide,
          startY + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  //draw current piece

  for (let i = 0; i < currPiece.getPiece().length; i++) {
    for (let j = 0; j < currPiece.getPiece()[i].length; j++) {
      if (currPiece.getPiece()[i][j] !== 0) {
        c.fillStyle = color[currPiece.getColorIndex()];
        //2 for the board border
        c.fillRect(
          startX + 2 * sqSide + currPiece.col * sqSide + j * sqSide,
          startY + currPiece.row * sqSide + i * sqSide,
          sqSide - 2,
          sqSide - 2
        );
      }
    }
  }

  //draw score
  c.fillStyle = `white`;
  c.font = `25px VT323`;
  c.fillText(`Score: `, 30, 40);
  c.fillText(score, 30, 70);

  //draw hold piece
  c.fillText(`Hold `, 80, 100);
  c.strokeRect(60, 130, 101, 101);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (hold != null && hold.getPiece()[i][j] !== 0) {
        c.fillStyle = color[hold.getColorIndex()];
        c.fillRect(62 + j * sqSide, 132 + i * sqSide, sqSide - 2, sqSide - 2);
      }
    }
  }

  //Draw level
  c.fillStyle = `white`;
  c.font = `35px VT323`;
  c.fillText(`Level: ` + level, 40, 300);

  //Draw Combo
  c.font = `28px VT323`;
  c.fillText(`Combo : ` + combo, 40, 360);

  //draw next pieces
  c.fillStyle = `white`;
  c.fillText(`Next`, 660, 50);
  for (let a = 0; a < pieces.length; a++) {
    c.fillStyle = `white`;
    c.strokeRect(640, 70 + a * 120, 4 * sqSide + 1, 4 * sqSide + 1);
    c.fillStyle = color[pieces[a].getColorIndex()];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (pieces[a].getPiece()[i][j] !== 0) {
          c.fillRect(
            642 + j * sqSide,
            72 + i * sqSide + a * 120,
            sqSide - 2,
            sqSide - 2
          );
        }
      }
    }
  }
}

function update() {
  if (play) {
    checkHoldAction();
    if (currPiece.canMoveDown(board)) {
      currPiece.update();
    } else {
      //Add piece to board
      board = currPiece.addToGrid(board);
      canHold = true;
      let lineRemoved = removeCompletedRows();
      if (lineRemoved > 0) {
        combo++;
      } else {
        combo = 0;
      }
      score += parseInt(
        (2 + combo) / 2 + Math.pow(10, lineRemoved) * Math.pow(level, 2)
      );
      //make new piece
      pieces.push(generateRandomPiece());
      currPiece = pieces.shift();
      if (currPiece.canMoveDown(board)) {
        currPiece.update();
      }
    }
    score += level * 100;
    if (score > 1500000) {
      level = 10;
    } else if (score > 1200000) {
      level = 9;
    } else if (score > 900000) {
      level = 8;
    } else if (score > 600000) {
      level = 7;
    } else if (score > 400000) {
      level = 6;
    } else if (score > 200000) {
      level = 5;
    } else if (score > 100000) {
      level = 4;
    } else if (score > 50000) {
      level = 3;
    } else if (score > 25000) {
      level = 2;
    }
    bgm.playbackRate = parseFloat(`1.${level / 10}`);
  } else {
    bgm.playbackRate = 1;
    if (!sendScore) {
      if (score > highscores[highscores.length - 1]) {
        highscores.push(score);
        highscores = highscores.sort((a, b) => b - a);
        highscores.pop();
        saveHighScore();
      }
      //Write once after game over
      playBtn.classList.remove(`hidden`);
      sendScore = true;
      writeScore();
    }
  }
  setTimeout(update, `${1000 - Math.pow(level, 1.65) * 20}`);
}

function loadScore() {
  //load score from local storage
  if (!localStorage.getItem(`hScores`)) {
    localStorage.setItem(`hScores`, JSON.stringify(highscores));
  } else {
    highscores = JSON.parse(localStorage.getItem(`hScores`));
  }
}

function saveHighScore() {
  localStorage.setItem(`hScores`, JSON.stringify(highscores));
}

function writeScore() {
  scoreLoc.innerHTML = ``;
  highscores.forEach((score) => {
    let listItem = document.createElement(`li`);
    listItem.innerText = `${score}`;
    scoreLoc.append(listItem);
  });
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
      currPiece = pieces.shift();
      pieces.push(generateRandomPiece());
    } else {
      let temp = currPiece;
      currPiece = hold;
      currPiece.row = 0;
      hold = temp;
    }
  }
  canHold = false;
}

function checkHoldAction() {
  console.log(`called`);
  console.log(holdCounter);
  if (touched && holdCounter > 30) {
    touched = false;
    holdCounter = 0;
    holdSwap();
  }
}

//determine what to do base on mouse action
function mouseAction() {
  let xDelta = Math.abs(mouseOnClick.x - mouseReleased.x);
  let yDelta = Math.abs(mouseOnClick.y - mouseReleased.y);
  if (xDelta > yDelta && canMoveHor && xDelta > 100) {
    if (mouseReleased.x > mouseOnClick.x) {
      if (currPiece.canMoveRight(board)) {
        currPiece.right();
      }
    } else {
      if (currPiece.canMoveLeft(board)) {
        currPiece.left();
      }
    }
    canMoveHor = false;
  } else if (yDelta > xDelta && yDelta > 150) {
    if (mouseReleased.y > mouseOnClick.y) {
      downSmash();
    }
  }
}

function mouseRelease() {
  let xDelta = Math.abs(mouseOnClick.x - mouseReleased.x);
  let yDelta = Math.abs(mouseOnClick.y - mouseReleased.y);

  if (xDelta < mouseDelta && yDelta < mouseDelta && !touched) {
    currPiece.rotate(board);
  }
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
        if (currPiece.canMoveDown(board)) {
          //move it into grid since init row at -1;
          currPiece.update();
        }
        let lineRemoved = removeCompletedRows();
        if (lineRemoved > 0) {
          combo++;
        } else {
          combo = 0;
        }
        score += parseInt(
          (2 + combo) / 2 + Math.pow(10, lineRemoved) * Math.pow(level, 2)
        );
        canHold = true;
      }
    }
    if (event.key == ` `) {
      downSmash();
      board = currPiece.addToGrid(board);
      pieces.push(generateRandomPiece());
      currPiece = pieces.shift();
      if (currPiece.canMoveDown(board)) {
        //move it into grid since init row at -1;
        currPiece.update();
      }
      let lineRemoved = removeCompletedRows();
      if (lineRemoved > 0) {
        combo++;
      } else {
        combo = 0;
      }
      score += parseInt(
        (2 + combo) / 2 + Math.pow(10, lineRemoved) * Math.pow(level, 2)
      );
      canHold = true;
    }
    if (event.key == `c`) {
      holdSwap();
    }
  }
});

bgm.addEventListener(`ended`, replayMusic, false);

volumeSlider.addEventListener(`click`, () => {
  volume = volumeSlider.value / 100;
  //set all audio to volume to update
  bgm.volume = volume;
  lineClearedSound.volume = volume;
});

clearBtn.addEventListener(`click`, () => {
  highscores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  saveHighScore();
  writeScore();
});

musicCheckBox.addEventListener(`click`, () => {
  mute = musicCheckBox.checked;
  console.log(mute);
  if (!mute) {
    replayMusic();
  } else {
    bgm.pause();
  }
});

playBtn.addEventListener(`click`, start);

gameboard.addEventListener(`touchstart`, (event) => {
  mouseOnClick.x = event.touches[0].pageX;
  mouseOnClick.y = event.touches[0].pageY;
  holdCounter = 0;
  touched = true;
  if (play) {
    console.log(`if statement true`);
  }
});

gameboard.addEventListener(`touchmove`, (event) => {
  mouseReleased.x = event.changedTouches[0].pageX;
  mouseReleased.y = event.changedTouches[0].pageY;
  holdCounter++;
  if (play) {
    mouseAction();
  }
});

gameboard.addEventListener(`touchend`, (event) => {
  mouseReleased.x = event.changedTouches[0].pageX;
  mouseReleased.y = event.changedTouches[0].pageY;
  touched = false;
  if (play) {
    mouseRelease();
  }
});

//removing right click
if (mobile) {
  document.addEventListener('contextmenu', (event) => event.preventDefault());
}
init();
