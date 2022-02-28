let pendulum;
let gravity;

function setup() {
  createCanvas(640, 640);
  gravity = createVector(0, 1);
  pendulum = new Pendulum(45, 200, 0.01);
}

function draw() {
  background(color(15, 28, 40));
  pendulum.applyForce(gravity);
  pendulum.applyForce(createVector(map(noise(frameCount), 0, 1, 0, 0.3), 0));
  pendulum.update();
}

class Pendulum {
  constructor(angle, radius, k) {
    this.position = createVector(radius * sin(angle), radius * cos(angle));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.mass = 1;
    this.k = k;
    this.radius = radius;
    this.origin = createVector(width / 2, height / 4);
  }

  applyForce(force) {
    force = force.copy().div(this.mass);
    this.acceleration.add(force);
  }

  springForce() {
    const spring = p5.Vector.sub(this.position, createVector(0, 0));
    const x = spring.mag() - this.radius;
    const force = spring.normalize().mult(x * -this.k);
    this.applyForce(force);
  }

  draw() {
    applyMatrix();
    translate(this.origin.x, this.origin.y);
    fill(15, 28, 40);
    stroke(255);
    strokeWeight(4);
    line(this.position.x, this.position.y, 0, 0); // Spring
    strokeWeight(2);
    ellipse(0, 0, 10); // Origin
    ellipse(this.position.x, this.position.y, 40); // Pendulum
    resetMatrix();
  }

  update() {
    this.springForce();
    this.draw();
    this.velocity.add(this.acceleration);
    this.velocity.mult(0.99);
    this.position.add(this.velocity);
    this.acceleration = createVector(0, 0);
  }
}
