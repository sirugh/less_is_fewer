import LevelGenerator from './generator';

const config = {
  key: 'level-1',
  active: false,
  nextLevel: 'level-2',
  player: { x: 100, y: 450 },
  exit: { x: 700, y: 500 },
  platforms: [
    { x: 0, y: 550, texture: 'white_platform' },
    { x: 800, y: 550, texture: 'black_platform' }
  ],
  colorSwitches: [
    { x: 400, y: 350 }
  ],
  gravitySwitches: []
}

export default LevelGenerator(config);
