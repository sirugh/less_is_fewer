import 'phaser';
import pkg from 'phaser/package.json';
import colors from '../util/colors';

class Boot extends Phaser.Scene {
  constructor () {
    super({
      key: 'start',
      active: true
    })

    this.progressBar = null;
    this.progressBarRectangle = null;
  }
  preload () {
    this.load.image('dude', 'assets/square_man.png');
    this.load.image('white_platform', 'assets/white_platform.png');
    this.load.image('black_platform', 'assets/black_platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');

    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
    this.createProgressBar();
  }

  create (config) {
    // this.createAnims();
    this.scene.start('gravity').remove();
  }

  createProgressBar () {
    var main = this.cameras.main;
    this.progressBarRectangle = new Phaser.Geom.Rectangle(0, 0, 0.5 * main.width, 50);
    Phaser.Geom.Rectangle.CenterOn(this.progressBarRectangle, 0.5 * main.width, 0.5 * main.height);
    this.progressBar = this.add.graphics();
  }

  onLoadComplete (loader, totalComplete, totalFailed) {
    console.debug('complete', totalComplete);
    console.debug('failed', totalFailed);
  }

  onLoadProgress (progress) {
    // console.debug('progress', progress);
    var rect = this.progressBarRectangle;
    var color = (this.load.totalFailed > 0) ? colors.RED : colors.WHITE;
    this.progressBar
      .clear()
      .fillStyle(colors.GRAY)
      .fillRect(rect.x, rect.y, rect.width, rect.height)
      .fillStyle(color)
      .fillRect(rect.x, rect.y, progress * rect.width, rect.height);
  }

  createAnims () {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }
}

export default Boot;
