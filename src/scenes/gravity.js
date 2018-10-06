import 'phaser';
import pkg from 'phaser/package.json';
import Player from '../characters/player';
import Switch from '../characters/switch';

const WHITE_RGBA = 'rgba(255,255,255,1)';
const BLACK_RGBA = 'rgba(0,0,0,1)';

var player;
var platforms;
var cursors;
var stars;
var objects = {};

class Gravity extends Phaser.Scene {
  constructor () {
    super({
      key: 'gravity',
      active: false
    })
    window._scene = this;
  }

  create (config) {
    const thisScene = this;

    objects.camera = this.cameras.add(0, 0, 800, 600);

    // Create platform groups. We will use these to toggle collision boundaries.
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'white_platform',).setScale(2).refreshBody();
    platforms.create(50, 250, 'white_platform');
    platforms.create(600, 400, 'white_platform');
    platforms.create(750, 220, 'white_platform');

    // Create player
    player = (new Player(this, 100, 450, 'dude')).instance

    // Create "gravity switcher"
    const gravitySwitch1 = (new Switch(this, 300, 500, 'bomb')).instance
    const gravitySwitch2 = (new Switch(this, 20, 200, 'bomb')).instance

    // Add collisions
    this.physics.add.collider(player, platforms);

    this.physics.add.overlap(player, gravitySwitch1, (player, target) => {
      thisScene._changeGravity();
      target.disableBody(true, true);
    }, null, this);

    this.physics.add.overlap(player, gravitySwitch2, (player, target) => {
      thisScene._changeGravity();
      target.disableBody(true, true);
    }, null, this);

    // Add inputs
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_W', () => this._changeGravity.call(this, 'up'));
    this.input.keyboard.on('keydown_A', () => this._changeGravity.call(this, 'left'));
    this.input.keyboard.on('keydown_S', () => this._changeGravity.call(this, 'down'));
    this.input.keyboard.on('keydown_D', () => this._changeGravity.call(this, 'right'));

    this.input.keyboard.on('keydown_N', () => {
      thisScene.scene.start('colors')
    });

    objects.camera.setBackgroundColor(BLACK_RGBA);
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

  update () {
    const gravityDirection = this._getGravityDirection()

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

    if (cursors.up.isDown && (player.body.blocked[gravityDirection] || player.body.touching[gravityDirection])) { // apply force relative to the player
      playerAxis = 'y';
      // inverse if right or left
      if (gravityDirection === 'left' || gravityDirection === 'right') {
        playerVelocity = 330;
      } else {
        playerVelocity = -330;
      }
    }

    let absoluteAxis = this._axisHelper(gravityDirection, playerAxis, playerVelocity);
    player['setVelocity'+absoluteAxis.axis.toUpperCase()](absoluteAxis.velocity)
  }

  _changeGravity (desiredDirection) {
    const gravityDirection = this._getGravityDirection();

    if (!desiredDirection) {
      const gravityDirection = this._getGravityDirection();

      // TODO: make this not dumb
      if (gravityDirection === 'left' || gravityDirection === 'right') {
        desiredDirection = 'down'
      }
      if (gravityDirection === 'up' || gravityDirection === 'down') {
        desiredDirection = 'left'
      }
    }

    // reset
    this.physics.world.gravity.y = 0;
    this.physics.world.gravity.x = 0;

    // set force from appropraite direction
    if (desiredDirection === 'left') {
      this.physics.world.gravity.x = -330;
      player.angle = 90;
    }
    if (desiredDirection === 'up') {
      this.physics.world.gravity.y = -330;
      player.angle = 180;
    }
    if (desiredDirection === 'right') {
      this.physics.world.gravity.x = 330;
      player.angle = -90;
    }
    if (desiredDirection === 'down') {
      this.physics.world.gravity.y = 330;
      player.angle = 0;
    }
  }

  _getGravityDirection () {
    const { x, y } = this.physics.world.gravity;

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
}

export default Gravity;
