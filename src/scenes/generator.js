import 'phaser';
import Player from '../characters/player';
import Switch from '../characters/switch';
import * as utils from '../util/utilities';

export default function LevelGenerator (config) {
  const {
    key,
    active,
  } = config;

  return class Level extends Phaser.Scene {
    constructor () {
      super({
        key,
        active
      })
  
      this.objects = {}
    }
  
    create () {
      console.debug(`Creating level ${key}`)
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
      this.objects.player = new Player(this, config.player.x, config.player.y, 'dude')
      this.objects.exit = (new Switch(this, config.exit.x, config.exit.y, 'exit')).instance
      config.platforms.forEach(platform => {
        this.objects.platforms.create(platform.x, platform.y, platform.texture)
      })

      this.objects.colorSwitches = config.colorSwitches.map(colorSwitch => {
        return (new Switch(this, colorSwitch.x, colorSwitch.y, 'star')).instance
      })
      this.objects.gravitySwitches = config.gravitySwitches.map(gravitySwitch => {
        return (new Switch(this, gravitySwitch.x, gravitySwitch.y, 'bomb')).instance
      })
    }
  
    addCollisions () {
      const { player, exit, platforms, camera, colorSwitches, gravitySwitches } = this.objects;
  
      this.physics.add.collider(player.sprite, platforms);  
      this.physics.add.overlap(player.sprite, exit, this._toggleNextLevel, null, this);

      gravitySwitches.forEach(item => {
        this.physics.add.overlap(player.sprite, item, (player, target) => {
          this._changeGravity();
          target.disableBody(true, true);
        }, null, this);    
      });

      colorSwitches.forEach(item => {
        this.physics.add.overlap(player.sprite, item, this._toggleColor, null, this);
      });
    }
  
    addInputs () {
      this.input.keyboard.on('keydown_W', () => this._changeGravity.call(this, 'up'));
      this.input.keyboard.on('keydown_A', () => this._changeGravity.call(this, 'left'));
      this.input.keyboard.on('keydown_S', () => this._changeGravity.call(this, 'down'));
      this.input.keyboard.on('keydown_D', () => this._changeGravity.call(this, 'right'));

      this.input.keyboard.on('keydown_R', this._toggleColor.bind(this));
      this.input.keyboard.on('keydown_N', this._toggleNextLevel.bind(this));
    }
  
    _toggleNextLevel () {
      this.scene.start(config.nextLevel || 'end');
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
}
