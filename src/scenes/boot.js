import 'phaser';
import pkg from 'phaser/package.json';

class Boot extends Phaser.Scene {
  constructor () {
    super({
      key: 'start',
      active: false
    })
  }

  preload () {

  }
  create (config) {
    const centerX = 800 / 2;
    const centerY = 600 / 2;
    const welcomeMessage = `LOADING SCREEN`;

    this.add
      .text(centerX, centerY * 0.8, welcomeMessage, { font: "bold 30px Arial", fill: "#fff" })
      .setOrigin(0.5, 0.5);
  }
}

export default Boot;
