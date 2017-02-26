var Game = {};

Game.Boot = function(game) {

};

Game.Boot.prototype = {
    init:function() {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
    },

    preload:function() {
        this.load.image('preloaderBar', 'assets/progress-bar-2.png')
        this.load.image('logo', 'assets/owl-logo.png')
    },

    create:function() {
        this.game.stage.backgroundColor = '#D7F3FF';
        this.state.start('Preloader');
    }
}
