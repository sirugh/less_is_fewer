import LevelGenerator from './generator';

const config = {
  key: '4',
  player: { x: 100, y: 450 },
  exit: { x: 400, y: 100 },
  platforms: [
    // Platforms are 200x32. x is middle alignment.
    { x: 100, y: 550, texture: 'white_platform' },
    { x: 400, y: 50, texture: 'white_platform' }
  ],
  colorSwitches: [
  ],
  gravitySwitches: [
    { x: 100, y: 350, direction: 'up'}  
  ],
  text: '?'
}

export default LevelGenerator(config);
