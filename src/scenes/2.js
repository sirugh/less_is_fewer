import 'phaser';
import Player from '../characters/player';
import Switch from '../characters/switch';
import * as utils from '../util/utilities';

class Level2 extends Phaser.Scene {
  constructor () {
    super({
      key: 'level-2',
      active: false
    })
    this.objects = {};
  }

  create (config) {
    this.createObjects();
    this.addCollisions();
    this.addInputs();
  }

  update () {
    const { player, cursors } = this.objects;
    
    if (player.isTouchingWorld()) {
      this.scene.restart();
    }

    player.handleMovement(cursors, utils.getGravityDirection(this.physics.world.gravity));
  }

  createObjects () {
    this.objects.camera = this.cameras.add(0, 0, 800, 600);
    this.objects.cursors = this.input.keyboard.createCursorKeys();
    this.objects.platforms = this.physics.add.staticGroup();

    this.objects.platforms.create(100, 550, 'white_platform')
    this.objects.platforms.create(700, 450, 'black_platform')
    this.objects.platforms.create(100, 350, 'white_platform')
    this.objects.platforms.create(700, 250, 'black_platform')
    this.objects.platforms.create(100, 150, 'white_platform')
    this.objects.player = new Player(this, 100, 450, 'dude')
    this.objects.colorSwitches = [
      (new Switch(this, 515, 400, 'star')).instance,
      (new Switch(this, 285, 300, 'star')).instance,
      (new Switch(this, 515, 200, 'star')).instance,
      (new Switch(this, 285, 100, 'star')).instance
    ]

    this.objects.exit = (new Switch(this, 50, 100, 'exit')).instance
  }

  addCollisions () {
    const { player, exit, platforms, camera, colorSwitches } = this.objects;

    this.physics.add.collider(player.sprite, platforms);

    colorSwitches.forEach(item => {
      this.physics.add.overlap(player.sprite, item, this._toggleColor, null, this);
    });

    this.physics.add.overlap(player.sprite, exit, this._toggleNextLevel, null, this);

    // Disable collision on platforms the same color as the background
    platforms.children.entries.forEach((platform) => {
      utils.updatePlatformCollisions(platform, camera.backgroundColor.rgba)
    });   
  }

  addInputs () {
    this.input.keyboard.on('keydown_R', this._toggleColor.bind(this));
    this.input.keyboard.on('keydown_W', () => this._changeGravity.call(this, 'up'));
    this.input.keyboard.on('keydown_A', () => this._changeGravity.call(this, 'left'));
    this.input.keyboard.on('keydown_S', () => this._changeGravity.call(this, 'down'));
    this.input.keyboard.on('keydown_D', () => this._changeGravity.call(this, 'right'));
    this.input.keyboard.on('keydown_N', this._toggleNextLevel.bind(this));
  }

  _toggleNextLevel () {
    this.scene.start('level-3');
  }

  _toggleColor (playerSprite, target) {
    const { player, camera, platforms } = this.objects;

    // Switch the color of the player and the background.
    player.toggleColor();
    utils.changeBackgroundColor(camera);

    // Disable collision on platforms the same color as the background.
    platforms.children.entries.forEach((platform) => {
      utils.updatePlatformCollisions(platform, camera.backgroundColor.rgba)
    });

    // Disable the target that triggered this event.
    target && target.disableBody(true, true);
  }
}

export default Level2;
