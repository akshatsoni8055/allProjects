class Ball {
    constructor(game) {
      this.image = document.getElementById("ball");
      this.size = 20;
      this.gamewidth = game.gamewidth;
      this.gameheight = game.gameheight;
      this.game = game;
      this.speed = {
        x: 10,
        y: -8
      }
      this.position = {
        x: 400,
        y: 570
      }
    }
    reset() {
      this.speed.y = -this.speed.y
      this.position = {
        x: 400,
        y: 570
      };
    }
    draw(ctx) {
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.size,
        this.size
      );
    }
  
    update(dt) {
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;
      if (this.position.x + this.size > this.gamewidth || this.position.x < 0) {
        this.speed.x = -this.speed.x;
      }
      //wall on top
      if (this.position.y < 0) {
        this.speed.y = -this.speed.y;
      }
      //bottom of game
      if (this.position.y + this.size > this.gameheight) {
        this.game.lives--;
        this.reset();
        this.game.tooglePause();
        lives.textContent = this.game.lives;
      }
  
      //checking collison with paddle
      if (collison(this, this.game.paddle)) {
        this.speed.y = -this.speed.y;
        this.position.y = this.game.paddle.position.y - this.size;
      }
    }
  }
  // class brick
  class Brick {
    constructor(game, position) {
      this.image = document.getElementById("brick");
  
      this.game = game;
  
      this.position = position;
      this.width = 20;
      this.height = 20;
  
      this.markfordelete = false;
    }
  
    update() {
      if (collison(this.game.ball, this)) {
        this.game.ball.speed.y = -this.game.ball.speed.y;
        this.markfordelete = true;
        game.score += 10
        score.textContent = game.score;
      }
    }
    draw(ctx) {
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }
  // class paddle
  
  class Paddle {
    constructor(game) {
      this.gamewidth = game.gamewidth;
      this.gameheight = game.gameheight;
      this.width = 120;
      this.height = 20;
      this.maxspeed = 15;
      this.speed = 0;
      this.position = {
        x: this.gamewidth / 2 - this.width / 2,
        y: this.gameheight - this.height - 10
      };
    }
    moveLeft() {
      this.speed = -this.maxspeed;
    }
    moveRight() {
      this.speed = this.maxspeed;
    }
    stop() {
      this.speed = 0;
    }
  
    draw(ctx) {
      ctx.fillStyle = "dodgerblue";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update(dt) {
      this.position.x += this.speed;
      if (this.position.x < 0) {
        this.position.x = 0;
      }
      if (this.position.x + this.width > this.gamewidth) {
        this.position.x = this.gamewidth - this.width;
      }
  
      // automatic game
      //this.position.x = game.ball.position.x - this.width / 2
    }
  
  }
  // level
  
  function buildlevel(game, height) {
    let level = [], temp = [], bricks = []
  
    for (let i = 1; i <= height; i++) {
      temp = []
      for (let j = 1; j <= 40; j++) {
        temp.push(Math.round(Math.random()))
      }
      level.push(temp)
    }
  
    level.forEach((row, rowindex) => {
      row.forEach((brick, brickindex) => {
        if (brick === 1) {
          let position = {
            x: 20 * brickindex,
            y: 20 + 20 * rowindex
          };
          bricks.push(new Brick(game, position));
        }
      });
    });
    return bricks;
  }
  
  
  // class input
  
  class Input {
    constructor(paddle, game) {
      document.addEventListener("keydown", event => {
        switch (event.keyCode) {
          case 37:
            paddle.moveLeft();
            break;
          case 39:
            paddle.moveRight();
            break;
          case 13:
            if (game.gamestate === GS.menu) {
              game.start();
            } else if (game.gamestate === GS.gameover) {
              game.restart();
            } else {
              game.tooglePause();
            }
            break;
          default:
        }
      });
      document.addEventListener("keyup", event => {
        switch (event.keyCode) {
          case 37:
            if (paddle.speed < 0) paddle.stop();
            break;
          case 39:
            if (paddle.speed > 0) paddle.stop();
            break;
          default:
        }
      });
    }
  }
  // class collision
  
  function collison(ball, gameobject) {
    //checking collison with brick
    let bottomofball = ball.position.y + ball.size;
    let topofball = ball.position.y;
    let topofobject = gameobject.position.y;
    let leftofobject = gameobject.position.x;
    let rightofobject = gameobject.position.x + gameobject.width;
    let bottomofobject = gameobject.position.y + gameobject.height;
    if (
      bottomofball >= topofobject &&
      topofball <= bottomofobject &&
      ball.position.x >= leftofobject &&
      ball.position.x + ball.size <= rightofobject
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  
  // game class
  
  const GS = {
    paused: 0,
    running: 1,
    menu: 2,
    gameover: 3
  };
  
  class Game {
    constructor(gamewidth, gameheight, bricksPerRow) {
      this.gamewidth = gamewidth;
      this.gameheight = gameheight;
      this.gameobject = [];
      this.lives = 3;
      this.level = 1;
      this.score = 0;
      this.gamestate = GS.menu;
      this.bricks = [];
      this.ball = new Ball(this);
      this.paddle = new Paddle(this);
      new Input(this.paddle, this);
    }
  
    start() {
      if (this.gamestate !== GS.menu) {
        return;
      }
  
      this.bricks = buildlevel(this, this.level + 3);
      this.gameobject = [this.ball, this.paddle];
      this.gamestate = GS.running;
    }
  
    update(dt) {
      if (this.lives === 0) {
        this.gamestate = GS.gameover;
      }
      if (
        this.gamestate === GS.paused ||
        this.gamestate === GS.menu ||
        this.gamestate === GS.gameover
      ) {
        return;
      }
      if (this.bricks.length === 0) {
        this.level++
        this.bricks = buildlevel(this, this.level + 3)
        level.textContent = this.level
      }
      [...this.gameobject, ...this.bricks].forEach((object) => object.update(dt));
      this.bricks = this.bricks.filter((bricks) => !bricks.markfordelete);
    }
    draw(ctx) {
      [...this.gameobject, ...this.bricks].forEach((object) => object.draw(ctx));
  
      if (this.gamestate === GS.paused) {
        ctx.rect(0, 0, this.gamewidth, this.gameheight);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
        ctx.font = "30px Monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Paused", this.gamewidth / 2, this.gameheight / 2);
      }
      if (this.gamestate === GS.menu) {
        ctx.rect(0, 0, this.gamewidth, this.gameheight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
        ctx.font = "30px Monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(
          "Press ENTER To Start",
          this.gamewidth / 2,
          this.gameheight / 2
        );
      }
      if (this.gamestate === GS.gameover) {
        ctx.rect(0, 0, this.gamewidth, this.gameheight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
        ctx.font = "30px Monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Game-Over, Hit Enter to Restart", this.gamewidth / 2, this.gameheight / 2);
      }
    }
    tooglePause() {
      if (this.gamestate === GS.paused) {
        this.gamestate = GS.running;
      } else {
        this.gamestate = GS.paused;
      }
    }
    restart() {
      lives.textContent = 3
      level.textContent = 1
      score.textContent = 0
      this.lives = 3;
      this.level = 1;
      this.score = 0;
      this.bricks = buildlevel(this, this.level + 3);
      this.gameobject = [this.ball, this.paddle];
      this.gamestate = GS.running;
    }
  }
  
  // main functioning
  
  let canvas = document.getElementById("gamescreen");
  let ctx = canvas.getContext("2d");
  let level = document.getElementById('level')
  let lives = document.getElementById('lives')
  let score = document.getElementById('score')
  
  const game_width = 800;
  const game_height = 600;
  
  let game = new Game(game_width, game_height);
  let dt;
  function gameloop() {
    ctx.clearRect(0, 0, game_width, game_height);
    game.update(dt);
    game.draw(ctx);
  
    requestAnimationFrame(gameloop);
  }
  
  requestAnimationFrame(gameloop);
  
  