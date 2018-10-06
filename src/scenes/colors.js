import 'phaser';
import pkg from 'phaser/package.json';
import BallE from '../characters/ball-e';
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
    player = (new BallE(this, 100, 450, 'dude')).instance

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

    this.input.keyboard.on('keydown_G', this._changeGravity.bind(this));

    this.input.keyboard.on('keydown_R', this._toggleColor.bind(this));

    this.input.keyboard.on('keydown_N', () => {
      thisScene.scene.start('gravity')
    });

    objects.camera.setBackgroundColor(WHITE_RGBA);
    this._updatePlatformCollisions();
  }

  _toggleColor (player, target) {
    this._changeBackground();
    this._updatePlatformCollisions();
    target && target.disableBody(true, true);
  }

  update () {
    const gravityDirection = this._getGravityDirection()
    if (gravityDirection === 'y') {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
      }
      else {
        player.setVelocityX(0);
        player.anims.play('turn', true);
      }

      if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330);
      }
    }
    else {
      if (cursors.left.isDown) {
        player.setVelocityY(-160);
        player.anims.play('left', true);
      }
      else if (cursors.right.isDown) {
        player.setVelocityY(160);
        player.anims.play('right', true);
      }
      else {
        player.setVelocityY(0);
        player.anims.play('turn');
      }

      if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityX(330);
      }
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

  _changeGravity () {
    const gravityDirection = this._getGravityDirection();
    if (gravityDirection === 'y') {
      player.angle += 90;
    } else {x
      player.angle -= 90;
    }
    const tempY = this.physics.world.gravity.y
    const tempX = this.physics.world.gravity.x

    this.physics.world.gravity.y = -tempX;
    this.physics.world.gravity.x = -tempY;
  }

  _getGravityDirection () {
    const { x, y } = this.physics.world.gravity;

    if (x < 0) {
      return 'x'
    }
    else {
      return 'y'
    }
  }
}

export default Colors;
