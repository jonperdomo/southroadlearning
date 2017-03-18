Game.TimesTables = function(game) {};

Game.TimesTables.prototype = {
    create:function() {
        var numbers;
        var score = 0;
        var equation;
        var all_equations;
        var lefthand;
        var righthand;
        var timesTable;

        // Set up times table dictionary
        tableRange = (1,12);
        timesTable = this.setupTimesTable(tableRange);

        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        this.add.sprite(0, 0, 'bg');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.grounds = this.add.group();
        this.platforms = this.add.group();
        this.number_sprites = this.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;
        this.grounds.enableBody = true;
        this.number_sprites.enableBody = true;

        //  Now let's create three ledges
        var left_ledge = this.platforms.create(64, 450, 'stage');
        left_ledge.scale.setTo(0.5, 0.5);
        left_ledge.body.immovable = true;
        left_ledge.body.allowGravity = false;

        var middle_ledge = this.platforms.create(336, 350, 'stage');
        middle_ledge.scale.setTo(0.5, 0.5);
        middle_ledge.body.immovable = true;
        middle_ledge.body.allowGravity = false;

        var right_ledge = this.platforms.create(608, 250, 'stage');
        right_ledge.scale.setTo(0.5, 0.5);
        right_ledge.body.immovable = true;
        right_ledge.body.allowGravity = false;

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

        // Set up initial equation
        this.choice_number = 3;
        lefthand = this.rnd.integerInRange(1, 12);
        righthand = this.rnd.integerInRange(1, 12);
        this.solution = timesTable[lefthand-1][righthand-1]
        console.log(lefthand, " x ", righthand, "is: ", this.solution);

    	choice_array = [this.solution];
    	for (var i = 0; i < this.choice_number-1; i++)
    	{
    		var choice = this.rnd.integerInRange(1, 144);
            choice_array.push(choice);
    	}
        this.shuffleArray(choice_array);

        //  The score
        equationText = lefthand.toString() + ' x ' + righthand.toString() + ' = '
        this.score_text = this.add.text(16, 16, equationText, { fontSize: '32px', fill: '#000' });
        this.score_text.x = 400 - (this.score_text.width / 2);

        // Numbers setup
    	for (var i = 0; i < this.choice_number; i++)
    	{
            var number_sprite = this.number_sprites.create(this.world.width + (i * this.world.width / 2), 125, 'times-tables');
            number_sprite.frame = choice_array[i]-1;
    		number_sprite.scale.setTo(0.75, 0.75);
    	    number_sprite.body.immovable = true;
    	    number_sprite.body.allowGravity = false;
    	}

        // Set numbers velocity
        this.number_sprites.setAll('body.velocity.x', -100);

        // Result icons
        this.yes_icon = this.add.sprite(92, 75, 'yes');
        this.yes_icon.anchor.setTo(0.5, 0.5);
        this.yes_icon.visible = false;
        this.no_icon = this.add.sprite(92, 75, 'no');
        this.no_icon.anchor.setTo(0.5, 0.5);
        this.no_icon.visible = false;

        // Showing result icon
        this.showing_result = false;

        // Correct icon timer
        this.correct_timer = this.game.time.create(false);
        this.correct_timer.loop(500, this.onCorrectTimer, this);
        this.correct_timer.start();
        this.correct_timer.pause();

        // Incorrect icon timer
        this.incorrect_timer = this.game.time.create(false);
        this.incorrect_timer.loop(500, this.onIncorrectTimer, this);
        this.incorrect_timer.start();
        this.incorrect_timer.pause();
    },

    update: function () {
        this.platforms.forEach(this.wrapPlatform);
        this.number_sprites.forEach(this.wrapNumbers);

        //  Collide the this.player with the this.platforms
        this.physics.arcade.collide(this.player, this.platforms);

        // Left-hand numbers
        this.physics.arcade.overlap(this.player, this.number_sprites, this.collectNumber, null, this);

        //  Reset the this.players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        } else if (this.cursors.right.isDown) {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');

        } else {
            //  Stand still
            this.player.animations.stop();
            this.player.frame = 4; }

        //  Allow the this.player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -350; }

        // Reset player if out of bounds
        this.wrapPlayer(this.player);
    },

    wrapPlayer: function(player) {
        if (player.body.position.y == (this.game.world.height - this.player.height)) {
            console.log("player reset.");
            player.body.position.x = 384;
            player.body.position.y = 180;
            console.log("position: ", player.body.position.x, ", ", player.body.position.y);
        }
    },

    setupTimesTable: function (tableRange) {
        timesTable =
        [
        [ 1,2,3,4,5,6,7,8,9,10,11,12 ],
        [ 2,4,6,8,10,12,14,16,18,20,24 ],
        [ 3,6,9,12,15,18,21,24,27,30,33,36 ],
        [ 4,8,12,16,20,24,28,32,36,40,44,48 ],
        [ 5,10,15,20,25,30,35,40,45,50,55,60 ],
        [ 6,12,18,24,30,36,42,48,54,60,66,72 ],
        [ 7,14,21,28,35,42,49,56,63,70,77,84 ],
        [ 8,16,24,32,40,48,56,64,72,80,88,96 ],
        [ 9,18,27,36,45,54,63,72,81,90,99,108 ],
        [ 10,20,30,40,50,60,70,80,90,100,110,120 ],
        [ 11,22,33,44,55,66,77,88,99,110,121,132 ],
        [ 12,24,36,48,60,72,84,96,108,120,132,144 ]
        ];

    	return timesTable;
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

    wrapNumbers: function (number) {
        // Half of platform width
        if (number.x < -number.width)
        {
            // For 6:
    		// number.body.position.x = (800 - number.width) * 3.;
            // For 4:
            // number.body.position.x = (800 - number.width) * 2;
            // For 3:
            number.body.position.x = (800 - number.width) * 1.5;
        }
    },

    collectNumber: function (player, number) {
        if (this.showing_result == false) {
            //  Add and update the score
            answer = number.frame+1;
        	if (answer == this.solution)
        	{
                console.log("correct!");
                this.yes_icon.visible = true;
                this.showing_result = true;
                this.correct_timer.resume();
                console.log("Timer started.");
            } else {
                console.log("wrong");
                this.no_icon.visible = true;
                this.showing_result = true;
                this.incorrect_timer.resume();
                console.log("Timer started.");
            }
        }
    },

    onCorrectTimer: function() {
        this.correct_timer.pause();
        console.log("Timer stopped");
        this.yes_icon.visible = false;
        this.number_sprites.removeAll();
        this.setupEquation();
        this.showing_result = false;
    },

    onIncorrectTimer: function() {
        this.incorrect_timer.pause();
        console.log("Timer stopped");
        this.no_icon.visible = false;
        this.showing_result = false;
    },

    shuffleArray: function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    },

    setupEquation: function () {
    	// Set up initial equation
        lefthand = this.rnd.integerInRange(1, 12);
        righthand = this.rnd.integerInRange(1, 12);
        this.solution = timesTable[lefthand-1][righthand-1]
        console.log(lefthand, " x ", righthand, "is: ", this.solution);

    	choice_array = [this.solution];
    	for (var i = 0; i < this.choice_number-1; i++)
    	{
    		var choice = this.rnd.integerInRange(1, 144);
            choice_array.push(choice);

    	}
        this.shuffleArray(choice_array);

        //  The score
        equation = lefthand.toString() + ' x ' + righthand.toString()
    	this.score_text.text = equation + ' = '
    	this.score_text.x = (this.world.width / 2.) - (this.score_text.width / 2.);
    	this.solution = (timesTable[lefthand-1][righthand-1]).toString();

        // Numbers setup
    	for (var i = 0; i < this.choice_number; i++)
    	{
            var number_sprite = this.number_sprites.create(this.world.width + (i * this.world.width / 2), 125, 'times-tables');
            number_sprite.frame = choice_array[i]-1;
    		number_sprite.scale.setTo(0.75, 0.75);
    	    number_sprite.body.immovable = true;
    	    number_sprite.body.allowGravity = false;
    	}

        // Set numbers velocity
        this.number_sprites.setAll('body.velocity.x', -100);

    },


}
