import LevelGenerator from './generator';

const config = {
  key: 'end',  
  player: { x: 100, y: 450 },
  exit: { x: 400, y: 50 },
  platforms: [
    { x: 100, y: 550, texture: 'white_platform' },
    { x: 400, y: 300, texture: 'black_platform' }
  ],
  colorSwitches: [
    { x: 400, y: 350 }
  ],
  gravitySwitches: [
    { x: 400, y: 350, direction: 'up' }
  ],
  text: 'Congrats! The end.'
}

export default LevelGenerator(config);
