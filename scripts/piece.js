class Piece {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.available = [];
    this.kill = [];
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
    // TODO Fix and finish the generate available moves function
    this.available = [];
    let letter = this.type.toLowerCase();
    switch (letter) {
      case 'p':
        // Go a different direction depending on the color
        if (this.color === colors.dark) {
          if (this.y === 1) this.available.push([this.x, this.y + 2]);    // First move
          this.available.push([this.x, this.y + 1]);
        } 

        else {
          if (this.y === 6) this.available.push([this.x, this.y - 2]);    // First move
          this.available.push([this.x, this.y - 1]);
        }

        break;
      case 'k':
      case 'r':
      case 'q':
        this.available.push([this.x + 1, this.y]);
        this.available.push([this.x, this.y + 1]);
        this.available.push([this.x - 1, this.y]);
        this.available.push([this.x, this.y - 1]);

      case 'q':
      case 'k':
      case 'b':
        this.available.push([this.x + 1, this.y + 1]);
        this.available.push([this.x + 1, this.y - 1]);
        this.available.push([this.x - 1, this.y + 1]);
        this.available.push([this.x - 1, this.y - 1]);
        break;

      case 'n':
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

      if (board[x][y] !== '') this.kill.push([x, y]);
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
}