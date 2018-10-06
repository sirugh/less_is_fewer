export default class Switch {
  constructor (scene, x, y, texture) {
    this.instance = scene.physics.add.staticImage(x, y, texture);
  }
}
