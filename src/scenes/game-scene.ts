import { getGameWidth, getGameHeight } from '../utils/helpers';
import { MyMatterBodyConfig } from '../types';
import VolleyballSpawner from '../helpers/volleyballSpawner';
import PlayerSpawner, { Player } from '../helpers/playerSpawner';
import ScoreLabel from '../ui/score-label';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public speed = 7;
  public jumpVelocity = 15;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Player;
  private volleyball: Phaser.Physics.Matter.Sprite;
  private scoreLabel: ScoreLabel;
  private volleyballSpawner: VolleyballSpawner;
  private playerSpawner: PlayerSpawner;
  private spaceKey: Phaser.Input.Keyboard.Key;
  private kick: Phaser.Physics.Matter.Sprite;

  // Categories
  private playerCat: number;
  private volleyballCat: number;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    // Create scene
    this.matter.world.setBounds(0, -200, getGameWidth(this), getGameHeight(this) + 200 - 75);
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, 'bg');
    this.add.image(getGameWidth(this) / 2, getGameHeight(this) - 37.5, 'ground').setScale(2.5, 1);

    // Create player
    this.playerSpawner = new PlayerSpawner(this, 'character');
    this.player = this.playerSpawner.spawn();
    this.matter.body.setInertia(this.player.body as MatterJS.BodyType, Infinity);
    this.playerCat = this.matter.world.nextCategory();
    this.player.setCollisionCategory(this.playerCat);

    // Create volleyball
    this.volleyballSpawner = new VolleyballSpawner(this, 'volleyball');
    this.volleyball = this.volleyballSpawner.spawn();
    this.volleyballCat = this.matter.world.nextCategory();
    this.volleyball.setCollisionCategory(this.volleyballCat);

    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    // This is a nice helper Phaser provides to create listeners for some of the most common keys.
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey('SPACE');

    this.matter.world.on('collisionactive', (event) => {
      this.player.isTouchingGround = true;
      this.player.downBoost = 1;
    });

    this.matter.setCollisionGroup(
      [this.player.body as MatterJS.BodyType, this.volleyball.body as MatterJS.BodyType],
      1,
    );
  }

  private createScoreLabel(x: number, y: number, score: number) {
    const style = { fontSize: '32px', fill: '#fff' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);
    return label;
  }

  public handleKick(player: Player, direction: 'left' | 'right'): void {
    const shapes = this.cache.json.get('shapes');

    const originX = direction === 'left' ? player.x + 50 : player.x - 50;
    const velocityX = direction === 'left' ? -15 : 15;

    if (!this.kick) {
      this.kick = this.matter.add.sprite(originX, player.y + 30, 'kick', '', {
        ignoreGravity: true,
        restitution: 1,
        mass: 10000,
        torque: 100,
        collisionFilter: {
          category: this.playerCat,
          mask: this.volleyballCat,
        },
        bounce: 0,
        shape: shapes['volleyball'],
      } as MyMatterBodyConfig);
      this.kick.setVelocityX(velocityX);

      setTimeout(() => {
        this.kick.destroy();
        this.kick = undefined;
      }, 220);
    }
  }

  public update(): void {
    switch (true) {
      case this.cursorKeys.left.isDown:
        this.player.setVelocityX(-this.speed);
        this.player.anims.play('left', true);
        break;
      case this.cursorKeys.right.isDown:
        this.player.setVelocityX(this.speed);
        this.player.anims.play('right', true);
        break;
      default:
        this.player.setVelocityX(0);
        this.player.anims.play('turn', true);
    }

    if (this.cursorKeys.up.isDown && this.player.isTouchingGround) {
      this.scoreLabel.add(1);
      this.player.isTouchingGround = false;
      this.player.setVelocityY(-this.jumpVelocity);
    }

    if (this.cursorKeys.down.isDown && !this.player.isTouchingGround && this.player.downBoost > 0) {
      this.scoreLabel.add(1);
      this.player.downBoost--;
      this.player.setVelocityY(10);
    }

    if (this.spaceKey.isDown) {
      this.handleKick(this.player, this.cursorKeys.left.isDown ? 'left' : 'right');
    }
  }
}
