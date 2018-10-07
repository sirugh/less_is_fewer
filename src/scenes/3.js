import LevelGenerator from './generator';

const config = {
  key: 'level-3',
  active: false,
  player: { x: 100, y: 450 },
  exit: { x: 10, y: 10 },
  platforms: [
    { x: 0, y: 200, texture: 'white_platform' },
    { x: 0, y: 400, texture: 'white_platform' },
    { x: 0, y: 600, texture: 'white_platform' },
    { x: 400, y: 600, texture: 'white_platform' },
  ],
  colorSwitches: [
    { x: 400, y: 250 }
  ],
  gravitySwitches: [
    { x: 750, y: 500 }
  ]
}

export default LevelGenerator(config);
