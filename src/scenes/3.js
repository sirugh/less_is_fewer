import LevelGenerator from './generator';

const config = {
  key: '3',
  player: { x: 100, y: 50 },
  exit: { x: 100, y: 150 },
  platforms: [
    { x: 100, y: 100, texture: 'white_platform' },
  ],
  colorSwitches: [
  ],
  gravitySwitches: [
    { x: 200, y: 300, direction: 'up' }
  ],
}

export default LevelGenerator(config);
