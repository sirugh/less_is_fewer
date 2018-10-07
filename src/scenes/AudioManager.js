import 'phaser';

class AudioManager extends Phaser.Scene {
  constructor () {
    super({
      key: 'audio',
      active: false
    })

    this.sounds = {};
  }

  preload () {
    this.load.audio('bgm', 'assets/audio/bgm1.wav');
    this.load.audio('jump', 'assets/audio/Jump 1.wav')
    this.load.audio('switchColor', 'assets/audio/Confirm 1.wav')
    this.load.audio('switchGravity', 'assets/audio/Select 1.wav')
    this.load.audio('win', 'assets/audio/Fruit collect 1.wav')
    this.load.audio('death', 'assets/audio/death.ogg')
  }

  create (config) {
    console.debug('Creating audio')
    this.sounds.bgm = this.sound.add('bgm', { volume: 0.3 })
    this.sounds.jump = this.sound.add('jump', { volume: 0.5 })
    this.sounds.death = this.sound.add('death', { volume: 0.5 })
    this.sounds.win = this.sound.add('win', { volume: 0.5 })
    this.sounds.switchColor = this.sound.add('switchColor', { volume: 0.5 })
    this.sounds.switchGravity = this.sound.add('switchGravity', { volume: 0.5 })

    this.trigger({
      key: 'bgm',
      loop: true
    });
  }

  trigger({ key, marker, loop }) {
    this.sounds[key] && this.sounds[key].play(
      marker, 
      { loop}
    );
  }
}

export default AudioManager;
