function drawRect(x, y, width, height, color='black') {
  // Transparent when overtaking
  if (color === colors.available || color === colors.overtake) context.globalAlpha = 0.5;

  context.fillStyle = color;
  context.fillRect(x, y, width, height);

  // Reset transparency
  context.globalAlpha = 1;
}

