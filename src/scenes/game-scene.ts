import { getGameWidth, getGameHeight } from '../utils/helpers';
import VolleyballSpawner from '../helpers/volleyballSpawner';
import ScoreLabel from '../ui/score-label';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public speed = 200;
  public jumpVelocity = 600;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Phaser.Physics.Arcade.Sprite;
  private scoreLabel: ScoreLabel;
  private volleyballSpawner: VolleyballSpawner;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.volleyballSpawner = new VolleyballSpawner(this, 'volleyball');
    this.player = this.createPlayer();
    const net = this.createNet().rotate(1.5708);
    const ground = this.createGround();
    const ball = this.volleyballSpawner.spawn();
    this.physics.add.collider(this.player, [net, ground, ball]);
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    // This is a nice helper Phaser provides to create listeners for some of the most common keys.
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  private createPlayer() {
    const player = this.physics.add.sprite(getGameWidth(this) / 2, getGameHeight(this) - 200, 'character');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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

  private createNet() {
    const net = this.physics.add.staticGroup({
      setRotation: {
        value: 1.5708,
      },
    });
    net.create(getGameWidth(this) / 2 - 2, getGameHeight(this), 'ground');
    return net;
  }

  private createGround() {
    const platforms = this.physics.add.staticGroup();

    const ground = platforms.create(0, getGameHeight(this), 'ground');

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    return ground;
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

    if (this.cursorKeys.up.isDown && this.player.body.touching.down) {
      this.scoreLabel.add(1);
      this.player.setVelocityY(-this.jumpVelocity);
    }
  }
}
