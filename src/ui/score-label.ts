const formatScore = (score: number) => `Score: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  score: number;

  constructor(scene: Phaser.Scene, x: number, y: number, score: number, style?: unknown) {
    super(scene, x, y, formatScore(score), style);
    this.score = score;
  }

  private setScore(score: number): void {
    this.score = score;
    this.updateScoreText();
  }

  public add(points: number): void {
    this.setScore(this.score + points);
  }

  private updateScoreText(): void {
    this.setText(formatScore(this.score));
  }
}
