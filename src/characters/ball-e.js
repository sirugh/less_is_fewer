export default class BallE {
  constructor (scene, x, y, texture) {
    this.instance = scene.physics.add.sprite(
      x,
      y,
      texture
    )

    this.instance.setBounce(0.2);
    this.instance.setCollideWorldBounds(true);
  }
}
