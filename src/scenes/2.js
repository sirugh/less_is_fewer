import LevelGenerator from './generator';

const config = {
  key: 'level-2',
  active: false,
  nextLevel: 'level-3',
  player: { x: 100, y: 450 },
  exit: { x: 50, y: 100 },
  platforms: [
    { x: 100, y: 150, texture: 'white_platform' },
    { x: 100, y: 350, texture: 'white_platform' },
    { x: 100, y: 550, texture: 'white_platform' },
    { x: 700, y: 250, texture: 'black_platform' },
    { x: 700, y: 450, texture: 'black_platform' }
  ],
  colorSwitches: [
    { x: 515, y: 400 },
    { x: 285, y: 300 },
    { x: 515, y: 200 },
    { x: 285, y: 100 },
  ],
  gravitySwitches: []
}

export default LevelGenerator(config);
