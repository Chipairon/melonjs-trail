game.PlayerEntity = me.Entity.extend({

  init:function (x, y, settings)
  {
    var image = me.loader.getImage("ball");
    this._super(me.Entity, 'init', [
      me.game.viewport.width / 2 - image.width / 2,
      me.game.viewport.height / 2 - image.height / 2,
      {
        image: image,
        width: 32,
        height: 32
      }
    ]);

    this.maxX = me.game.viewport.width - this.width;
    this.maxY = me.game.viewport.height - this.height;

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(0.2, 0.2);
    this.body.setMaxVelocity(5, 5);

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

      me.game.world.addChild(new game.Trail(this.pos.x, this.pos.y));
    }
    return updated;
  }
});


game.Trail = me.Entity.extend({

  init:function (x, y, settings)
  {
    this._super(me.Entity, 'init', [
      x, y,
      {
        image: "ball",
        width: 32,
        height: 32
      }
    ]);

    (new me.Tween(this.renderable))
    .to({
        alpha : 0,
    }, 5000)
    .onComplete((function () {
        me.game.world.removeChild(this);
    }).bind(this))
    .start();
  },

  update : function (dt) {
    this.body.update(dt);
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  }

});
