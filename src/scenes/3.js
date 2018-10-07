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
    platforms.create(0, 550, 'white_platform')
    platforms.create(800, 550, 'black_platform')

    // Create player
    player = (new Player(this, 100, 450, 'dude')).instance

    // Create "color switcher"
    objects.colorSwitches = [
      (new Switch(this, 400, 350, 'star')).instance,
    ]

    // Add collisions
    this.physics.add.collider(player, platforms);

    objects.colorSwitches.forEach(item => {
      this.physics.add.overlap(player, item, this._toggleColor, null, this);
    });

    // Create exit
    const exit = (new Switch(this, 700, 500, 'exit')).instance
    this.physics.add.overlap(player, exit, this._toggleNextLevel, null, this);

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
    this._togglePlayerColor(player);

    target && target.disableBody(true, true);
  }

  _togglePlayerColor (player) {
    if (player) {
      if (player.isTinted) {
        player.clearTint()
      }
      else {
        player.setTint(0x000000)
      }
    }
  }

  update () {
    if((player.body.blocked.left && !player.body.touching.left)
      || (player.body.blocked.up && !player.body.touching.up)
      || (player.body.blocked.right && !player.body.touching.right)
      || (player.body.blocked.down && !player.body.touching.down)
    ){
      this.scene.restart();
    }
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
    }
    else if (cursors.right.isDown) {
      player.setVelocityX(160);
    }
    else {
      player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down){
      player.setVelocityY(-330);
    }
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
