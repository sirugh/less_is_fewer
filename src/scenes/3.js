import 'phaser';
import Player from '../characters/player';
import Switch from '../characters/switch';
import * as utils from '../util/utilities';

class Level3 extends Phaser.Scene {
  constructor () {
    super({
      key: 'level-3',
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

    this.objects.platforms.create(0, 200, 'white_platform').setScale(.5).refreshBody();
    this.objects.platforms.create(0, 400, 'white_platform').setScale(.5).refreshBody();
    this.objects.platforms.create(0, 600, 'white_platform').setScale(.5).refreshBody();
    this.objects.platforms.create(400, 600, 'white_platform').setScale(.5).refreshBody();

    this.objects.player = new Player(this, 100, 450, 'dude')
    this.objects.exit = (new Switch(this, 10, 10, 'exit')).instance

    this.objects.gravitySwitches = [
      (new Switch(this, 750, 500, 'bomb')).instance
    ]

    this.objects.colorSwitches = [
      (new Switch(this, 400, 350, 'star')).instance,
    ]
  }

  addCollisions () {
    const { player, exit, platforms, camera, colorSwitches, gravitySwitches } = this.objects;

    this.physics.add.collider(player.sprite, platforms);

    colorSwitches.forEach(item => {
      this.physics.add.overlap(player.sprite, item, this._toggleColor, null, this);
    });
    
    gravitySwitches.forEach(item => {
      this.physics.add.overlap(player.sprite, item, (player, target) => {
        this._changeGravity();
        target.disableBody(true, true);
      }, null, this);    
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
    this.scene.start('end');
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

  _changeGravity (desiredDirection) {
    const { player } = this.objects;

    const gravityDirection = utils.getGravityDirection(this.physics.world.gravity);

    if (!desiredDirection) {
      // TODO: make this not dumb
      if (gravityDirection === 'left' || gravityDirection === 'right') {
        desiredDirection = 'down'
      }
      if (gravityDirection === 'up' || gravityDirection === 'down') {
        desiredDirection = 'left'
      }
    }

    // reset
    this.physics.world.gravity.y = 0;
    this.physics.world.gravity.x = 0;

    // set force from appropraite direction
    if (desiredDirection === 'left') {
      this.physics.world.gravity.x = -330;
      player.sprite.angle = 90;
    }
    if (desiredDirection === 'up') {
      this.physics.world.gravity.y = -330;
      player.sprite.angle = 180;
    }
    if (desiredDirection === 'right') {
      this.physics.world.gravity.x = 330;
      player.sprite.angle = -90;
    }
    if (desiredDirection === 'down') {
      this.physics.world.gravity.y = 330;
      player.sprite.angle = 0;
    }
  }
}

export default Level3;
