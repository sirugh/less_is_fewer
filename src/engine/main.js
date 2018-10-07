import 'phaser';
import scenes from '../scenes';
import { GRAVITY } from '../util/constants';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GRAVITY },
      debug: true
    }
  },
  scene: scenes
};

const game = new Phaser.Game(config);
