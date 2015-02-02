(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Berserk = function (spellIndex) {
    var ailment = new LW.Ailment ({
      game: this.game,
      wizard: this,
      victim: this,
      sType: "misc",
      sId: "berserk",
      duration: 360,
      initialize: function () {
        this.game.playSE('teleport.ogg');
        this.colors = ['white', 'gold', 'orange', 'papayawhip', 'orangered'];
        this.victim.maxVelX = 8;
        this.victim.nGravity = 0.19;
        this.victim.jGravity = 0.05;
        LW.ParticleSplatter(40, startParticles.bind(this))
      },
      tickEvent: function () {
        if (this.victim.isDead()) {
          this.remove();
        } else {
          this.victim.globalCooldown -= 3;
          for (i in this.victim.cooldownList) {
            this.victim.cooldownList[i] -= 3;
          }
          LW.ParticleSplatter(2, tickParticles.bind(this))
        }
      },
      wizardColl: null,
      spellColl: null,
      solidColl: null,
      removeEvent: function () {
        this.victim.maxVelX = 5;
        this.victim.nGravity = 0.18;
        this.victim.jGravity = 0.07;
        this.victim.globalCooldown = 360;
        this.victim.cooldownList[spellIndex] = 420;
        var ending = setInterval(function () {
          LW.ParticleSplatter(2, endParticles.bind(this))
          if (this.victim.globalCooldown <= 20 || this.victim.isDead()) {
            clearInterval(ending);
          }
        }.bind(this), 1000/60)
      }
    });

    this.addAilment(ailment);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 360;
    return ailment;
  }

  var tickParticles = function () {
    var randVel = (new LW.Coord(2)).times(Math.random()).plusAngleDeg(Math.random()*360);
    return {
      pos: this.victim.pos.dup(),
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random()*10+5),
      radius: Math.random()*2+1,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    };
  };

  var startParticles = function () {
    var randVel = (new LW.Coord(1.2)).plusAngleDeg(Math.random()*360);
    return {
      pos: this.victim.pos.dup(),
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random()*15+20),
      radius: Math.random()*3+3,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    };
  };

  var endParticles = function () {
    var randVel = new LW.Coord([0,1]);
    return {
      pos: this.victim.pos.dup().plus([Math.random()*24-12, -21 + Math.random() * 10]),
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random()*15+20),
      radius: Math.random()*2+1,
      color: 'papayawhip',
      tickEvent: function () {
        this.vel.y += 0.01
      }
    };
  };

})();
