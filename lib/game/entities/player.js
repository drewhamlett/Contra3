ig.module('game.entities.player').requires('impact.entity', 'game.entities.machine-gun').defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: {
            x: 30,
            y: 40
        },
        offset: {
            x: 14,
            y: 21
        },

        maxVel: {
            x: 100,
            y: 250
        },
        friction: {
            x: 10,
            y: 40
        },

        type: ig.Entity.TYPE.A,
        // Player friendly group
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/playermain.png', 64, 64),

        // -- User properties
        flip: false,
        accelGround: 250,
        accelAir: 250,
        jump: 230,
        health: 10,
        shooting: false,
        up: false,
        timer: new ig.Timer(),
        isJumping: false,
        isProne: false,
        proneTimer: new ig.Timer(),
        changeHitBox: new ig.Timer(),

        init: function(x, y, settings) {

            this.parent(x, y, settings);

            // Add the animations
            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.16, [1, 2, 3, 4, 5, 6]);
            this.addAnim('runAngle', 0.16, [12, 13, 14, 15, 16, 17]);
            this.addAnim('jump', 0.1, [19, 20, 21, 22]);
            this.addAnim('fall', 0.1, [19, 20, 21, 22]);
            this.addAnim('prone', 1, [8]);
            this.addAnim('shoot', 0.07, [10, 11]);
        },

        update: function() {

            this.parent();

            this.handleRun();
            this.handleJump();
            this.handleShooting();


            console.log(this.vel.y);

            if (ig.input.state('prone')) {
                //this.changeHitBox.reset();
                this.isProne = true;

            } else {

                this.isProne = false;
            }

            if (ig.input.released('prone')) {
                this.pos.y -= 50;
                this.vel.y = 0;
            }

            this.handleAnimation();

            this.updateCollisionAnimation();
        },

        handleShooting: function() {

            if (ig.input.state('shoot')) {

                var offset = this.flip ? 3 : 30;

                if (this.timer.delta() > 0.1) {

                    var yOffset = 10;
                    if (this.isProne) {
                        yOffset += 22;
                    }

                    ig.game.spawnEntity(MachineGunBullet, this.pos.x + offset, this.pos.y + yOffset, {
                        flip: this.flip
                    });

                    this.timer.reset();
                }

                this.shooting = true;

            } else {
                this.shooting = false;
            }
        },


        // -- Run!
        handleRun: function() {

            var accel = this.standing ? this.accelGround : this.accelAir;

            if (ig.input.state('left')) {

                (ig.input.state('right') === true) ? this.accel.x = 400 : this.vel.x = -200;
                (ig.input.state('up')) ? this.up = true : this.up = false;

                this.accel.x = -accel;
                this.flip = true;

            } else if (ig.input.state('right')) {

                (ig.input.state('left') === true) ? this.accel.x = -400 : this.vel.x = 200;
                (ig.input.state('up')) ? this.up = true : this.up = false;

                this.accel.x = accel;
                this.flip = false;

            } else {
                this.up = false;
                this.accel.x = 0;
                this.vel.x = 0;
            }
        },


        // -- Jump!
        handleJump: function() {

            if (this.standing && ig.input.pressed('jump')) {
                this.isJumping = true;
                this.vel.y = -this.jump;
            }
        },

        setCollisionBox: function(x, y, offsetX, offsetY) {
            this.size.x = x;
            this.size.y = y;
            this.offset.x = offsetX;
            this.offset.y = offsetY;
        },

        updateCollisionAnimation: function() {

/*	if(this.currentAnim === this.anims.jump) {
				this.setCollisionBox(20, 20, 19, 21);	
			} else if(this.currentAnim === this.anims.fall) {
				this.setCollisionBox(20, 20, 19, 21);
			} else {
				this.setCollisionBox(30, 40, 14, 21);
			}*/
        },

        // -- Change animations
        handleAnimation: function() {

            if (this.isJumping && !this.isProne) {
                this.setCollisionBox(20, 20, 19, 21);
                this.currentAnim = this.anims.jump;
            } else if (this.vel.y > 0 && !this.isJumping && !this.isProne) {
                this.isJumping = true;
                this.setCollisionBox(20, 20, 19, 21);
                this.currentAnim = this.anims.jump;

            } else if (this.vel.x !== 0) {

                this.setCollisionBox(28, 40, 16, 21);
                this.currentAnim = this.anims.run;

                if (this.up) {
                    this.currentAnim = this.anims.runAngle;
                }

            } else if (this.standing && this.isProne) {

                this.vel.y += 500000;
                this.setCollisionBox(28, 20, 16, 41);

                this.currentAnim = this.anims.prone;

            } else if (this.shooting) {
                this.setCollisionBox(28, 40, 16, 21);
                this.currentAnim = this.anims.shoot;
            } else if (this.standing && !this.isProne) {
                this.setCollisionBox(28, 40, 16, 21);
                this.currentAnim = this.anims.idle;
            } else {
                //this.setCollisionBox(28, 40, 16, 21);
                //this.currentAnim = this.anims.idle;
            }

            this.currentAnim.flip.x = this.flip;
        },

        handleMovementTrace: function(res) {

            this.parent(res);

            if (this.isJumping && (res.collision.y || res.collision.slope)) {
                this.isJumping = false;
                this.vel.y = 0;
                this.accel.y = 0;
                this.pos.y = this.pos.y - 20;
            }
        }
    });
});