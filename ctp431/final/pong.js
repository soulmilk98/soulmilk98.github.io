
(CanvasF = function() {
  //theremin
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext(),
    mousedown = false,
    oscillator;

  var gainNode = context.createGain();
  var oscillator = context.createOscillator();
  oscillator.start(0);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  //pong

  var Ball, Computer, FPS, Paddle, Player, animate, ball, computer, context, height, keysDown, player, render, scoreComputer, scorePlayer, step, update, width;

  FPS = 60;

  width = 400;

  height = 400;

  scoreComputer = 0;

  scorePlayer = 0;

  animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / FPS);
  };

  Paddle = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
  };

  Computer = function() {
    this.paddle = new Paddle(165, 10, 70, 10);
  };

  Player = function() {
    this.paddle = new Paddle(165, 380, 70, 10);
  };

  Ball = function(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
  };

  var canvas = document.createElement('canvas');

  canvas.width = width;

  canvas.height = height;

  context = canvas.getContext('2d');

  player = new Player;

  computer = new Computer;

  ball = new Ball(200, 400);

  keysDown = {};

  render = function() {
    context.fillStyle = '#232323';
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
  };

  update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
  };

  step = function() {
    update();
    render();
    animate(step);
  };

  Paddle.prototype.render = function() {
    context.fillStyle = '#00FF00';
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
      this.x = 0;
      this.x_speed = 0;
    } else if (this.x + this.width > 400) {
      this.x = 400 - this.width;
      this.x_speed = 0;
    }
  };

  Computer.prototype.render = function() {
    this.paddle.render();
  };

  Computer.prototype.update = function(ball) {
    var diff, x_pos;
    x_pos = ball.x;
    diff = -(this.paddle.x + this.paddle.width / 2 - x_pos);
    if (diff < 0 && diff < -4) {
      diff = -5;
    } else if (diff > 0 && diff > 4) {
      diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
      this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
      this.paddle.x = 400 - this.paddle.width;
    }
  };

  Player.prototype.render = function() {
    this.paddle.render();
  };

  Player.prototype.update = function() {
    var key, value;
    for (key in keysDown) {
      value = Number(key);
      if (value === 37) {
        this.paddle.move(-4, 0);
      } else if (value === 39) {
        this.paddle.move(4, 0);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

  Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = '#FFF';
    context.fill();
  };

  Ball.prototype.update = function(paddle1, paddle2) {
    var bottom_x, bottom_y, top_x, top_y;
    this.x += this.x_speed;
    this.y += this.y_speed;
    top_x = this.x - 5;
    top_y = this.y - 5;
    bottom_x = this.x + 5;
    bottom_y = this.y + 5;
    if (this.x - 5 < 0) {
      this.x = 5;
      this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 400) {
      this.x = 395;
      this.x_speed = -this.x_speed;
    }
    if (this.y < 0 || this.y > 600) {
      this.x_speed = 0;
      this.y_speed = 3;
      this.x = 200;
      this.y = 300;
    }
    if (top_y > 300) {
      if (top_y < paddle1.y + paddle1.height && bottom_y > paddle1.y && top_x < paddle1.x + paddle1.width && bottom_x > paddle1.x) {
        this.y_speed = -3;
        this.x_speed += paddle1.x_speed / 2;
        this.y += this.y_speed;
      }
    } else {
      if (top_y < paddle2.y + paddle2.height && bottom_y > paddle2.y && top_x < paddle2.x + paddle2.width && bottom_x > paddle2.x) {
        this.y_speed = 3;
        this.x_speed += paddle2.x_speed / 2;
        this.y += this.y_speed;
      }
    }

      //theremin
      oscillator.frequency.value = (this.x/300) * 2000;
      gainNode.gain.value = (this.y/300) * 1;

  };

    document.body.appendChild(canvas);

  animate(step);

  window.addEventListener('keydown', function(event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener('keyup', function(event) {
    delete keysDown[event.keyCode];
  });

}).call(this);
