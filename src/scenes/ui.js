import 'phaser';

class UI extends Phaser.Scene {
  constructor () {
    super({
      key: 'ui',
      active: false
    })

    this.deaths = 0;
    this.elapsedTime = 0;
    this.running = true;
  }

  create (config) {
    console.debug('Creating ui')

    // create clock
    const updateTimer = setInterval(() => {
      this.elapsedTime = this.elapsedTime + 10
    }, 10)

    this.deathText = this.add.text(700, 10, 'Deaths: 0', { font: '20px Arial', fill: '#ffffff'})
    this.timer = this.add.text(10, 10, '00:00:00', { font: '20px Arial', fill: '#ffffff'})
    this.finalTime = this.add
      .text(400, 200 * 0.8, '', { font: "bold 30px Arial", fill: "#fff" })
      .setOrigin(0.5, 0.5);
    
    this.scene.manager.scenes.forEach(scene => {
      if (scene.constructor.name === 'Level') {
        scene.events.on('death', () => {
          this.deaths = this.deaths + 1;
          this.deathText.setText(`Deaths: ${this.deaths}`)
        });

        scene.events.on('finish', () => {
          this.running = false;
          const totalTime = this.elapsedTime / 10;
          // display final timer
          this.finalTime.setText(`Total: ${totalTime}ms`)
        });

        scene.events.on('restart', () => {
          console.log('resetting deaths and timer')
          this.deathText.setText('Deaths: 0')
          this.deaths = 0;
          this.elapsedTime = 0;
          this.running = true;
          this.finalTime.setText('');
        })
      }
    });

    this.scene.bringToTop();
  }

  update () {
    const ms = this.elapsedTime / 10;
    if (this.running) {
      this.timer.setText(`Time: ${ms}ms`)
    }
    else{
      this.timer.setText()
    }
  }
}

export default UI;
