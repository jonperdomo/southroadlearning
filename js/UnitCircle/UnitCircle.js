Game.UnitCircle = function(game) {};

Game.UnitCircle.prototype = {
    create:function() {
        // Enable mouse click events
        this.game.input.mouse.capture = true;

        //  Background
        bg = this.add.sprite(0, 0, 'bg');
        bg.scale.setTo(0.125, 0.125);
        bg.y += this.world.height/2.

        // Unit Circle
        this.unit_circle = this.add.sprite(this.world.width/2., this.world.height/2., 'unit_circle');
        this.unit_circle.scale.setTo(0.75, 0.75);
        this.unit_circle.x -= this.unit_circle.width/2.;
        this.unit_circle.y -= this.unit_circle.height/2.;
        this.degrees = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

        // Angle line
        this.angle_update = 0.3;
        this.angle_line = this.add.sprite(this.world.width/2., this.world.height/2., 'angle');
        this.angle_line.anchor.setTo(0.5, 1);

        // Problem text
        this.equation_text = this.add.text(this.world.width/2., this.world.height/8., "", {
            font: "30px Arial",
            fill: "#000000",
            align: "center"
        });
        this.equation_text.anchor.setTo(0.5, 0.5);

        // Result icons
        // 30 px Arial
        this.no_icon = this.add.sprite(this.equation_text.x - this.equation_text.width -300, this.equation_text.y, 'no');
        this.no_icon.anchor.setTo(0.5, 0.5);
        this.no_icon.visible = false;
        this.yes_icon = this.add.sprite(this.equation_text.x - this.equation_text.width -300, this.equation_text.y, 'yes');
        this.yes_icon.anchor.setTo(0.5, 0.5);
        this.yes_icon.visible = false;

        // Generate the solution table
        this.sines_table = this.setupSinesTable();
        this.cosines_table = this.setupCosinesTable();

        // Set up a new problem
        this.equations = this.createEquations();
        this.active_equation = this.equations[0];
        this.equation_text.setText(this.active_equation.equation + "(θ)=" + this.active_equation.point);
        console.log("success!");
    },


    updateEquation: function() {
        if (this.equations.length > 0) {
            this.equations.splice(0, 1);
            this.active_equation = this.equations[0];
            this.equation_text.setText(this.active_equation.equation + "(θ)=" + this.active_equation.point);
        }
    },


    createEquations: function () {
        // Set up a queue of all possible string problems and solutions.
        // Creates an array of tuples with problem at 0 and solution at 1, and then shuffles it.
        points = ["-1","-√3/2","-√2/2","0","1/2","√2/2","√3/2","1"];
        equations = [];
        while (points.length > 0) {
            // Get random index
            index = this.rnd.integerInRange(0, points.length-1)
            value = points[index];
            sine_data = {
                "equation": "sin",
                "point": value,
                solution: this.sines_table[value] };
            cosine_data = {
                "equation": "sin",
                "point": value,
                "solution": this.cosines_table[value] };
            equations.push(sine_data);
            equations.push(cosine_data);
            // problems.push([sine_text, this.sines_table[value]]);
            // problems.push([cosine_text, this.cosines_table[value]]);
            points.splice(index, 1);
        }
        this.shuffleArray(equations);

        return equations;
    },


    shuffleArray: function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    },


    setupSinesTable: function () {
        // Generates a table with unit circle coordinates as keys and degrees as values
        sines = {
            "-1": [270],
            "-√3/2": [240, 300],
            "-√2/2": [225, 315],
            "-1/2": [210, 330],
            "0": [0, 360],
            "1/2": [30, 150],
            "√2/2": [45, 135],
            "√3/2": [60, 120],
            "1": [90] }

        return sines;
    },


    setupCosinesTable: function () {
        // Generates a table with unit circle coordinates as keys and degrees as values
        cosines = {
            "-1": [180],
            "-√3/2": [150, 210],
            "-√2/2": [135, 225],
            "-1/2": [120, 240],
            "0": [90, 270],
            "1/2": [60, 300],
            "√2/2": [45, 315],
            "√3/2": [30, 330],
            "1": [0] }

        return cosines;
    },


    update: function () {
        this.angle_line.angle += this.angle_update;
        this.updateAngleText();
    },


    wrapPlatform: function (platform) {
        // Half of platform width
        if (platform.y < 250) {
            platform.body.velocity.y = 100;
        } else if (platform.y > 450) {
            platform.body.velocity.y = -100;
        }
    },


    updateAngleText: function () {
        if (this.game.input.activePointer.isDown) {
            var angle = -Phaser.Math.roundTo(this.angle_line.angle, 0) + 90;
            if (angle < 0) {
                angle += 360;
            }
            var final_value = this.closest(angle, this.degrees);
            // this.equation_text.setText("sin(" + final_value.toString() + "°) = -√3/2");
            this.equation_text.setText(this.active_equation.equation + "(" + final_value.toString() + "°)=" + this.active_equation.point);
            if (this.active_equation.solution.includes(final_value)) {
                console.log("correct!");
                this.yes_icon.visible = true;
                this.no_icon.visible = false;
                this.updateEquation();
                this.angle_update = -this.angle_update;
            } else {
                this.no_icon.visible = true;
                this.yes_icon.visible = false;
            }
            // this.yes_icon.visible = this.no_icon.visible;
            // this.no_icon.visible = !this.no_icon.visible;
        } else {
            // this.equation_text.setText("sin(θ) = -√3/2");
            this.equation_text.setText(this.active_equation.equation + "(θ)=" + this.active_equation.point);
            this.yes_icon.visible = false;
            this.no_icon.visible = false;
        }
    },


    closest: function (num, arr) {
        var curr = arr[0];
         var diff = this.mathAbs (num - curr);
         for (var val = 0; val < arr.length; val++) {
             var newdiff = this.mathAbs (num - arr[val]);
             var newdiff = Math.abs(num - arr[val]);
             if (newdiff < diff) {
                 diff = newdiff;
                 curr = arr[val];
             }
         }
         return curr;
    },


    mathAbs: function(x) {
      x = +x;
      return (x > 0) ? x : 0 - x;
    },


}
