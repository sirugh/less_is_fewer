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

class End extends Phaser.Scene {
  constructor () {
    super({
      key: 'end',
      active: false
    })
  }

  create (config) {
    const thisScene = this;
    const centerX = 800 / 2;
    const centerY = 600 / 2;

    objects.camera = this.cameras.add(0, 0, 800, 600);

    // Create platform groups. We will use these to toggle collision boundaries.
    platforms = this.physics.add.staticGroup();
    platforms.create(0, 550, 'white_platform')
    platforms.create(800, 550, 'black_platform')

    // Create player
    this.player = new Player(this, 100, 450, 'dude')
    const playerSprite = this.player.sprite;


    // Create "color switcher"
    objects.colorSwitches = [
      (new Switch(this, 400, 350, 'star')).instance,
    ]

    // Add collisions
    this.physics.add.collider(playerSprite, platforms);

    objects.colorSwitches.forEach(item => {
      this.physics.add.overlap(playerSprite, item, this._toggleColor, null, this);
    });

    // Create exit
    const exit = (new Switch(this, centerX, centerY * 0.5, 'exit')).instance
    this.physics.add.overlap(playerSprite, exit, this._toggleNextLevel, null, this);

    // Add inputs
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_R', this._toggleColor.bind(this));
    this.input.keyboard.on('keydown_N', this._toggleNextLevel.bind(this));

    objects.camera.setBackgroundColor(BLACK_RGBA);

    this._updatePlatformCollisions();

    const welcomeMessage = `THE END`;

    this.add
      .text(centerX, centerY * 0.8, welcomeMessage, { font: "bold 30px Arial", fill: "#fff" })
      .setOrigin(0.5, 0.5);
  }

  _toggleNextLevel () {
    this.scene.start('level-1');
  }

  _toggleColor (player, target) {
    this._changeBackground();
    this._updatePlatformCollisions();

    this.player.toggleColor();
    target && target.disableBody(true, true);
  }

  update () {
    if (this.player.isTouchingWorld()) {
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

export default End;
