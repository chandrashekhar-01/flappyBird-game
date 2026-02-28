const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let score = 0;
let gravity = 0.35;
let velocity = 0;
let birdY = 250;
let gameOver = false;

const birdWidth = 100;
const birdHeight = birdWidth;
const birdX = canvas.width * 0.25;

const bird = new Image();
bird.src = "assets/bird.png";

const bg = new Image();
bg.src = "assets/bg.png";

const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";
const music = new Audio("assets/music.mp3");
music.loop = true;

const flapSound = new Audio("assets/music.wav");
const gameOverSound = new Audio("assets/gameover.wav");

let pipes = [];
let pipeGap = canvas.height * 0.25;

function createPipe() {
  let pipeHeight = Math.floor(Math.random() * 300) + 50;
  pipes.push({
    x: canvas.width,
    height: pipeHeight,
    passed: false
  });
}

function update() {
  if (gameOver) return;

  velocity += gravity;
  birdY += velocity;

  // ground collision
  if (birdY + birdHeight >= canvas.height) {
    endGame();
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // score update
    if (!pipe.passed && pipe.x + 80 < birdX) {
      score++;
      pipe.passed = true;
      document.getElementById("score").innerText = "Score: " + score;
    }

    // collision detection
    if (
      birdX < pipe.x + 80 &&
      birdX + birdWidth > pipe.x &&
      (birdY < pipe.height ||
        birdY + birdHeight > pipe.height + pipeGap)
    ) {
      endGame();
    }
  });

  if (pipes.length === 0 || pipes[pipes.length - 1].x < 250) {
    createPipe();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(bird, birdX, birdY, birdWidth, birdHeight);

  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, 0, 80, pipe.height);
    ctx.drawImage(
      pipeImg,
      pipe.x,
      pipe.height + pipeGap,
      80,
      canvas.height
    );
  });

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 110, 250);
    ctx.fillText("Final Score: " + score, 100, 300);
    ctx.font = "18px Arial";
    ctx.fillText("Click to Restart", 130, 340);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  if (!gameOver) {
    gameOver = true;

    // stop bg music completely
    music.pause();
    music.currentTime = 0;
    flapSound.pause();
    flapSound.currentTime = 0;
    gameOverSound.currentTime = 0;
    gameOverSound.play();
  }
}

function restartGame() {
  score = 0;
  velocity = 0;
  birdY = 100;
  pipes = [];
  gameOver = false;

  document.getElementById("score").innerText = "Score: 0";

  // STOP ALL SOUNDS
  music.pause();
  music.currentTime = 0;

  gameOverSound.pause();
  gameOverSound.currentTime = 0;

  flapSound.pause();
  flapSound.currentTime = 0;

  // ⚠ No background music on restart (as you requested)
}

document.addEventListener("keydown", () => {
  if (gameOver) {
    restartGame();
  } else {
    velocity = -6;
    flapSound.play();   
  }
});

canvas.addEventListener("click", () => {
  if (gameOver) {
    restartGame();
  } else {
    velocity = -6;
    flapSound.play();
  }
});
gameLoop();