Game.Preloader = function(game) {
    this.preloadBar = null;
};

Game.Preloader.prototype = {
    preload:function() {
        this.logo = this.add.sprite(this.world.centerX-108, this.world.centerY-108, 'logo');
        this.logo.scale.setTo(0.5, 0.5);
        var style = {font: "32px Arial", fill: "#000"};
        this.title_text = this.add.text(this.world.centerX, this.world.centerY-216, "Times Tables", style);
        this.title_text.x = this.world.centerX - (this.title_text.width / 2);
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
        this.preloadBar.x -= this.preloadBar.width / 2
        this.preloadBar.y += 150
        this.preloadBar.anchor.setTo(0, 0.5);

        this.time.advancedTiming = true;
        this.load.setPreloadSprite(this.preloadBar);

        //LOAD ALL ASSETS
        this.load.image('bg', 'assets/BG/BG.png');
	    this.load.image('ground', 'assets/Tiles/2.png');
	    this.load.image('water', 'assets/Tiles/18.png');
	    this.load.image('water_surf', 'assets/Tiles/17.png');
	    this.load.image('stage', 'assets/Tiles/stage1.png');
	    this.load.image('star', 'assets/star.png');
        this.load.image('no', 'assets/no3.png');
        this.load.image('yes', 'assets/yes3.png');
	    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        // Load number sprites.
        this.load.spritesheet('times-tables', 'assets/times-tables.png', 50, 50, 144);
	    // var numdir = 'assets/Numbers/'
	    // var numval = ''
	    // var numpath = ''
	    // for (step=1; step<145; step++)
	    // {
	    //     numval = step.toString();
	    //     numpath = numdir + numval + '.png'
	    //     console.log(numval)
	    //     this.load.image(numval, numpath);
	    // }
    },

    create:function() {
        this.state.start('TimesTables');
    }
}
