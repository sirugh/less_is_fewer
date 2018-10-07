import LevelGenerator from './generator';

const config = {
  key: '5',
  player: { x: 100, y: 50 },
  exit: { x: 100, y: 500 },
  platforms: [
    { x: 100, y: 100, texture: 'white_platform' },
    { x: 100, y: 450, texture: 'white_platform' },
  ],
  colorSwitches: [
  ],
  gravitySwitches: [
    { x: 200, y: 300, direction: 'up' }
  ],
  text: '¿'
}

export default LevelGenerator(config);
