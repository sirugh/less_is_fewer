import 'phaser';
import pkg from 'phaser/package.json';
import scenes from '../scenes';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  scene: scenes
};

const game = new Phaser.Game(config);

// setTimeout(() => {
//   game.scene.stop('start');
//   game.scene.start('level1');
// }, 1000);
