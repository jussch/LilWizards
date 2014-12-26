(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Wizard = LW.Wizard = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);
    this.facing = options.facing;

    this.sprite = new LW.Sprite({
      img: options.img,
      parent: this
    });

    this.friction = new LW.Coord([.870, 1]);
    this.gravity = new LW.Coord([0, Wizard.N_GRAVITY]); //HELP ME

    this.game = options.game;

    this.collBox = new LW.CollBox(this.pos, [12, 12]);
    this.onGround = false;
    this.wallJumpBuffer = 0;

    this.spellList = [LW.SpellList.Fireball, null, null];
    this.cooldownList = [0, 0, 0];
    this.globalCooldown = 0;
  };

  Wizard.MAX_VEL_X = 5;
  Wizard.N_GRAVITY = 0.18;
  Wizard.J_GRAVITY = 0.07;

  Wizard.prototype.draw = function (ctx) {
    if (this.facing === "up") {
      this.sprite.angle = -30;
    } else if (this.facing === "down") {
      this.sprite.angle = 30;
    } else {
      this.sprite.angle = 0;
    }
    this.sprite.draw(ctx);
  };

  Wizard.prototype.move = function () {
    this.onGround = false;
    this.wallJumpBuffer -= 1;

    this.pos.x += this.vel.x;
    var collisions = this.game.solidCollisions(this.collBox);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i].collBox;
        var depthX = (this.collBox.dim[0] + oB.dim[0]) - Math.abs(this.pos.x - oB.pos.x);
        if (this.pos.x > oB.pos.x ) {
          this.pos.x += depthX;
          this.onLeftWall = true;
        } else {
          this.pos.x -= depthX;
          this.onRightWall = true;
        }
        this.vel.x = 0;
      }
    }

    if (this.isOnWall()) {
      this.vel.y = Math.min(this.vel.y, 1);
    }

    this.pos.y += this.vel.y;
    var collisions = this.game.solidCollisions(this.collBox);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i].collBox;
        var depthY = (this.collBox.dim[1] + oB.dim[1]) - Math.abs(this.pos.y - oB.pos.y);
        if (this.pos.y > oB.pos.y ) {
          this.pos.y += depthY;
        } else {
          this.pos.y -= depthY;
          this.onGround = true;
        }
        this.vel.y = 0.1;
      }
    }

    if (!this.onGround) {
      this.vel.plus(this.gravity);
    } else {
      this.vel.times(this.friction);
    }

    this.gravity.y = Wizard.N_GRAVITY;

    this.globalCooldown -= 1;
    for (var i = 0; i < this.cooldownList.length; i++) {
      this.cooldownList[i] -= 1;
    }
    // // Stop flying for now;
    // this.pos.min([1024-this.img.width, 576-this.img.height]);
    // this.pos.max([0, 0]);
  };

  Wizard.prototype.isOnWall = function () {
    if (this.onLeftWall) {
      this.pos.x -= 1;
      var collisions = this.game.solidCollisions(this.collBox);
      this.pos.x += 1;
      if (collisions) {
        return true;
      }
    }
    if (this.onRightWall) {
      this.pos.x += 1;
      var collisions = this.game.solidCollisions(this.collBox);
      this.pos.x -= 1;
      if (collisions) {
        return true;
      }
    }

    return false;
  }

  Wizard.prototype.isValidMove = function (move) {
    var currPos = this.pos.dup();
    var nextPos = currPos.plus(move);

    return this.game.isColliding(this);
  };

  Wizard.prototype.jump = function (val) {
    if (this.onGround) {
      this.vel.y = val;
    } else if ((this.onLeftWall && this.isOnWall()) || this.wallJumpBuffer > 0) {
      this.vel.y = val;
      this.vel.x = Wizard.MAX_VEL_X;
      this.onLeftWall = false;
      this.faceDir("right");
    } else if ((this.onRightWall && this.isOnWall()) || this.wallJumpBuffer > 0) {
      this.vel.y = val;
      this.vel.x = -Wizard.MAX_VEL_X;
      this.onRightWall = false;
      this.faceDir("left");
    }
  };

  Wizard.prototype.accelX = function (val) {
    if (!this.onGround) {
      val /= 3.5;
    }
    if (Math.abs(this.vel.x + val) < Wizard.MAX_VEL_X) {
      this.vel.x += val;
    }
  };

  Wizard.prototype.faceDir = function (dir) {
    this.facing = dir;
    if (dir === "left") {
      this.sprite.mirror = true;
      if (this.onRightWall) {this.wallJumpBuffer = 10}
      this.onRightWall = false;
    } else if (dir === "right") {
      this.sprite.mirror = false;
      if (this.onLeftWall) {this.wallJumpBuffer = 10}
      this.onLeftWall = false;
    }
  };

  Wizard.prototype.dynamicJump = function () {
    if (this.vel.y < -2) {
      this.gravity.y = Wizard.J_GRAVITY;
    }
  };

  Wizard.prototype.spellDirection = function () {
    if (this.facing === "left") {
      return new LW.Coord([-1, 0]);
    } else if (this.facing === "right") {
      return new LW.Coord([1, 0]);
    } else if (this.facing === "up") {
      return new LW.Coord([0, -1]);
    } else if (this.facing === "down") {
      return new LW.Coord([0,1]);
    }
  };

  Wizard.prototype.kill = function () {
    this.pos.x = 300;
    this.pos.y = 130;
  };

  Wizard.prototype.castSpell = function (spellIndex) {
    if (this.globalCooldown <= 0 && this.cooldownList[spellIndex] <= 0) {
      this.spellList[spellIndex].bind(this)(spellIndex);
    }
  };

})();
