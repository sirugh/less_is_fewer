import 'phaser';
import pkg from 'phaser/package.json';
import BallE from '../characters/ball-e';

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
    const gravityToggler = this.physics.add.image(400, 100, 'star');

    // Add collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(gravityToggler, platforms);

    this.physics.add.overlap(player, gravityToggler, (player, target) => {
      thisScene._changeGravity();
      thisScene._changeBackground();
      target.disableBody(true, true); // or target.destroy()
    }, null, this);

    // Add inputs
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown_G', this._changeGravity);

    this.input.keyboard.on('keydown_R', () => {
      thisScene._changeBackground();
    });
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
    const color = new Phaser.Display.Color();
    color.random(50);
    objects.camera.setBackgroundColor(color.rgba);
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
