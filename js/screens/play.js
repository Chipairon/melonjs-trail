game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        me.game.world.addChild(new me.ColorLayer("background", "#000000"), 0);

        me.sys.gravity = 0;

        me.game.world.addChild(new game.PlayerEntity(0, 0), 1);

        // reset the score
        game.data.score = 0;

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 2);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
