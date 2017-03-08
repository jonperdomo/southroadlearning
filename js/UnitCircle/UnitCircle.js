Game.UnitCircle = function(game) {};

Game.UnitCircle.prototype = {
    create:function() {
        // this.stage.backgroundColor = '#3A5963';

        var numbers;
        var score = 0;
        var equation;

        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        bg = this.add.sprite(0, 0, 'bg');
        bg.scale.setTo(0.125, 0.125);
        bg.y += this.world.height/2.

        // Unit Circle
        this.unit_circle = this.add.sprite(this.world.width/2., this.world.height/2., 'unit_circle');
        this.unit_circle.scale.setTo(0.75, 0.75);
        this.unit_circle.x -= this.unit_circle.width/2.;
        this.unit_circle.y -= this.unit_circle.height/2.;

        // angle_line
        this.angle_line = this.add.sprite(this.world.width/2., this.world.height/2., 'angle');
        // this.angle_line = this.add.sprite(this.world.width/2., 0, 'angle');
        this.angle_line.anchor.setTo(0.5, 1);
        // this.angle_line.x -= this.angle_line.width/2.;
        // this.angle_line.y -= this.angle_line.height;

        //  The this.platforms group contains the ground and the 2 ledges we can jump on
        this.grounds = this.add.group();
        this.platforms = this.add.group();
        this.number_sprites = this.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;
        this.grounds.enableBody = true;
        this.number_sprites.enableBody = true;

        var ground;
        var offset;

        //  Now let's create two ledges
        var ledge = this.platforms.create(64, 450, 'stage');
        ledge.scale.setTo(0.5, 0.5);
        ledge.body.immovable = true;
        ledge.body.allowGravity = false;

        ledge = this.platforms.create(336, 350, 'stage');
        ledge.scale.setTo(0.5, 0.5);
        ledge.body.immovable = true;
        ledge.body.allowGravity = false;

        ledge = this.platforms.create(608, 250, 'stage');
        ledge.scale.setTo(0.5, 0.5);
        ledge.body.immovable = true;
        ledge.body.allowGravity = false;

        this.platforms.setAll('body.velocity.y', -100);

        // The this.player and its settings
        this.player = this.add.sprite(384, 200, 'dude');


        //  We need to enable physics on the this.player
        this.physics.arcade.enable(this.player);

        //  this.player physics properties. Give the little guy a slight bounce.
        this.player.body.gravity.y = 500;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    	//  Our controls.
        this.cursors = this.input.keyboard.createCursorKeys();

    },

    update: function () {
        this.angle_line.angle += 1;
        this.platforms.forEach(this.wrapPlatform);

        //  Collide the this.player with the this.platforms
        this.physics.arcade.collide(this.player, this.platforms);

        //  Reset the this.players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the this.player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -350;
        }

        if (this.physics.arcade.collide(this.player, this.grounds))
        {
            this.player.body.velocity.y = -600;
        }

    },

    render: function() {
        this.game.debug.spriteInfo(this.angle_line, 40, 170);
    },

    wrapPlatform: function (platform) {
        // Half of platform width
        if (platform.y < 250)
        {
            platform.body.velocity.y = 100;
        }
        else if (platform.y > 450)
        {
            platform.body.velocity.y = -100;
        }
    },
}
