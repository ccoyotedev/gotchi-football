import { getGameWidth, getGameHeight } from '../utils/helpers';
import { MyMatterBodyConfig } from '../types';

export default class VolleyballSpawner {
  scene: Phaser.Scene;
  public key: string;

  constructor(scene: Phaser.Scene, volleyballKey = 'volleyball') {
    this.scene = scene;
    this.key = volleyballKey;
  }

  spawn(): Phaser.Physics.Matter.Sprite {
    const shapes = this.scene.cache.json.get('shapes');
    const volleyball = this.scene.matter.add.sprite(
      getGameWidth(this.scene) / 2,
      getGameHeight(this.scene) / 4,
      this.key,
      '',
      { shape: shapes['volleyball'] } as MyMatterBodyConfig,
    );
    volleyball.setBounce(1);
    volleyball.setVelocity(Phaser.Math.Between(-10, 10), -5);

    return volleyball;
  }
}
