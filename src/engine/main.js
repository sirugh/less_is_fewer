import 'phaser';
import pkg from 'phaser/package.json';

const width = 800;
const height = 600;

const config = {
  width,
  height,
  type: Phaser.AUTO,
  scene: { preload, create },
};

const game = new Phaser.Game(config);

function preload() {

}

function create() {
  const centerX = width / 2;
  const centerY = height / 2;
  const welcomeMessage = `Welcome to Phaser ${pkg.version}`;

  this.add
    .text(centerX, centerY * 0.8, welcomeMessage, { font: "bold 19px Arial", fill: "#fff" })
    .setOrigin(0.5, 0.5);
}
