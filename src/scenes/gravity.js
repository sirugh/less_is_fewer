import 'phaser';
import pkg from 'phaser/package.json';
import BallE from '../characters/ball-e';
import Switch from '../characters/switch';

var player;
var platforms;
var cursors;
var stars;
var objects = {};

class Gravity extends Phaser.Scene {
  constructor () {
    super({
      key: 'gravity',
      active: true
    })
  }

  preload () {
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create (config) {
    const thisScene = this;

    objects.camera = this.cameras.add(0, 0, 800, 600);
    this._changeBackground();

    // Create platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Create player
    player = (new BallE(this, 100, 450, 'dude')).instance

    // Create "gravity switcher"
    const gravitySwitch = (new Switch(this, 300, 500, 'bomb')).instance

    // Create "color switcher"
    const colorSwitch1 = (new Switch(this, 150, 500, 'star')).instance;
    const colorSwitch2 = (new Switch(this, 200, 500, 'star')).instance;

    // Add collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(gravitySwitch, platforms);

    this.physics.add.overlap(player, colorSwitch1, this._collideColorSwitch, null, this);

    this.physics.add.overlap(player, colorSwitch2, this._collideColorSwitch, null, this);

    this.physics.add.overlap(player, gravitySwitch, (player, target) => {
      thisScene._changeGravity();
      target.disableBody(true, true); // or target.destroy()
    }, null, this);

    // Add inputs
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_G', this._changeGravity);

    this.input.keyboard.on('keydown_R', this._changeBackground);
  }

  _collideColorSwitch (player, target) {
    this._changeBackground();
    target.disableBody(true, true); // or target.destroy()
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
        player.anims.play('turn');
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

  _changeBackground () {
    // Get current rgba
    const currColor = objects.camera.backgroundColor.rgba

    if (currColor === 'rgba(255,255,255,1)') {
      objects.camera.setBackgroundColor('rgba(0,0,0,1)');
    }
    else {
      objects.camera.setBackgroundColor('rgba(255,255,255,1)');
    }

  }

  _changeGravity () {
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
