const width = 640;
const height = width;
let movers;

function setup() {
  createCanvas(width, height);
  background(0);
  movers = [...Array(10).keys()].map(() => new Mover());
}

function draw() {
  movers.forEach((mover) => {
    mover.display();
    mover.applyForce(createVector(4, 0));
    mover.applyForce(createVector(-1, 2));
    mover.update();
  });
}

class Mover {
  constructor(location, velocity) {
    this.mass = random(20, 40);
    this.acceleration = createVector(0, 0);
    this.location = createVector(random(width), random(0, height / 2));
    this.velocity = createVector(0, 0);
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

  mousePull() {
    const force = p5.Vector.sub(createVector(mouseX, mouseY), this.location)
      .normalize()
      .mult(0.5);
    this.applyForce(force);
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
    ellipse(this.location.x, this.location.y, this.mass);
  }
}
