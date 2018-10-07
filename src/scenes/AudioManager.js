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
  }

  create (config) {
    console.debug('Creating audio')
    this.sounds.bgm = this.sound.add('bgm', { volume: 0.5 })
    // this.trigger({
    //   key: 'bgm',
    //   loop: true
    // });
  }

  trigger({ key, marker, loop }) {
    this.sounds[key] && this.sounds[key].play(
      marker, 
      { loop}
    );
  }
}

export default AudioManager;
