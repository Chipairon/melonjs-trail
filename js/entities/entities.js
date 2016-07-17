game.PlayerEntity = me.Entity.extend({

  init:function (x, y, settings)
  {
    var image = me.loader.getImage("blank-ball-32px");
    this._super(me.Entity, 'init', [
      me.game.viewport.width / 2 - image.width / 2,
      me.game.viewport.height / 2 - image.height / 2,
      { image: image, height: 32, width: 32 }
    ]);
    this.color = new me.Color(255, 0, 0);

    this.maxX = me.game.viewport.width - this.width;
    this.maxY = me.game.viewport.height - this.height;

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(0.2, 0.2);
    this.body.setMaxVelocity(5, 5);
    this.updates = 0;

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;
  },

  update : function (dt) {
    if (me.input.isKeyPressed('left')) {
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
    }
    if (me.input.isKeyPressed('right')) {
      this.body.vel.x += this.body.accel.x * me.timer.tick;
    }
    if (me.input.isKeyPressed('up')) {
      this.body.vel.y -= this.body.accel.y * me.timer.tick;
    }
    if (me.input.isKeyPressed('down')) {
      this.body.vel.y += this.body.accel.y * me.timer.tick;
    }
    this.pos.x = this.pos.x.clamp(0, this.maxX);
    this.pos.y = this.pos.y.clamp(0, this.maxY);

    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // return true if we moved or if the renderable was updated
    var updated =  (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    if (updated) {
      try {
        me.game.world.addChildAt(new game.Trail(this.pos.x, this.pos.y), 1);
      } catch(_e) {
        // do nothing. Just in case of adding just as the game is destroyed.
      }
    }
    return updated;
  },

  draw : function (renderer) {
    renderer.save();
    // Call superclass draw method
    this._super(me.Entity, "draw", [ renderer ]);
    // Fill the destination rect
    renderer.setColor(this.color);
    renderer.fillArc(this.pos.x, this.pos.y, (this.width/2), 0,  Math.PI * 2);
    renderer.restore();
  }
});

game.Trail = me.Entity.extend({
  init:function (x, y, settings)  {
    var image = me.loader.getImage("blank-ball-32px");
    this._super(me.Entity, 'init', [
      x, y, { image: image, height: 32, width: 32 }
    ]);

    this.color = new me.Color(255, 0, 0, 1);
    this.timerRef = me.timer.setInterval(function() {
      this.setOpacity(this.getOpacity() - 0.01);
      this.color.alpha = this.getOpacity();
      this.color.lighten((1-this.getOpacity())*0.03);
      if (this.getOpacity() <= 0) {
        try {
          me.game.world.removeChild(this);
        } catch(_e) {
        }
        me.timer.clearInterval(this.timerRef);
      }
    }.bind(this), 80, true);
  },

  update : function (dt) {
    this.body.update(dt);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  draw : function (renderer) {
    renderer.save();
    renderer.setGlobalAlpha(this.getOpacity());
    this._super(me.Entity, "draw", [ renderer ]);
    renderer.setColor(this.color);
    renderer.fillArc(this.pos.x, this.pos.y, (this.width/2), 0,  Math.PI * 2);
    renderer.restore();
  }

});
