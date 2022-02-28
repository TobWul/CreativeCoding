let dots = [];
const dotCount = 15;
let center;
let colors;

function setup() {
  colors = {
    blue: color(40, 52, 75),
    orange: color(255, 163, 100),
  };
  createCanvas(640, 640);
  const angleFragment = ((4 / 5) * 2 * PI) / dotCount;
  for (let i = 0; i < dotCount; i++) {
    dots.push(new Dot(i, angleFragment * i + random(-0.1, 0.1)));
  }
  center = {
    x: width / 2,
    y: height / 2,
  };
}

function draw() {
  background(255, 235, 210);
  dots.forEach((dot, index) => {
    if (index !== 0) {
      dot.drawLine(dots[index - 1]);
    }
  });
  dots.forEach((dot) => {
    dot.update(frameCount);
  });
}

class Dot {
  constructor(id, angle) {
    this.id = id;
    this.connected = random() < 0.7;
    this.size = random(10, 30);
    this.angle = angle;
    this.radius = random(50, 100);
    this.angleVelocity = 0.001;
    this.position = createVector(0, 0);
    this.color = this.connected ? colors.blue : colors.orange;
  }

  update(frameCount) {
    const radius = map(
      noise(frameCount / 500),
      0,
      1,
      this.radius - 50,
      this.radius + 100
    );

    this.position.x = radius * sin(this.angle);
    this.position.y = radius * cos(this.angle);

    this.angle += this.angleVelocity;

    applyMatrix();
    translate(center.x, center.y);
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.size);
    resetMatrix();
  }

  drawLine(to) {
    if (!to.connected || !this.connected) return;
    for (let t = 0; t < 1; t += 0.05) {
      const point = p5.Vector.lerp(this.position, to.position, t);
      applyMatrix();
      translate(center.x, center.y);
      noStroke();
      fill(40, 52, 75);
      ellipse(point.x, point.y, 2);
      resetMatrix();
    }
  }
}
