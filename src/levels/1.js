import 'phaser';
import pkg from 'phaser/package.json';
import BallE from '../characters/ball-e';

var player;
var platforms;
var cursors;
var stars;

function collectStar (player, star) {
  star.disableBody(true, true);
}

class Level1 extends Phaser.Scene {
  constructor () {
    super({
      key: 'level1',
      active: true
    })
  }

  preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create (config) {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = (new BallE(this, 100, 450, 'dude')).initialize()

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.input.keyboard.on('keydown_G', (event) => {
      const tempY = this.physics.world.gravity.y
      const tempX = this.physics.world.gravity.x

      this.physics.world.gravity.y = -tempX;
      this.physics.world.gravity.x = -tempY;
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



export default Level1;
