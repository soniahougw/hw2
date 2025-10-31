let file, bgm, winsound, losesound;
let cookieimg, startimg, seaimg, winimg, againimg;
let fishImages = [];
let fishes = [];

let winPlayed = false;
let losePlayed = false;
let gameOver = false;

let gameState = 0; // 0=start, 1=playing, 2=end

// timer
let timeLimit = 20000; // 1 sec = 1000 milliseconds
let startTime;

// === preload() replaces Processing's setup() image/sound loading ===
function preload() {
  cookieimg = loadImage("assets/cookie.png");
  startimg = loadImage("assets/start.jpg");
  seaimg = loadImage("assets/sea.jpg");
  winimg = loadImage("assets/win.jpg");
  againimg = loadImage("assets/again.jpg");

  fishImages[0] = loadImage("assets/f1.png");
  fishImages[1] = loadImage("assets/f2.png");
  fishImages[2] = loadImage("assets/f3.png");

  bgm = loadSound("assets/dive.wav");
  file = loadSound("assets/bitesound.wav");
  winsound = loadSound("assets/winsound.wav");
  losesound = loadSound("assets/losesound.wav");
}

function setup() {
  createCanvas(1020, 600);
  bgm.loop();
  setupGame();
}

function setupGame() {
  winPlayed = false;
  losePlayed = false;
  gameOver = false;
  startTime = millis();

  //resize once in here
for (let i = 0; i < fishImages.length; i++) {
  fishImages[i].resize(100, 0);
}

//then create multiple fish with random image
fishes = [];
for (let i = 0; i < 20; i++) {
  fishes.push(new Fish(random(width), random(height), fishImages));
}
}

function draw() {
  if (gameState === 0) {
    imageMode(CENTER);
    image(startimg, width / 2, height / 2, width, height);
    return;
  }

  if (gameState === 1) {
    imageMode(CENTER);
    image(seaimg, width / 2, height / 2, width, height);

    // mouse is cookie rod
    image(cookieimg, mouseX, mouseY, 50, 50);

    // timer
    if (!gameOver) {
      let timeLeft = timeLimit - (millis() - startTime);
      fill(255);
      textSize(25);
      text("Time: " + max(0, int(timeLeft / 1000)), 20, height - 30);

      if (timeLeft <= 0 && !losePlayed) {
        losesound.play();
        losePlayed = true;
        gameOver = true;
        gameState = 2;
      }
    }

    // only show fish if game still going
    if (!gameOver) {
      for (let f of fishes) {
        f.update();
        f.display();
      }
    }

    // check if all fish gone
    let allGone = fishes.every(f => !f.alive);

    if (allGone && !winPlayed) {
      winsound.play();
      winPlayed = true;
      gameOver = true;
      gameState = 2;
    }
  }

  if (gameState === 2) {
    imageMode(CENTER);
    if (winPlayed) {
      image(winimg, width / 2, height / 2, width, height);
    } else if (losePlayed) {
      image(againimg, width / 2, height / 2, width, height);
    }
  }
}

function mousePressed() {
  // prevent extra clicks when game over
  if (gameState !== 1) return;

  for (let f of fishes) {
    if (f.checkClicked(mouseX, mouseY)) {
      file.play();
    }
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    gameState = 1; // start game
    file.play();
    startTime = millis();
  }

  if (key === 'r' || key === 'R') {
    setupGame();
    gameState = 0;
  }
}

class Fish {
  constructor(x, y, fishImages) {
    this.x = x;
    this.y = y;
    this.Speedx = random(1, 8);
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

