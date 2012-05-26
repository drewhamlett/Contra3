ig.module('game.main').requires('impact.game', 'impact.font', 'impact.debug.debug', 'game.entities.player', 'game.entities.player1', 'game.entities.spike', 'game.levels.test').defines(function() {

    Contra = ig.Game.extend({

        gravity: 400,
        // Load a font
        font: new ig.Font('media/04b03.font.png'),

        init: function() {
            // Bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            //	ig.input.bind(ig.KEY.DOWN_ARROW, 'prone');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.X, 'jump');
            ig.input.bind(ig.KEY.C, 'shoot');

            // Load the LevelTest as required above ('game.level.test')
            this.loadLevel(LevelTest);
        },

        update: function() {
            // Update all entities and BackgroundMaps
            this.parent();
            var screenX = this.screen.x;

            // screen follows the player
            var player = this.getEntitiesByType(EntityPlayer)[0];
            if (player) {

                if (player.pos.x < 120) {
                    this.screen.x = 0;
                    this.screen.y = ig.system.height - 140;
                } else {
                    if (player.accel.x > 0 && player.pos.x - this.screen.x > 120) {
                        this.screen.x = (player.pos.x - ig.system.width / 2);
                    }
                    this.screen.y = ig.system.height - 140;
                }
            }
        },

        draw: function() {
            // Draw all entities and BackgroundMaps
            this.parent();
            var player = this.getEntitiesByType(EntityPlayer)[0];
            //	this.font.draw('Velocity: ' + player.vel.y, 2, 2);
            //	this.font.draw('Accel: ' + player.accel.y, 2, 10);
        }
    });


    MainLoader = ig.Loader.extend({

        draw: function() {

            var w = ig.system.realWidth;
            var h = ig.system.realHeight;
            ig.system.context.fillStyle = '#000000';
            ig.system.context.fillRect(0, 0, w, h);

            var percentage = (this.status * 100).round() + '%';
            ig.system.context.fillStyle = '#ffffff';
            ig.system.context.fillText(percentage, w / 2, h / 2);
        }
    });


    // Start the Game with 60fps, a resolution of 240x160, scaled
    // up by a factor of 2
    ig.main('#canvas', Contra, 60, 240, 180, 4, MainLoader);

});