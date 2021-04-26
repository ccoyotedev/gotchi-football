export default class GoalText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, style?: unknown) {
    super(scene, x, y, 'Goal!', style);
  }
}
