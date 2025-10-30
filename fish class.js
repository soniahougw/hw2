class Fish {
  constructor(x, y, fishImages) {
    this.x = x;
    this.y = y;
    this.Speedx = random(1, 15);
    this.Speedy = 1;
    this.img = random(fishImages);
    this.facingRight = true;
    this.alive = true;
  }

  update() {
    if (!this.alive) return;
    this.x += this.Speedx;
    this.y += this.Speedy;

    // bounce
    if (this.x > width || this.x < 0) this.Speedx *= -1;
    if (this.y < 100 || this.y > height - 50) this.Speedy *= -1;

    this.facingRight = this.Speedx > 0;
  }

  display() {
    if (!this.alive) return;

    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    if (this.facingRight) {
      image(this.img, 0, 0);
    } else {
      scale(-1, 1);
      image(this.img, 0, 0);
    }
    pop();
  }

  checkClicked(mx, my) {
    if (!this.alive) return false;

    if (
      mx > this.x - this.img.width / 2 &&
      mx < this.x + this.img.width / 2 &&
      my > this.y - this.img.height / 2 &&
      my < this.y + this.img.height / 2
    ) {
      this.alive = false;
      return true;
    }
    return false;
  }
}
