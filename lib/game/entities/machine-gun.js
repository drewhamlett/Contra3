ig.module(
	'game.entities.machine-gun'
)
.requires(
	'impact.entity'
)
.defines(function() { 
	
	EntityMachineGun = ig.Entity.extend({
			
	});

	BulletClip = ig.Entity.extend({

		size: {
			x: 4,
			y: 4
		},
		offset: {
			x: 2,
			y: 2
		},

		friction: {
			x: 48,
			y: 2
		},

		// The fraction of force with which this entity bounces back in collisions
		bounciness: 0.3,

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		// Check Against B - our evil enemy group
		collides: ig.Entity.COLLIDES.LITE,

		animSheet: new ig.AnimationSheet('media/casing.png', 12, 11),

		bounceCounter: 0,

		init: function(x, y, settings) {

			this.parent(x, y, settings);

			this.vel.x = Math.floor(Math.random() * 161) - 80;
			this.vel.y = -60;
			this.addAnim('idle', .1, [0, 1, 2, 3]);
			this.addAnim('floor', .5, [1, 1, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6]);
		},


		handleMovementTrace: function(res) {
			this.parent(res);
			if (res.collision.x || res.collision.y) {

				this.currentAnim = this.anims.floor;

				// only bounce 3 times
				this.bounceCounter++;
				if (this.bounceCounter > 40) {
					this.kill();
				}
			}
		}
	});

	MachineGunBullet = ig.Entity.extend({
		size: {
			x: 4,
			y: 4
		},
		offset: {
			x: 2,
			y: 2
		},
		maxVel: {
			x: 500,
			y: 0
		},

		// The fraction of force with which this entity bounces back in collisions
		bounciness: 0.2,

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.B,
		// Check Against B - our evil enemy group
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet('media/bullet.png', 8, 8),

		bounceCounter: 0,

		init: function(x, y, settings) {

			this.parent(x, y, settings);

			var clipOffset = settings.flip ? 15: -20
			
			ig.game.spawnEntity(BulletClip, this.pos.x + clipOffset, this.pos.y);
			//spawn clip for gun
			this.vel.x = (settings.flip ? -this.maxVel.x: this.maxVel.x);
			this.vel.y = -50;

			this.addAnim('idle', 1, [0]);
		},

		handleMovementTrace: function(res) {
			this.parent(res);
			if (res.collision.x || res.collision.y || res.collision.slope || (this.pos.x > ig.game.screen.x + ig.system.width)) {
				this.kill();
			}
		},

		// This function is called when this entity overlaps anonther entity of the
		// checkAgainst group. I.e. for this entity, all entities in the B group.
		check: function(other) {
			other.receiveDamage(1, this);
			this.kill();
		}
	});

});