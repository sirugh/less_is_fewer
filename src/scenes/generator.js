import 'phaser';
import Player from '../characters/player';
import Switch from '../characters/switch';
import * as utils from '../util/utilities';
import { BLACK_RGBA } from '../util/constants';

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
        this.scene.get('audio').trigger({
          key: 'death'
        });
        this.events.emit('death');
        this.scene.restart();
      }
  
      player.handleMovement(cursors, utils.getGravityDirection(this.physics.world.gravity));
    }
  

    createObjects() {
      this.objects.camera = this.cameras.add(0, 0, 800, 600);
      this.objects.camera.setBackgroundColor(BLACK_RGBA);
      this.objects.cursors = this.input.keyboard.createCursorKeys();
      this.objects.platforms = this.physics.add.staticGroup();
  
      // Set up level.
      this.objects.player = new Player(this, config.player.x, config.player.y, 'dude')
      this.objects.exit = new Switch(this, config.exit.x, config.exit.y, 'exit')
      
      config.platforms.forEach(platform => {
        this.objects.platforms.create(platform.x, platform.y, platform.texture)
      });

      this.objects.colorSwitches = config.colorSwitches.map(colorSwitch => {
        return new Switch(this, colorSwitch.x, colorSwitch.y, 'star')
      });
      
      this.objects.gravitySwitches = config.gravitySwitches.map(gravitySwitch => {
        return new Switch(this, gravitySwitch.x, gravitySwitch.y, 'bomb', gravitySwitch.direction)
      });

      config.text && this.add
        .text(400, 300 * 0.8, config.text, { font: "bold 30px Arial", fill: "#fff" })
        .setOrigin(0.5, 0.5);
    }
  
    addCollisions () {
      const { player, exit, platforms, camera, colorSwitches, gravitySwitches } = this.objects;
  
      this.physics.add.collider(player.sprite, platforms);  
      this.physics.add.overlap(player.sprite, exit.sprite, this._toggleNextLevel, null, this);

      gravitySwitches.forEach(item => {
        this.physics.add.overlap(player.sprite, item.sprite, (player, target) => {
          this._changeGravity(item.direction);
          target.disableBody(true, true);
        }, null, this);    
      });

      colorSwitches.forEach(item => {
        this.physics.add.overlap(player.sprite, item.sprite, this._toggleColor, null, this);
      });

      // Disable collision on platforms the same color as the background.
      platforms.children.entries.forEach((platform) => {
        utils.updatePlatformCollisions(platform, camera.backgroundColor.rgba)
      });
    }
  
    addInputs () {
      // this.input.keyboard.on('keydown_W', () => this._changeGravity.call(this, 'up'));
      // this.input.keyboard.on('keydown_A', () => this._changeGravity.call(this, 'left'));
      // this.input.keyboard.on('keydown_S', () => this._changeGravity.call(this, 'down'));
      // this.input.keyboard.on('keydown_D', () => this._changeGravity.call(this, 'right'));

      // this.input.keyboard.on('keydown_R', this._toggleColor.bind(this));
      // this.input.keyboard.on('keydown_N', this._toggleNextLevel.bind(this));
    }
  
    _toggleNextLevel () {
      this.scene.get('audio').trigger({
        key: 'win'
      });
      const nextLevel = (parseInt(config.key) + 1).toString();
      if (this.scene.get(nextLevel)) {
        console.debug(`Switching to level ${nextLevel}`);
        this.scene.start(nextLevel);
      }
      else if (this.scene.key ==='end') {
        console.debug(`Back to level 1!`);
        this.events.emit('restart');
        this.scene.start('1');
      }
      else {
        this.events.emit('finish')
        this.scene.start('end');  
      }
    }
  
    _toggleColor (playerSprite, target) {
      this.scene.get('audio').trigger({
        key: 'switchColor'
      });
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
      this.scene.get('audio').trigger({
        key: 'switchGravity'
      });
      const { player } = this.objects;

      const gravityDirection = utils.getGravityDirection(this.physics.world.gravity);

      if (!desiredDirection) {
        // TODO: make this not dumb
        switch (gravityDirection) {
          case 'left':
            desiredDirection = 'up'
            break;
          case 'right':
            desiredDirection = 'down'
            break;
          case 'up':
            desiredDirection = 'right'
            break;
          case 'down':
            desiredDirection = 'left'
            break;
        }
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

      console.log('Switching gravity', desiredDirection)
    }
  }  
}
