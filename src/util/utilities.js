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

export {
  getGravityDirection
}
