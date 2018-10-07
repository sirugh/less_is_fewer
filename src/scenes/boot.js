import 'phaser';
import colors from '../util/colors';
const FIRST_LEVEL = '1';
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
    this.load.image('exit', 'assets/ruby.png');
    this.load.image('white_platform', 'assets/white_platform.png');
    this.load.image('black_platform', 'assets/black_platform.png');
    this.load.image('white_platform_vertical', 'assets/white_platform_vertical.png');
    this.load.image('black_platform_vertical', 'assets/black_platform_vertical.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');

    this.load.on('progress', this.onLoadProgress, this);
    this.load.on('complete', this.onLoadComplete, this);
    this.createProgressBar();
  }

  create (config) {
    console.log('Booting!')
    this.scene.start('audio');
    this.scene.start('ui');
    this.scene.start(FIRST_LEVEL).remove();
  }

  createProgressBar () {
    var main = this.cameras.main;
    this.progressBarRectangle = new Phaser.Geom.Rectangle(0, 0, 0.5 * main.width, 50);
    Phaser.Geom.Rectangle.CenterOn(this.progressBarRectangle, 0.5 * main.width, 0.5 * main.height);
    this.progressBar = this.add.graphics();
  }

  onLoadComplete (loader, totalComplete, totalFailed) {
    console.debug('Loaded assets', totalComplete);
    console.debug('Assets failed', totalFailed);
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
}

export default Boot;
