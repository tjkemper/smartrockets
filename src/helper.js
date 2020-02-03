// Constants
export const ZERO_VECTOR = [0, 0];

// Helper functions
export function randomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function outOfBounds(sprite, windowWidth, windowHeight) {
  let x = sprite.x;
  let y = sprite.y;
  let width = sprite.width;
  let height = sprite.height;
  
  if (x < 0 || y < 0 || x + width > windowWidth || y + height > windowHeight) {
    return true;
  }

  return false;
}

export function spriteCollide(sprite1, sprite2) {
  return rectRect(sprite1.x, sprite1.y, sprite1.width, sprite1.height,
                  sprite2.x, sprite2.y, sprite2.width, sprite2.height);
}

export function rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // are the sides of one rectangle touching the other?
  if (r1x + r1w >= r2x &&    // r1 right edge past r2 left
      r1x <= r2x + r2w &&    // r1 left edge past r2 right
      r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
      r1y <= r2y + r2h) {    // r1 bottom edge past r2 top
        return true;
  }
  return false;
}

export function Random2DVector(mag = 1) {
  let x = (Math.random() * 2 - 1) * mag;
  let y = (Math.random() * 2 - 1) * mag;
  return [x, y];
}

export function addVectors(vector1, vector2) {
  if (vector1.length !== vector2.length) {
    throw "Vectors must have the same length.";
  }
  let newVector = [];
  for (let i = 0; i < vector1.length; i++) {
    newVector.push(vector1[i] + vector2[i]);
  }
  return newVector;
}
