ig.module('game.entities.spike').requires('impact.entity').defines(function() {

    EntitySpike = ig.Entity.extend({
        size: {
            x: 23,
            y: 30
        },

        offset: {
            x: 5,
            y: 0
        },
        // Evil enemy group
        type: ig.Entity.TYPE.B,
        // Check against friendly
        checkAgainst: ig.Entity.TYPE.A,

        collides: ig.Entity.COLLIDES.PASSIVE,

        health: 10,

        flip: false,

        animSheet: new ig.AnimationSheet('media/ground-shooter.png', 32, 32),


        init: function(x, y, settings) {
        
            this.parent(x, y, settings);
            this.addAnim('crawl', 1, [0]);
        },

        update: function() {

            this.parent();
        },


        handleMovementTrace: function(res) {
            this.parent(res);

        },

        check: function(other) {
            other.receiveDamage(10, this);
        }
    });
});