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

class Colors extends Phaser.Scene {
  constructor () {
    super({
      key: 'colors',
      active: false
    })
  }

  create (config) {
    const thisScene = this;

    objects.camera = this.cameras.add(0, 0, 800, 600);

    // Create platform groups. We will use these to toggle collision boundaries.
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'black_platform',).setScale(2).refreshBody();
    platforms.create(50, 250, 'black_platform');
    platforms.create(400, 568, 'white_platform').setScale(2).refreshBody();
    platforms.create(600, 400, 'white_platform');
    platforms.create(750, 220, 'white_platform');

    // Create player
    player = (new Player(this, 100, 450, 'dude')).instance

    // Create "color switcher"
    const colorSwitch1 = (new Switch(this, 150, 500, 'star')).instance;
    const colorSwitch2 = (new Switch(this, 450, 350, 'star')).instance;
    const colorSwitch3 = (new Switch(this, 100, 200, 'star')).instance;

    // Add collisions
    this.physics.add.collider(player, platforms);

    this.physics.add.overlap(player, colorSwitch1, this._toggleColor, null, this);
    this.physics.add.overlap(player, colorSwitch2, this._toggleColor, null, this);
    this.physics.add.overlap(player, colorSwitch3, this._toggleColor, null, this);

    // Add inputs
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_R', this._toggleColor.bind(this));

    this.input.keyboard.on('keydown_N', () => {
      thisScene.scene.start('gravity')
    });

    objects.camera.setBackgroundColor(BLACK_RGBA);
    this._updatePlatformCollisions();
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

export default Colors;
