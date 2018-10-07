import { WHITE_RGBA, BLACK_RGBA } from './constants';

/**
 * Takes x,y values for gravity and returns name of the direction
 *
 * @param {Object} gravity
 * @returns {String} 'up', 'down', 'left', or 'right'
 */
const getGravityDirection = (gravity) =>{
  const { x, y } = gravity;

  if (y > 0 && x === 0) {
    return 'down'
  }
  if (y < 0 && x === 0) {
    return 'up'
  }
  if (x < 0 && y === 0) {
    return 'left'
  }
  return 'right'
}

// Camera utility to change background color from black to white
// This would be better if there was just a toggle on the camera object
const changeBackgroundColor = (camera) =>{
  if (isWhite(camera.backgroundColor.rgba)) {
    camera.setBackgroundColor(BLACK_RGBA);
  }
  else {
    camera.setBackgroundColor(WHITE_RGBA);
  }
}

/**
 * Disable platforms that are the same color as the background color.
 * 
 * @param {*} platform
 * @param {*} backgroundColor background color being switched to
 */
const updatePlatformCollisions = (platform, backgroundColor) =>{
  const platformIsWhite = (platform.texture.key === 'white_platform' || platform.texture.key === 'white_platform_vertical');
  const platformIsBlack = (platform.texture.key === 'black_platform' || platform.texture.key === 'black_platform_vertical');

  if (isWhite(backgroundColor) && platformIsWhite) {
    platform.disableBody(true, true)
  }
  else if (isBlack(backgroundColor) && platformIsBlack) {
    platform.disableBody(true, true)
  }
  else {
    platform.enableBody(false, platform.x, platform.y, true, true);
  }
}

function isWhite(rgba) {
  return rgba === WHITE_RGBA;
}

function isBlack(rgba) {
  return rgba === BLACK_RGBA;
}

export {
  changeBackgroundColor,
  getGravityDirection,
  updatePlatformCollisions
}
