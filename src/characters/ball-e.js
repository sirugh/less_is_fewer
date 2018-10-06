export default class BallE {
  constructor (scene, x, y, texture) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;
  }

  initialize() {
    return this.scene.physics.add.sprite(
      this.x,
      this.y,
      this.texture
    )
  }
}
