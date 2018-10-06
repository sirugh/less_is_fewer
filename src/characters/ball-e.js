export default class BallE {
  constructor (scene, x, y, texture) {
    // Animate player
    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.instance = scene.physics.add.sprite(
      x,
      y,
      texture
    )

    this.instance.setBounce(0.2);
    this.instance.setCollideWorldBounds(true);
  }
}
