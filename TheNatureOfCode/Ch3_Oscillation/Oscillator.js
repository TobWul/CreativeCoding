class Oscillator {
  constructor(angle, aVelocity, amplitude) {
    this.angle = angle;
    this.aVelocity = aVelocity;
    this.amplitude = amplitude;
  }

  oscillate() {
    this.angle.add(this.aVelocity);
  }

  display(drawFunction) {
    drawFunction(x, y);
  }
}
