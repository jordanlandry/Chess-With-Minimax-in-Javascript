class Piece {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.available = [];
    this.kill = [];
    this.moved = false;
  }

  getImage() {
    if (this.type === '') return '';

    // Change the path depending on the color and piece
    let path = 'assets/' + this.type.toLowerCase();
    if (this.color === colors.dark) path += 'b';
    else path += 'w';

    // All assets are png files
    path += '.png';

    let img = new Image();
    img.src = path;

    return img;
  }

  generateAvailableMoves() {
    this.available = [];
    let letter = this.type.toLowerCase();

    // Add to the available array
    if (letter === 'p') {

      // Go a different direction depending on the color
      if (this.color === colors.dark) {
        let targetX = this.x + 1;
        let targetY = this.y + 1;

        // Kill diagonally
        for (let i = 0; i < 2; i++) {
          if (targetX < GRIDCOUNT && targetX >= 0) {
            if (board[targetX][targetY] !== '' && board[targetX][targetY].color !== this.color) {
              this.available.push([targetX, targetY]);
            }
          }
          
          // Next check
          targetX = this.x - 1;
        }

        if (this.y === 1) this.available.push([this.x, this.y + 2]);    // First move
        this.available.push([this.x, this.y + 1]);
      }
  
      // White color
      else {
        let targetX = this.x + 1;
        let targetY = this.y - 1;

        // Kill diagonally 
        for (let i = 0; i < 2; i++) {
          if (targetX < GRIDCOUNT && targetX >= 0) {    // For pieces on the edge so it doesn't read an undefined value
            if (board[targetX][targetY] !== '' && board[targetX][targetY].color !== this.color) {
              this.available.push([targetX, targetY]);
            }
          }

          // Next check
          targetX = this.x - 1;
        }

        if (this.y === 6) this.available.push([this.x, this.y - 2]);    // First move
        this.available.push([this.x, this.y - 1]);
      }
    } 

    // Move straight
    if (letter === 'k' || letter === 'r' || letter === 'q') {

      // Be able to move until you run into another piece
      for (let i = this.x + 1; i < GRIDCOUNT; i++) {
        this.available.push([i, this.y]);
        if (board[i][this.y] !== '' || letter === 'k') break;
      }

      for (let i = this.x - 1; i >= 0; i--) {
        this.available.push([i, this.y]);
        if (board[i][this.y] !== '' || letter === 'k') break;
      }

      
      for (let i = this.y + 1; i < GRIDCOUNT; i++) {
        this.available.push([this.x, i]);
        if (board[this.x][i] !== '' || letter === 'k') break;
      }

      
      for (let i = this.y - 1; i >= 0; i--) {
        this.available.push([this.x, i]);
        if (board[this.x][i] !== '' || letter === 'k') break;
      }
    }

    // Move Diagonally
    if (letter === 'q' || letter === 'k' || letter === 'b') {

      for (let i = 1; ( this.x + i < GRIDCOUNT && this.y + i < GRIDCOUNT ); i++) {
        this.available.push([this.x + i, this.y + i]);
        if (board[this.x + i][this.y + i] !== '' || letter === 'k') break;
      }

      for (let i = 1; ( this.x + i < GRIDCOUNT && this.y - i >= 0 ); i++) {
        this.available.push([this.x + i, this.y - i]);
        if (board[this.x + i][this.y - i] !== '' || letter === 'k') break;
      }

      for (let i = 1; ( this.x - i >= 0 && this.y - i < GRIDCOUNT ); i++) {
        this.available.push([this.x - i, this.y + i]);
        if (board[this.x - i][this.y + i] !== '' || letter === 'k') break;
      }
      
      for (let i = 1; ( this.x - i >= 0 && this.y + i >= 0 ); i++) {
        this.available.push([this.x - i, this.y - i]);
        if (board[this.x - i][this.y - i] !== '' || letter === 'k') break;
      }
      
    }

    // Castling
    if (letter === 'k') {
      if (!this.moved) {

        // Castle to the right
        if (board[this.x + 1][this.y] === '') this.available.push([this.x + 2, this.y]);

        // Castling to the left
        if (board[this.x - 1][this.y] === '' && board[this.x - 3][this.y] === '') this.available.push([this.x - 2, this.y]);
      }
    }

    // Knight movement
    if (letter === 'n') {
      this.available.push([this.x + 1, this.y - 2]);
      this.available.push([this.x - 1, this.y - 2]);
      this.available.push([this.x + 1, this.y + 2]);
      this.available.push([this.x - 1, this.y + 2]);
      this.available.push([this.x - 2, this.y - 1]);
      this.available.push([this.x + 2, this.y - 1]);
      this.available.push([this.x + 2, this.y + 1]);
      this.available.push([this.x - 2, this.y + 1]);
    }

    // Remove incorrect spots
    let newAvailable = [];

    for (let i = 0; i < this.available.length; i++) {
      let x = this.available[i][0];
      let y = this.available[i][1];
      
      if (x < 0 || x >= GRIDCOUNT || y < 0 || y >= GRIDCOUNT) continue;       // Out of bounds
      if (board[x][y] !== '' && board[x][y].color === this.color) continue;   // Teammate is there

      newAvailable.push( [x, y] );
    }

    this.available = newAvailable;

    // Show the spots
    this.showAvailableMoves(this.available);
  }

  generateKillMoves() {
    this.kill = [];   // Reset the kill array

    // Run through available spots
    for (let i = 0; i < this.available.length; i++) {
      let x = this.available[i][0];
      let y = this.available[i][1];
      
      if (board[x][y] !== '') {
        // Special check for pawns because they cannot kill moving forwards
        if (this.type.toLowerCase() === 'p') {
          if (this.x === x) {
            this.available.splice(i, 1);    // Remove from the available array
            continue;
          }
        }

        this.kill.push( [x, y] );
      }
    }

    this.showKillMoves(this.kill);
  }

  showKillMoves(kill) {
    for (let i = 0; i < kill.length; i++) {
      let x = kill[i][0];
      let y = kill[i][1];
      
      drawRect(x * w, y * w, w, w, colors.overtake);
    }
  }

  kill() {

  }

  showAvailableMoves(available) {
    // TODO Show the available moves using a different color
    for (let i = 0; i < available.length; i++) {
      let x = available[i][0];
      let y = available[i][1];
      
      // Show the available spot if there isn't an empty piece there
      if (board[x][y] === '') drawRect(x * w, y * w, w, w, colors.available);
    }
  }

  show() {
    let xPos = this.x * w;
    let yPos = this.y * w;

    let img = this.getImage();

    if (img === '') return;

    img.onload = function() {
      context.drawImage(img, xPos, yPos, w * .95, w * .95);
    }
  }

  castle(dir) {
    console.log('a');

    if (dir === 'right') {
      board[this.x + 1][this.y] = board[this.x + 3][this.y];
      board[this.x + 3][this.y] = '';
  
      board[this.x + 1][this.y].x = this.x + 1;
      board[this.x + 1][this.y].y = this.y;
  
      board[this.x + 1][this.y].show();
      clearGridSpot(this.x + 3, this.y);  
    }

    else {
      board[this.x - 1][this.y] = board[this.x - 4][this.y];
      board[this.x - 4][this.y] = '';

      board[this.x - 1][this.y].x = this.x - 1;
      board[this.x - 1][this.y].y = this.y;

      board[this.x - 1][this.y].show();
      clearGridSpot(this.x - 4, this.y);
    }
  }
}