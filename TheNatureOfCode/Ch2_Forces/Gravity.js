const width = 640;
const height = width;

const G = 0.001;

let planets;

function setup() {
  createCanvas(width, height);
  background(0);
  colorMode(HSL);
  planets = [...Array(500).keys()].map(
    (_, index) =>
      new Planet(
        index,
        random(4, 50),
        (randomGaussian(0, 1) + 1) * 10,
        random(width),
        random(height)
      )
  );
}

function draw() {
  background(0);
  planets.forEach((planet) => {
    planets
      .filter(({ id }) => planet.id !== id)
      .forEach((other) => {
        if (other.isDestroyed || planet.isDestroyed) return;
        const distance = p5.Vector.sub(other.position, planet.position).mag();
        const minDistance = planet.radius + other.radius;
        if (distance < minDistance) {
          planet.destroy();
          other.destroy();
        }
      });
  });
  planets = planets.filter((planet) => !planet.isDestroyed);

  planets.forEach((planet) => {
    planets
      .filter(({ id }) => planet.id !== id)
      .forEach((other) => {
        if (other.isDestroyed || planet.isDestroyed) return;
        const r = p5.Vector.sub(other.position, planet.position);
        const distance = Math.sqrt(r.mag());
        const gravityPull = r
          .normalize()
          .mult((G * other.mass * planet.mass) / distance);
        planet.applyForce(gravityPull);
      });
  });
  planets.forEach((planet) => {
    planet.update();
    planet.display();
  });
}

class Planet {
  constructor(index, mass, radius, x, y) {
    this.id = index;
    this.force = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.position = createVector(x, y);

    this.radius = radius;
    this.mass = index = radius;
    this.isDestroyed = false;
  }

  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force, this.mass));
  }

  display() {
    if (this.isDestroyed) return;
    if (this.id === planets.length - 1) {
      fill(10, 100, 60);
    } else {
      fill(0, 0, 100 - this.radius * 2);
    }
    ellipse(this.position.x, this.position.y, this.radius * 2);
  }

  destroy() {
    // this.isDestroyed = true;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
}
