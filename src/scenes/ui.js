import 'phaser';

class UI extends Phaser.Scene {
  constructor () {
    super({
      key: 'ui',
      active: false
    })

    this.deaths = 0;
  }

  create (config) {
    console.debug('Creating ui')

    this.deathText = this.add.text(700, 10, 'Deaths: 0', { font: '20px Arial', fill: '#ffffff'})
    this.timer = this.add.text(10, 10, '00:00:00', { font: '20px Arial', fill: '#ffffff'})

    this.scene.manager.scenes.forEach(scene => {
      if (scene.constructor.name === 'Level') {
        scene.events.on('death', () => {
          this.deaths = this.deaths + 1;
          this.deathText.setText(`Deaths: ${this.deaths}`)

        })
        scene.events.on('restart', () => {
          console.log('resetting deaths and timer')
          this.deathText.setText('Deaths: 0')
          this.deaths = 0;
        })
      }
    });
    this.scene.bringToTop();
  }
}

export default UI;
