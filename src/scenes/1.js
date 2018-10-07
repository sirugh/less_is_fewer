import LevelGenerator from './generator';

const config = {
  key: '1',
  player: { x: 100, y: 450 },
  exit: { x: 700, y: 500 },
  platforms: [
    // Platforms are 200x32. x is middle alignment.
    { x: 100, y: 550, texture: 'white_platform' },
    { x: 700, y: 550, texture: 'black_platform' }
  ],
  colorSwitches: [
    { x: 400, y: 350 }
  ],
  gravitySwitches: [],
}

export default LevelGenerator(config);
