// Canvas setup
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Canvas Properties
const WIDTH = HEIGHT = 600;
var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;

// Board Properties
var board = [];
var pieces = [];
const GRIDCOUNT = 8;
const w = WIDTH / GRIDCOUNT;    // Size of each grid
const STARTINGPOS = [
  [ 'N','P','','','','','p','n'],
  [ 'R','P','','','','','p','r'],
  [ 'B','P','','','','','p','b'],
  [ 'Q','P','','','','','p','q'],
  [ 'K','P','','','','','p','k'],
  [ 'B','P','','','','','p','b'],
  [ 'R','P','','','','','p','r'],
  [ 'N','P','','','','','p','n'],
];

const colors = {
  'dark': '#bd9f75',
  'light': '#694719',
  'overtake' : '#a61e1e',
  'available' : '#378a81'
};

// Click Listener
let firstClick = true;
let pieceX;
let pieceY;
canvas.addEventListener("click", function(e){ 

  // Get Position of mouse click
  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  
  // Check if click is a valid position
  if ( ( x < 0 || x > WIDTH || y < 0 || y > HEIGHT ) ) return;
  
  // First click is picking up the piece, second click is placing it
  let xPos;
  let yPos;

  // Get board index of click
  xPos = Math.floor(x / w);
  yPos = Math.floor(y / w);

  // Check if you should place or select a piece
  let piece = board[xPos][yPos];
  if (firstClick) {
    if (piece === '') return;
    pieceX = xPos;
    pieceY = yPos;
    selectPiece(xPos, yPos);
  }

  else {
    // Set the piece to the previously clicked position
    piece = board[pieceX][pieceY];

    // Iterate through the available slots
    for (let i = 0; i < piece.available.length; i++) {
      if (xPos === piece.available[i][0] && yPos === piece.available[i][1]) {
        placePiece(board[pieceX][pieceY], xPos, yPos);
        firstClick = !firstClick;
        return;
      }
    }
    
    for (let i = 0; i < piece.available.length; i++) {
      clearGridSpot(piece.available[i][0], piece.available[i][1]);
    }
  }

  // Switch the click
  firstClick = !firstClick;

});

function setup() {
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
  canvas.style.border = "2px solid black";

  drawGrid();
  generatePieces();
  updatePieces();
}

// Draw the grid pattern on the board
function drawGrid() {
  let color;
  for ( let i = 0; i < GRIDCOUNT; i++ ) {
    for ( let j = 0; j < GRIDCOUNT; j++ ) {
      clearGridSpot(i, j);
    }
  }
}

// Clear the display on a grid spot
function clearGridSpot(x, y) {
  let color;
  if ( ( x + y ) % 2 === 0 ) color = colors.dark;
  else color = colors.light;

  drawRect(x * w, y * w, w, w, color);
}

// Initialize the pieces
function generatePieces() {
  let color = 0;
  for ( let i = 0; i < GRIDCOUNT; i++ ) {

    board.push( [] );

    for ( let j = 0; j < GRIDCOUNT; j++ ) {
      let letter = STARTINGPOS[i][j];
      
      // continue the loop if the board pos is nothing
      if ( letter === '' ) {
        board[i].push( '' );
        pieces.push( new Piece( i, j, '', '' ) );
        continue;
      }

      // Capital letter is black, lowercase is white
      if ( letter === letter.toUpperCase() ) {
        color = colors.dark;
      } else color = colors.light;

      // Add the pieces to the arrays
      board[i].push( new Piece( i, j, letter, color ) );
      pieces.push( board[i][j] );
    }
  }
}

// Shows the positions of the pieces
function updatePieces() {
  for (piece of pieces) {
    piece.show();
  }
}


// Placing the piece in the new position
function placePiece(piece, x, y) {
  board[piece.x][piece.y] = '';
  board[x][y] = piece;
  
  // Cover the previous spot with a new square
  clearGridSpot(piece.x, piece.y);

  piece.x = x;
  piece.y = y;

  piece.show();

  // Clear the grid spots for the available slots
  for (let i = 0; i < piece.available.length; i++) {
    clearGridSpot(piece.available[i][0], piece.available[i][1]);
  }
}

// Calls the generate moves function 
function selectPiece(x, y) {
  let piece = board[x][y];
  piece.generateAvailableMoves();
}

setup();