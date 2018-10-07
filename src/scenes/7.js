import LevelGenerator from './generator';

const config = {
  key: '7',
  player: { x: 100, y: 450 },
  exit: { x: 500, y: 100 },
  platforms: [
    { x: 450, y: 500, texture: 'black_platform_vertical' },
    { x: 760, y: 500, texture: 'black_platform_vertical' },

    { x: 100, y: 550, texture: 'white_platform' },
    { x: 300, y: 550, texture: 'white_platform' },
    { x: 500, y: 550, texture: 'white_platform' },
    { x: 700, y: 550, texture: 'white_platform' },
  ],
  colorSwitches: [
    { x: 300, y: 500 }
  ],
  gravitySwitches: [
    { x: 760, y: 300, direction: 'up'},
  ],
}

export default LevelGenerator(config);
