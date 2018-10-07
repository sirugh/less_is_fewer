import LevelGenerator from './generator';

const config = {
  key: '6',
  player: { x: 100, y: 450 },
  exit: { x: 700, y: 100 },
  platforms: [
    { x: 760, y: 200, texture: 'black_platform_vertical' },
    { x: 450, y: 200, texture: 'black_platform_vertical' },

    { x: 100, y: 50, texture: 'white_platform' },
    { x: 100, y: 550, texture: 'white_platform' },
    { x: 300, y: 550, texture: 'white_platform' },
    { x: 500, y: 550, texture: 'white_platform' },
    { x: 700, y: 550, texture: 'white_platform' },
    { x: 700, y: 50, texture: 'white_platform' },
  ],
  colorSwitches: [
    { x: 400, y: 250 }
  ],
  gravitySwitches: [
    { x: 100, y: 350, direction: 'up'},
    { x: 100, y: 350, direction: 'up'}
  ],
}

export default LevelGenerator(config);
