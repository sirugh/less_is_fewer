export default class Switch {
  constructor (scene, x, y, texture, direction) {
    this.sprite = scene.physics.add.staticImage(x, y, texture);

    this.direction = direction 
  }
}
