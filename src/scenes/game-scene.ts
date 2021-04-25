import { getGameWidth, getGameHeight } from '../utils/helpers';
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
  private scoreLabel: ScoreLabel;
  private volleyballSpawner: VolleyballSpawner;
  private playerSpawner: PlayerSpawner;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.matter.world.setBounds(0, -200, getGameWidth(this), getGameHeight(this) + 200);
    this.volleyballSpawner = new VolleyballSpawner(this, 'volleyball');
    this.playerSpawner = new PlayerSpawner(this, 'character');
    const volleyball = this.volleyballSpawner.spawn();
    this.player = this.playerSpawner.spawn();
    this.matter.body.setInertia(this.player.body as MatterJS.BodyType, Infinity);
    this.matter.body.setInertia(volleyball.body as MatterJS.BodyType, Infinity);
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    // This is a nice helper Phaser provides to create listeners for some of the most common keys.
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.matter.world.on('collisionactive', () => {
      this.player.isTouchingGround = true;
    });
  }

  private createScoreLabel(x: number, y: number, score: number) {
    const style = { fontSize: '32px', fill: '#fff' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);
    return label;
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
  }
}
