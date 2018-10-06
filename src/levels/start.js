import 'phaser';
import pkg from 'phaser/package.json';

class Level1 extends Phaser.Scene {
  constructor () {
    super({
      key: 'start',
      active: true
    })
  }
  create (config) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const welcomeMessage = `START SCREEN`;

    this.add
      .text(centerX, centerY * 0.8, welcomeMessage, { font: "bold 30px Arial", fill: "#fff" })
      .setOrigin(0.5, 0.5);
  }
}

export default Level1;
