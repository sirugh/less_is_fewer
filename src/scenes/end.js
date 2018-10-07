import LevelGenerator from './generator';

const config = {
  key: 'end',
  active: false,
  nextLevel: 'level-1',
  player: { x: 100, y: 450 },
  exit: { x: 700, y: 500 },
  platforms: [
    { x: 100, y: 550, texture: 'white_platform' },
    { x: 700, y: 550, texture: 'black_platform' }
  ],
  colorSwitches: [
    { x: 400, y: 350 }
  ],
  gravitySwitches: [],
  text: 'END'
}

export default LevelGenerator(config);
