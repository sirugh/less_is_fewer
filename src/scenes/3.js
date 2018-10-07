import LevelGenerator from './generator';

const config = {
  key: '3',
  player: { x: 100, y: 50 },
  exit: { x: 100, y: 150 },
  platforms: [
    { x: 100, y: 100, texture: 'white_platform' },
    { x: 300, y: 100, texture: 'white_platform' },
    { x: 500, y: 100, texture: 'white_platform' },
    { x: 700, y: 100, texture: 'white_platform' },

    { x: 100, y: 300, texture: 'black_platform' },
    { x: 400, y: 400, texture: 'black_platform' },
    { x: 700, y: 500, texture: 'black_platform' },
  ],
  colorSwitches: [
    { x: 700, y: 50 }
  ],
  gravitySwitches: [
  ],
  text: 'FALL'
}

export default LevelGenerator(config);
