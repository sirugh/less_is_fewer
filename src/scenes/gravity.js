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

    this.input.keyboard.on('keydown_G', this._changeGravity.bind(this));

    this.input.keyboard.on('keydown_N', () => {
      thisScene.scene.start('colors')
    });

    objects.camera.setBackgroundColor(BLACK_RGBA);
  }

  update () {
    const gravityDirection = this._getGravityDirection()
    if (gravityDirection === 'y') {
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
    else {
      if (cursors.left.isDown) {
        player.setVelocityY(-160);
      }
      else if (cursors.right.isDown) {
        player.setVelocityY(160);
      }
      else {
        player.setVelocityY(0);
      }

      if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityX(330);
      }
    }
  }

  _changeGravity () {
    const gravityDirection = this._getGravityDirection();
    if (gravityDirection === 'y') {
      player.angle += 90;
    } else {
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

export default Gravity;
