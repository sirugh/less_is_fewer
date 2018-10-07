import LevelGenerator from './generator';

const config = {
  key: 'level-2',
  active: false,
  nextLevel: 'level-3',
  player: { x: 100, y: 450 },
  exit: { x: 50, y: 100 },
  platforms: [
    { x: 200, y: 150, texture: 'white_platform' },
    { x: 200, y: 350, texture: 'white_platform' },
    { x: 200, y: 550, texture: 'white_platform' },
    { x: 600, y: 250, texture: 'black_platform' },
    { x: 600, y: 450, texture: 'black_platform' }
  ],
  colorSwitches: [
    { x: 200, y: 100 },
    { x: 200, y: 300 },
    { x: 600, y: 400 },
    { x: 600, y: 200 },
  ],
  gravitySwitches: []
}

export default LevelGenerator(config);
