const width = 650;
const height = width;
let elements;

function setup() {
  createCanvas(width, height);
  background(255);
  elements = [...Array(10).keys()].map(() => new Mover());
}

function draw() {
  background(255);
  elements.forEach((mover) => {
    mover.applyForce(
      createVector(
        noise(mover.location.x, mover.location.y, frameCount),
        noise(mover.location.x, mover.location.y, frameCount)
      )
    );
    mover.update();
    mover.display();
  });
}

class Mover {
  constructor() {
    this.mass = random(20, 40);
    this.acceleration = createVector(0, 0);
    this.location = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.angle = 0;
    this.aVelocity = 0.1;
    this.aAcceleration = 0;
  }

  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force, this.mass));
  }

  checkEdges() {
    if (this.location.x < 0 || this.location.x > width) {
      this.velocity.x *= -1;
    }
    if (this.location.y < 0 || this.location.y > height) {
      this.velocity.y *= -0.98;
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(10);
    this.location.add(this.velocity);
    this.checkEdges();
    this.acceleration.mult(0);
  }
  display() {
    stroke(255);
    fill(0);
    strokeWeight(4);
    rectMode(CENTER);
    translate(this.location.x, this.location.y);
    rotate(this.velocity.heading());
    rect(0, 0, this.mass);
    resetMatrix();
  }
}
