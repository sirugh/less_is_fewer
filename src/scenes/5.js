import LevelGenerator from './generator';

const config = {
  key: '5',
  player: { x: 100, y: 450 },
  exit: { x: 100, y: 200 },
  platforms: [
    { x: 32, y: 200, texture: 'black_platform_vertical' },
    { x: 300, y: 200, texture: 'black_platform_vertical' },
    { x: 100, y: 550, texture: 'white_platform' },
  ],
  colorSwitches: [
    { x: 400, y: 350 }
  ],
  gravitySwitches: [
    { x: 500, y: 250 }
  ],
}

export default LevelGenerator(config);
