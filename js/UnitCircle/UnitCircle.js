Game.UnitCircle = function(game) {};

Game.UnitCircle.prototype = {
    create:function() {
        // this.stage.backgroundColor = '#3A5963';

        var numbers;
        var score = 0;
        var equation;
        this.degrees = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
        this.current_index = 0;

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

        // Angle line
        this.angle_line = this.add.sprite(this.world.width/2., this.world.height/2., 'angle');
        this.angle_line.anchor.setTo(0.5, 1);

        // Degrees text
        this.degrees_text = this.add.text(this.world.width*.8, this.world.height/8., "Angle: ", {
            font: "30px Arial",
            fill: "#000000",
            align: "center"
        });
        this.degrees_text.anchor.setTo(0.5, 0.5);
    },


    update: function () {
        this.angle_line.angle += 0.5;
        this.updateAngleText();
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


    updateAngleText: function () {
        // var angle = -Phaser.Math.roundTo(this.angle_line.angle, 0) + 180;
        var angle = -Phaser.Math.roundTo(this.angle_line.angle, 0) + 90;
        if (angle < 0)
        {
            angle += 360;
        }

        var final_value;
        for (i = 0; i < this.degrees.length; i++)
        {
            degree = this.degrees[i];
            if (this.mathAbs(angle - degree) < 10)
            {
                final_value = degree;
                this.degrees_text.setText(final_value.toString() + "°");
                break;
            }
        }
    },


    mathAbs: function(x) {
      x = +x;
      return (x > 0) ? x : 0 - x;
    },
}
