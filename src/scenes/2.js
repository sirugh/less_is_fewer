import 'phaser';
import pkg from 'phaser/package.json';
import Player from '../characters/player';
import Switch from '../characters/switch';
import * as utils from '../util/utilities';

const WHITE_RGBA = 'rgba(255,255,255,1)';
const BLACK_RGBA = 'rgba(0,0,0,1)';

var platforms;
var cursors;
var stars;
var objects = {};

class Gravity extends Phaser.Scene {
  constructor () {
    super({
      key: 'level-2',
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
    this.player = new Player(this, 100, 450, 'dude')
    const playerSprite = this.player.sprite;

    // Create "gravity switcher"
    const gravitySwitch1 = (new Switch(this, 300, 500, 'bomb')).instance
    const gravitySwitch2 = (new Switch(this, 20, 200, 'bomb')).instance

    // Add collisions
    this.physics.add.collider(playerSprite, platforms);

    this.physics.add.overlap(playerSprite, gravitySwitch1, (player, target) => {
      thisScene._changeGravity();
      target.disableBody(true, true);
    }, null, this);

    this.physics.add.overlap(playerSprite, gravitySwitch2, (player, target) => {
      thisScene._changeGravity();
      target.disableBody(true, true);
    }, null, this);

    // Add inputs
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_W', () => this._changeGravity.call(this, 'up'));
    this.input.keyboard.on('keydown_A', () => this._changeGravity.call(this, 'left'));
    this.input.keyboard.on('keydown_S', () => this._changeGravity.call(this, 'down'));
    this.input.keyboard.on('keydown_D', () => this._changeGravity.call(this, 'right'));

    this.input.keyboard.on('keydown_N', this._toggleNextLevel.bind(this));

    // Create exit
    const exit = (new Switch(this, 20, 300, 'exit')).instance
    this.physics.add.overlap(playerSprite, exit, this._toggleNextLevel, null, this);

    objects.camera.setBackgroundColor(BLACK_RGBA);
  }

  _toggleNextLevel () {
    this.scene.start('level-3');
  }


  update () {
    if (this.player.isTouchingWorld()) {
      this.scene.restart();
    }

    this.player.handleMovement(cursors, utils.getGravityDirection(this.physics.world.gravity));
  }

  _changeGravity (desiredDirection) {
    const gravityDirection = utils.getGravityDirection(this.physics.world.gravity);

    if (!desiredDirection) {
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
      this.player.sprite.angle = 90;
    }
    if (desiredDirection === 'up') {
      this.physics.world.gravity.y = -330;
      this.player.sprite.angle = 180;
    }
    if (desiredDirection === 'right') {
      this.physics.world.gravity.x = 330;
      this.player.sprite.angle = -90;
    }
    if (desiredDirection === 'down') {
      this.physics.world.gravity.y = 330;
      this.player.sprite.angle = 0;
    }
  }
}

export default Gravity;
