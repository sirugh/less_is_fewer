const JUMP_BUFFER_FRAMES = 5;
export default class Player {
  constructor (scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(
      x,
      y,
      texture
    )
    this.sprite.setScale(0.5);
    this.sprite.setCollideWorldBounds(true);

    // Initialize a jump buffer!
    // TODO: 5 frames is fine for now, but test this on a streaming device like
    // a steam link to be sure.
    this._jumpBuffer = (new Array(JUMP_BUFFER_FRAMES)).fill(false);
  }

  update (cursors, gravityDirection) {
    this._updateJumpBuffer(gravityDirection);
    this._handleMovement(cursors, gravityDirection)
  }

  /**
   * Puts true in the jump buffer for a frame if we are allowed to jump.
   * In this way we can keep track of N frames jump eligibility.
   * @param {String} gravityDirection - up, down, left or right.
   */
  _updateJumpBuffer (gravityDirection) {
    if (this.sprite.body.blocked[gravityDirection]
      || this.sprite.body.touching[gravityDirection]) {
      this._jumpBuffer.unshift(true);
    } else {
      this._jumpBuffer.unshift(false);
    }

    // Then, remove the oldest frame.
    this._jumpBuffer.pop();
  }

  // If the buffer contains true, we CAN!
  _canJump() {
    return this._jumpBuffer.includes(true);
  }

  /**
   * If tinted (black) remove tint (make white), otherwise apply tint!
   */
  toggleColor () {
    if (this.sprite.isTinted) {
      this.sprite.clearTint();
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

  _handleMovement (cursors, gravityDirection) {
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

    if (cursors.up.isDown && this._canJump()) {
      // Reset the jump buffer so if a player is pressing up we don't continue
      // to add velocity/play the jump sound, etc.
      this._jumpBuffer = (new Array(JUMP_BUFFER_FRAMES)).fill(false);

      this.scene.scene.get('audio').trigger({
        key: 'jump'
      });

      // apply force relative to the player
      playerAxis = 'y';
      // inverse if right or left
      if (gravityDirection === 'left' || gravityDirection === 'right') {
        playerVelocity = 330;
      } else {
        playerVelocity = -330;
      }
    }

    let absoluteAxis = this._axisHelper(gravityDirection, playerAxis, playerVelocity);
    this.sprite[`setVelocity${absoluteAxis.axis.toUpperCase()}`](absoluteAxis.velocity)
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
