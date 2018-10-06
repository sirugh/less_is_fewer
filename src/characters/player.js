export default class Player {
  constructor (scene, x, y, texture) {
    this.instance = scene.physics.add.sprite(
      x,
      y,
      texture
    )
    this.instance.setScale(0.5);
    this.instance.setBounce(0.2);
    this.instance.setCollideWorldBounds(true);
  }
}
