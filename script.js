const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player1, player2, keys;
let animationId; // NEW: Track game loop ID

class Fighter {
  constructor(x, color, controls) {
    this.x = x;
    this.y = 300;
    this.width = 20;
    this.height = 50;
    this.color = color;
    this.hp = 100;
    this.speed = 3;
    this.jumpPower = 10;
    this.dy = 0;
    this.isJumping = false;
    this.controls = controls;
    this.evolution = 0;
  }

  update() {
    // gravity
    if (this.y < 300) {
      this.dy += 0.5;
      this.y += this.dy;
    } else {
      this.dy = 0;
      this.y = 300;
      this.isJumping = false;
    }

    // evolution changes
    if (this.evolution === 1) this.speed = 4;
    if (this.evolution === 2) this.height = 60;
    if (this.evolution === 3) this.color = "gold";

    // draw
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.x -= this.speed;
  }
  moveRight() {
    this.x += this.speed;
  }
  jump() {
    if (!this.isJumping) {
      this.dy = -this.jumpPower;
      this.isJumping = true;
    }
  }
  attack(opponent) {
    if (
      Math.abs(this.x - opponent.x) < 30 &&
      Math.abs(this.y - opponent.y) < 50
    ) {
      opponent.hp -= 10;
      if (opponent.hp <= 0) {
        this.evolution++;
        opponent.hp = 100;
      }
    }
  }
}

function startGame() {
  cancelAnimationFrame(animationId); // ✅ FIX: Cancel old loop
  keys = {};
  player1 = new Fighter(100, "red", {
    left: "a",
    right: "d",
    jump: "w",
    attack: "s"
  });
  player2 = new Fighter(600, "blue", {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "ArrowUp",
    attack: "ArrowDown"
  });
  animationId = requestAnimationFrame(gameLoop); // ✅ Store new loop
}

function resetGame() {
  startGame();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player1.update();
  player2.update();

  handleInput(player1);
  handleInput(player2);

  drawHP();

  animationId = requestAnimationFrame(gameLoop); // ✅ Loop safely
}

function drawHP() {
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player1.hp * 2, 10);
  ctx.fillStyle = "blue";
  ctx.fillRect(560, 20, player2.hp * 2, 10);
}

function handleInput(player) {
  const c = player.controls;
  if (keys[c.left]) player.moveLeft();
  if (keys[c.right]) player.moveRight();
  if (keys[c.jump]) player.jump();
  if (keys[c.attack]) player.attack(player === player1 ? player2 : player1);
}

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));