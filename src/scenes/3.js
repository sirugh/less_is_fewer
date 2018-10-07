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

class Level3 extends Phaser.Scene {
  constructor () {
    super({
      key: 'level-3',
      active: false
    })
  }

  create (config) {
    const thisScene = this;

    objects.camera = this.cameras.add(0, 0, 800, 600);

    // Create platform groups. We will use these to toggle collision boundaries.
    platforms = this.physics.add.staticGroup();
    platforms.create(100, 550, 'white_platform')
    platforms.create(700, 450, 'black_platform')
    platforms.create(100, 350, 'white_platform')
    platforms.create(700, 250, 'black_platform')
    platforms.create(100, 150, 'white_platform')

    // Create player
    this.player = new Player(this, 100, 450, 'dude')
    const playerSprite = this.player.sprite;


    // Create "color switcher"
    objects.colorSwitches = [
      (new Switch(this, 515, 400, 'star')).instance,
      (new Switch(this, 285, 300, 'star')).instance,
      (new Switch(this, 515, 200, 'star')).instance,
      (new Switch(this, 285, 100, 'star')).instance
    ]

    // Add collisions
    this.physics.add.collider(playerSprite, platforms);

    objects.colorSwitches.forEach(item => {
      this.physics.add.overlap(playerSprite, item, this._toggleColor, null, this);
    });

    // Create exit
    const exit = (new Switch(this, 50, 100, 'exit')).instance
    this.physics.add.overlap(playerSprite, exit, this._toggleNextLevel, null, this);

    // Add inputs
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_R', this._toggleColor.bind(this));

    this.input.keyboard.on('keydown_N', this._toggleNextLevel.bind(this));

    objects.camera.setBackgroundColor(BLACK_RGBA);
    this._updatePlatformCollisions();
  }

  _toggleNextLevel () {
    this.scene.start('end');
  }

  _toggleColor (player, target) {
    this._changeBackground();
    this._updatePlatformCollisions();

    this.player.toggleColor();
    target && target.disableBody(true, true);
  }

  update () {
<<<<<<< HEAD
    if((player.body.blocked.down && !player.body.touching.down)
    ){
=======
    if (this.player.isTouchingWorld()) {
>>>>>>> 875adbc133635a4f5a3c9fb0a8bf7db53efa3f5c
      this.scene.restart();
    }

    this.player.handleMovement(cursors, utils.getGravityDirection(this.physics.world.gravity));
  }

  _updatePlatformCollisions() {
    platforms.children.entries.forEach(platform => {
      // If platform color === background color,
      // disable platform
      // else enable platform
      const platformIsWhite = platform.texture.key === 'white_platform';
      const platformIsBlack = platform.texture.key === 'black_platform';

      if (this._backgroundIsWhite() && platformIsWhite) {
        platform.disableBody(true, true)
      }
      else if (this._backgroundIsBlack() && platformIsBlack) {
        platform.disableBody(true, true)
      }
      else {
        platform.enableBody(false, platform.x, platform.y, true, true);
      }
    });
  }

  _backgroundIsWhite() {
    return objects.camera.backgroundColor.rgba === WHITE_RGBA;
  }

  _backgroundIsBlack() {
    return objects.camera.backgroundColor.rgba === BLACK_RGBA;
  }

  _changeBackground () {
    // Get current rgba
    const currColor = objects.camera.backgroundColor.rgba

    if (this._backgroundIsWhite()) {
      objects.camera.setBackgroundColor(BLACK_RGBA);
    }
    else {
      objects.camera.setBackgroundColor(WHITE_RGBA);
    }

  }
}

export default Level3;
