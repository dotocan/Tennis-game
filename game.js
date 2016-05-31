var canvas;
var canvasContext;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
var playerPaddleX = 0;
var playerPaddleY = 250;
var cpuPaddleX = 790;
var cpuPaddleY = 250;

var ballRadius = 10;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 6;
var ballSpeedY = 6;

var playerScore = 0;
var cpuScore = 0;
const WINNING_SCORE = 10;
var playerScoreText = document.getElementById('player_score');
var cpuScoreText = document.getElementById('cpu_score');

var isGameOver = false;

window.onload = function() {
  var fps = 30;

  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  setInterval(function() {
    drawElements();
    moveElements();
  }, 1000 / fps);

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(evt);
    playerPaddleY = mousePos.y - PADDLE_HEIGHT/2;
  });

  canvas.addEventListener('mousedown', function(evt) {
    if (isGameOver) {
      isGameOver = false;
      playerScoreText.innerHTML = "Player: " + playerScore;
      cpuScoreText.innerHTML = "CPU: " + cpuScore;
    }
  });
}

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

function drawElements() {
  if (isGameOver) {
    canvasContext.fillStyle = 'white';
    canvasContext.font="30px Arial";
    canvasContext.fillText("Click to continue", 325, 500);
    return;
  }

  drawPlayground(0, 0, canvas.width, canvas.height, 'black');
  drawBall(ballX, ballY, ballRadius, 'white');
  drawPlayerPaddle(playerPaddleX, playerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  drawCpuPaddle(cpuPaddleX, cpuPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  drawCenterLines('#00b4ff');
}

function moveElements() {
  if (isGameOver) {
    return;
  }
  moveBall();
  moveCpuPaddle();
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    if (ballY > playerPaddleY
        && ballY < playerPaddleY + PADDLE_HEIGHT) {
      var deltaY = ballY - (playerPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedX = -ballSpeedX;
      ballSpeedY = deltaY * 0.35;
    } else {
      cpuScore++;
      cpuScoreText.innerHTML = "CPU: " + cpuScore;
      resetBallPos();
    }
  }

  if (ballX > canvas.width){
    if (ballY > cpuPaddleY
        && ballY < cpuPaddleY + PADDLE_HEIGHT) {
      var deltaY = ballY - (cpuPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedX = -ballSpeedX;
      ballSpeedY = deltaY * 0.35;
    } else {
      playerScore++;
      playerScoreText.innerHTML = "Player: " + playerScore;
      resetBallPos();
    }
  }

  if (ballY < 0 + ballRadius) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballY > canvas.height - ballRadius) {
    ballSpeedY =  -ballSpeedY;
  }
}

function moveCpuPaddle() {
  var cpuPaddleYCenter = cpuPaddleY + (PADDLE_HEIGHT / 2);
  if(cpuPaddleYCenter < ballY - 35) {
    cpuPaddleY += 6;
  } else if (cpuPaddleYCenter > ballY - 35){
    cpuPaddleY -= 6;
  }
}

function resetBallPos() {
  if (playerScore >= WINNING_SCORE) {
    playerScore = 0;
    cpuScore = 0;
    isGameOver = true;
    canvasContext.fillStyle = 'white';
    canvasContext.font="30px Arial";
    canvasContext.fillText("PLAYER WON", 325, 300);
    drawCenterLines('black');
  }

  if (cpuScore >= WINNING_SCORE) {
    playerScore = 0;
    cpuScore = 0;
    isGameOver = true;
    canvasContext.fillStyle = 'white';
    canvasContext.font="30px Arial";
    canvasContext.fillText("CPU WON", 350, 300);
    drawCenterLines('black');
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 2.7;
}

function drawPlayground(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawBall(centerX, centerY, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function drawPlayerPaddle(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawCpuPaddle(leftX, topY, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawCenterLines(color) {
  canvasContext.fillStyle = color;
  for (var i=0; i<canvas.height; i+=40) {
    canvasContext.fillRect(canvas.width/2 - 1, i, 2, 20);
  }
}

/*
========================================================================
HELP:
- fillRect(xPosition, yPosition, width, height)
- setInterval(functionName, duration)
  -> multiple functions can be called in first parameter
- arc(xPosition, yPosition, radius, angle, radian, counterclockwise)

========================================================================
*/
