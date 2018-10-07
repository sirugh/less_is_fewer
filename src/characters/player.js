export default class Player {
  constructor (scene, x, y, texture) {
    this.sprite = scene.physics.add.sprite(
      x,
      y,
      texture
    )
    this.sprite.setScale(0.5);
    this.sprite.setCollideWorldBounds(true);
  }

  toggleColor () {
    if (this.isTinted) {
      this.sprite.clearTint()
    }
    else {
      this.sprite.setTint(0x000000)
    }
  }

  isTouchingWorld () {
    const player = this.sprite;
    return (player.body.blocked.left && !player.body.touching.left)
      || (player.body.blocked.up && !player.body.touching.up)
      || (player.body.blocked.right && !player.body.touching.right)
      || (player.body.blocked.down && !player.body.touching.down)
  }

  handleMovement (cursors, gravityDirection) {
    let playerAxis = 'x';
    let playerVelocity = 0;
    if (cursors.right.isDown) { // apply force relative to the player
      playerAxis = 'x';
      playerVelocity = 160;
    }

    if (cursors.left.isDown) { // apply force relative to the player
      playerAxis = 'x';
      playerVelocity = -160;
    }

    if (cursors.up.isDown && (this.sprite.body.blocked[gravityDirection] || this.sprite.body.touching[gravityDirection])) { // apply force relative to the player
      playerAxis = 'y';
      // inverse if right or left
      if (gravityDirection === 'left' || gravityDirection === 'right') {
        playerVelocity = 330;
      } else {
        playerVelocity = -330;
      }
    }

    let absoluteAxis = this._axisHelper(gravityDirection, playerAxis, playerVelocity);
    this.sprite['setVelocity'+absoluteAxis.axis.toUpperCase()](absoluteAxis.velocity)
  }

  /**
   * helper function for moving worlds
   * @param {string} gravityDirection - up, down, left, right relative to viewport/screen/real-life
   * @param {x} relativeAxis - axis relative to the character/sprite
   * @param {number} velocity
   */
  _axisHelper(worldOrientation, relativeAxis, velocity) {
    let flipAxis = (xOrY) => ({ x: 'y', y: 'x' })[xOrY];

    // init with defaults;
    let newAxis = relativeAxis;
    let newVelocity = velocity;

    if (worldOrientation === 'right') {
      newAxis = flipAxis(relativeAxis);
      newVelocity = newVelocity * -1;
    }
    if (worldOrientation === 'up') {
      newVelocity = newVelocity * -1;
    }
    if (worldOrientation === 'left') {
      newAxis = flipAxis(relativeAxis);
    }

    return {
      axis: newAxis,
      velocity: newVelocity
    }
  }
}
