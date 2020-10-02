const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 10,
  color: "Cyan",
};

// User Paddle
const user = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "Gray",
};

// COM Paddle
const com = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "White",
};

// NET
const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "White",
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 6;
}

// draw the net
function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

// draw text
function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "75px fantasy";
  ctx.fillText(text, x, y);
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}

function update() {
  if (ball.x - ball.radius < 0) {
    com.score++;
    comScore.play();
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    userScore.play();
    resetBall();
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // simple AI
  com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
    wall.play();
  }

  let player = ball.x + ball.radius < canvas.width / 2 ? user : com;

  if (collision(ball, player)) {
    // play sound
    hit.play();
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.15;
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawText(user.score, canvas.width / 4, canvas.height / 5);
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5);

  // draw the net
  drawNet();
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);

  // draw the ball
  drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game() {
  update();
  render();
}

let framePerSecond = 50;

let loop = setInterval(game, 1000 / framePerSecond);
