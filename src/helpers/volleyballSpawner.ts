import { getGameWidth, getGameHeight } from '../utils/helpers';

export default class VolleyballSpawner {
  scene: Phaser.Scene;
  public key: string;
  private _group: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, volleyballKey = 'volleyball') {
    this.scene = scene;
    this.key = volleyballKey;

    this._group = this.scene.physics.add.group();
  }

  get group(): Phaser.Physics.Arcade.Group {
    return this._group;
  }

  spawn(): Phaser.Physics.Arcade.Group {
    const volleyball = this.group.create(getGameWidth(this.scene) / 2, getGameHeight(this.scene) / 4, this.key);
    volleyball.setBounce(true);
    volleyball.setCollideWorldBounds(true);
    volleyball.setVelocity(Phaser.Math.Between(-200, 200), -100);

    return volleyball;
  }
}
