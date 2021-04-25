import { getGameWidth, getGameHeight } from '../utils/helpers';
import { MyMatterBodyConfig } from '../types';
import VolleyballSpawner from '../helpers/volleyballSpawner';
import ScoreLabel from '../ui/score-label';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public speed = 5;
  public jumpVelocity = 10;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Phaser.Physics.Matter.Sprite;
  private scoreLabel: ScoreLabel;
  private volleyballSpawner: VolleyballSpawner;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.matter.world.setBounds(0, 0, getGameWidth(this), getGameHeight(this));
    console.log(this.matter);
    this.volleyballSpawner = new VolleyballSpawner(this, 'volleyball');
    this.player = this.createPlayer();
    const volleyball = this.volleyballSpawner.spawn();
    this.matter.body.setInertia(this.player.body as MatterJS.BodyType, Infinity);
    this.matter.body.setInertia(volleyball.body as MatterJS.BodyType, Infinity);


    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    // This is a nice helper Phaser provides to create listeners for some of the most common keys.
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  private createPlayer() {
    const shapes = this.cache.json.get('shapes');

    const player = this.matter.add.sprite(getGameWidth(this) / 4, getGameHeight(this) - 50, 'character', '', {
      shape: shapes['ghst-front'],
      density: 100000,
    } as MyMatterBodyConfig);
    player.setScale(2, 2);
    player.setBounce(0.2);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('character', { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('character', { start: 24, end: 29 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
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

    if (this.cursorKeys.up.isDown) {
      this.scoreLabel.add(1);
      this.player.setVelocityY(-this.jumpVelocity);
    }
  }
}
