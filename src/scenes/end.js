import 'phaser';
import Player from '../characters/player';
import Switch from '../characters/switch';
import * as utils from '../util/utilities';

class End extends Phaser.Scene {
  constructor () {
    super({
      key: 'end',
      active: false
    })

    this.objects = {}
  }

  create () {
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

  createObjects() {
    this.objects.camera = this.cameras.add(0, 0, 800, 600);
    this.objects.cursors = this.input.keyboard.createCursorKeys();
    this.objects.platforms = this.physics.add.staticGroup();

    // Set up level.
    this.objects.platforms.create(0, 550, 'white_platform')
    this.objects.platforms.create(800, 550, 'black_platform')
    this.objects.player = new Player(this, 100, 450, 'dude')
    this.objects.exit = (new Switch(this, 700, 500, 'exit')).instance
    this.objects.colorSwitches = [
      (new Switch(this, 400, 350, 'star')).instance,
    ]

    this.add
      .text(400, 300 * 0.8, 'THE END', { font: "bold 30px Arial", fill: "#fff" })
      .setOrigin(0.5, 0.5);
  }

  addCollisions () {
    const { player, exit, platforms, camera } = this.objects;

    this.physics.add.collider(player.sprite, platforms);

    this.objects.colorSwitches.forEach(item => {
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
    this.input.keyboard.on('keydown_N', this._toggleNextLevel.bind(this));
  }

  _toggleNextLevel () {
    this.scene.start('level-1');
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
    
    // TODO: toggle text color
  }
}

export default End;
