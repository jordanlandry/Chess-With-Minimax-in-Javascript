class Piece {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.available = [];
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
    console.log(path);

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
          this.available.push([this.x, this.y + 1]);
        } else this.available.push([this.x, this.y - 1]);
        break;

      case 'k':
      case 'r':
      case 'q':
        this.available.push([this.x + 1, this.y]);
        this.available.push([this.x, this.y + 1]);
        this.available.push([this.x - 1, this.y]);
        this.available.push([this.x, this.y - 1]);
        break;

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

    this.showAvailableMoves(this.available);
  }

  showAvailableMoves(available) {
    // TODO Show the available moves using a different color
    for (let i = 0; i < available.length; i++) {
      context.fillStyle = colors.available;
      drawRect(available[i][0] * w, available[i][1] * w, w, w);
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