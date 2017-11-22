var ground;
var background;
var rocket;

var startposition;
var progress;

var StateNotActive;
var StateScrollDownToPad;
var StateOnPad;
var StateLiftoff;

$(function() {
    window.addEventListener("resize", onResize);
    
    window.addEventListener("scroll", render);
    
    setupWorld(); // Initialise world
});

/**
 * State class
 */
class State {
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }
    IsActive() {
        //console.log(this.begin + " " + progress + " " + this.end);
        return this.begin <= progress && progress < this.end;
    }
}

function setupWorld() {
    var el = $('#filler');
    startposition = el.position().top + el.offset().top + el.outerHeight(true) - window.innerHeight;
    
    // Init states
    StateNotActive = new State(-Infinity, 0);
    StateScrollDownToPad = new State(0, window.innerHeight);
    StateOnPad = new State(window.innerHeight, window.innerHeight + 1000);
    StateLiftoff = new State(window.innerHeight + 1000, Infinity);
    
    
    background = new Background(document.body);
    ground = new Ground("ground", 200);
    rocket = new Rocket("rocket");
    
    
    //requestAnimationFrame(render);
}

function onResize() {
}

function render() {
    console.log(window.scrollY)
    progress = window.scrollY - startposition;
    // Draw the states that are in 
    if (StateNotActive.IsActive()) {
        //console.log('State: ' + "StateNotActive");
    } else if (StateScrollDownToPad.IsActive()) {
        //console.log('State: ' + "StateScrollDownToPad");
        ground.draw();
        rocket.draw();
    } else if (StateOnPad.IsActive()) {
        //console.log('State: ' + "StateOnPad");
        background.draw();
        ground.draw();
        rocket.draw();
    } else if (StateLiftoff.IsActive()) {
        //console.log('State: ' + "StateLiftoff");
        background.draw();
        ground.draw();
        rocket.draw();
    }  

    //requestAnimationFrame(render);
}

class Rocket {
    constructor(id) {
        this.e = document.getElementById(id);
        this.height = this.e.clientHeight;
        this.bottom = 100;
        this.launchDuration = 1000;
    }
    draw() {
        if (StateScrollDownToPad.IsActive()) {
            if (progress < 0.6 * StateScrollDownToPad.end) {
                // Screen is too high to show the ground
                if (!this.e.hidden) {
                    this.e.hidden = true;
                    this.e.style.bottom = `${-this.height}px`;
                }
            } else {
                // Ground is coming into view
                if (this.e.hidden) {
                    this.e.hidden = false; // Make the ground visible
                }
                this.e.style.bottom = `${-this.height + (progress - 0.6*StateScrollDownToPad.end)*(this.height+this.bottom)/(0.4*(StateScrollDownToPad.end - StateScrollDownToPad.begin))}px`;
            }
        } else if (StateOnPad.IsActive()) {
            // Ground is stationary
            if (this.e.style.bottom != `${this.bottom}px`) {
                this.e.style.bottom = `${this.bottom}px`;
            }
        } else if (StateLiftoff.IsActive()) {
            if (progress - StateLiftoff.begin > this.launchDuration ) {
                this.e.style.bottom = "300px";
            } else {
                this.e.style.bottom = `${100 + (progress - StateLiftoff.begin)*(200/this.launchDuration )}px`;
            }
        }
    }
}

class Background {
    constructor(e) {
        this.e = e;
        this.light = 244;
        this.dark = 20;
        this.duration = 500; // Progress it takes to change the background color
        this.offset = 500; // Progress to wait before changing color
    }
    draw() {
        if (StateNotActive.IsActive()) {
            this.e.style.background = "rgb(${this.light}, ${this.light}, ${this.light})";
        } else if (StateScrollDownToPad.IsActive()) {
            this.e.style.background = "rgb(${this.light}, ${this.light}, ${this.light})";
        } else if (StateOnPad.IsActive()) {
            this.e.style.background = "rgb(${this.light}, ${this.light}, ${this.light})";
        } else if (StateLiftoff.IsActive()) {
            var color;
            if (progress - this.offset > StateLiftoff.begin + this.duration) {
                color = this.dark;
            } else if (progress - this.offset < StateLiftoff.begin) {
                color = this.light;
            } else {
                color = this.light - (progress - this.offset - StateLiftoff.begin) * ((this.light - this.dark) / this.duration);
            }
            color = Math.round(color)
            this.e.style.background = `rgb(${color}, ${color}, ${color})`;
        }  
    }
}

class Ground {
    constructor(id, height) {
        this.e = document.getElementById(id);
        this.height = height;
        
        this.e.style.height = `${height}px`;
        this.e.style.bottom = `${-height}px`;
    }
    get() {
        //Debugging only
        return this.e;
    }
    update() {
        //TODO: when the screen resizes
    }
    draw() {
        if (StateScrollDownToPad.IsActive()) {
            if (progress < 0.5 * StateScrollDownToPad.end) {
                // Screen is too high to show the ground
                if (!this.e.hidden) {
                    this.e.hidden = true;
                    this.e.style.bottom = `${-this.height}px`;
                }
            } else {
                // Ground is coming into view
                if (this.e.hidden) {
                    this.e.hidden = false; // Make the ground visible
                }
                this.e.style.bottom = `${2*(progress*this.height/StateScrollDownToPad.end - this.height)}px`;
            }
        } else if (StateOnPad.IsActive()) {
            // Ground is stationary
            if (this.e.style.bottom != "0px") {
                this.e.style.bottom = "0px"
            }
        } else if (StateLiftoff.IsActive()) {
            if (progress > StateLiftoff.begin + 2*this.height) {
                if (this.e.style.bottom != `${-this.height}px`) {
                    // When it is ofscreen
                    this.e.style.bottom = `${-this.height}px`;
                }
            } else if (progress > StateLiftoff.begin) {
                // When it is going down
                this.e.style.bottom = `${0.5*(StateLiftoff.begin - progress)}px`;
            }
        }
    }
}