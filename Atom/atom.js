var atom;
var angledeg = 0.15;

$(function() {
  // On page loaded
  
    $(window).scroll(onScroll);
    
    atom = new Atom('atomCanvas', 200, 200, 10, 1200);
    
    rotate()
});

function rotate() {
    var angle = (angledeg)*Math.PI/180;
    var kp = Math.PI /4
    atom.ctx.translate(100 - Math.cos(angle+kp)*141.42136, 100-Math.sin(angle+kp)*141.42136);
    atom.ctx.rotate(angle);
    atom.draw()
    setTimeout(rotate, 16);
}

class Atom {
    constructor(id, width, height, start, stop) {
        this.c = document.getElementById(id);
        this.c.width = width;
        this.c.height = height;
        this.start = start;
        this.stop = stop;
        this.ctx = this.c.getContext("2d");
    }
    draw() {
        if (window.scrollY < this.start || window.scrollY > this.stop) {
            // Don't draw atom
            // return null; // Buggy, since some scroll positions are skipped
        }
        // Clear canvas
        this.ctx.clearRect(0,0,this.c.width,this.c.height);
        
        // Calculate fraction of atom that has to be drawn
        var fraction = (window.scrollY - this.start) / (this.stop - this.start);
        this.progress = (Math.PI/2+1.319*Math.atan(5*fraction-2.5))/Math.PI;
        if (window.scrollY > this.stop) this.progress = 1;
        if (window.scrollY < this.start) this.progress = 0;
        
        // Draw core
        var core1 = new Particle(this, this.c.width*0.55, this.c.height*0.53, 0.00, 0.10, 'neutron');
        var core2 = new Particle(this, this.c.width*0.45, this.c.height*0.47, 0.20, 0.25, 'proton');
        var core3 = new Particle(this, this.c.width*0.50, this.c.height*0.55, 0.05, 0.15, 'proton');
        var core4 = new Particle(this, this.c.width*0.45, this.c.height*0.53, 0.15, 0.25, 'neutron');
        var core5 = new Particle(this, this.c.width*0.55, this.c.height*0.47, 0.05, 0.15, 'proton');
        var core6 = new Particle(this, this.c.width*0.50, this.c.height*0.45, 0.15, 0.25, 'neutron');
        var core7 = new Particle(this, this.c.width*0.50, this.c.height*0.50, 0.10, 0.20, 'proton');
        core1.draw();
        core2.draw();
        core3.draw();
        core4.draw();
        core5.draw();
        core6.draw();
        core7.draw();
        
        // Draw electron path
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = '#aaa';
        this.ctx.beginPath();
        this.ctx.arc(this.c.width/2,this.c.height/2,Math.min(this.c.width/2, this.c.height/2)*0.9,0,this.progress * 2*Math.PI);
        this.ctx.stroke();
        
        // Draw electrons
        var electron1 = new Particle(this, this.c.width/2,    this.c.height*0.95, 0.15, 0.35, 'electron');
        var electron2 = new Particle(this, this.c.width*0.05, this.c.height/2,    0.4,  0.6, 'electron');
        var electron3 = new Particle(this, this.c.width/2,    this.c.height*0.05, 0.65, 0.85, 'electron');
        var electron4 = new Particle(this, this.c.width*0.95, this.c.height/2,    0.85, 1, 'electron');
        
        electron1.draw();
        electron2.draw();
        electron3.draw();
        electron4.draw();
    }
}

class Particle {
    constructor(atom, x, y, start, end, style) {
        this.atom = atom;
        this.x = x;
        this.y = y;
        this.start = start;
        this.end = end;
        this.style = style;
    }
    draw() {
        if (this.atom.progress > this.start) {
            if (this.style == 'electron') {
                this.maxSize = 8;
                this.atom.ctx.lineWidth = 3;
                this.atom.ctx.fillStyle = '#666';
            }
            else if (this.style == 'proton') {
                this.maxSize = 10;
                this.atom.ctx.lineWidth = 1.5;
                this.atom.ctx.fillStyle = '#444';
            }
            else if (this.style == 'neutron') {
                this.maxSize = 10;
                this.atom.ctx.lineWidth = 1.5;
                this.atom.ctx.fillStyle = '#888';
            }
            this.atom.ctx.strokeStyle = '#fff';
            var size = Math.min((this.atom.progress - this.start) / (this.end - this.start), 1) * this.maxSize;
            this.atom.ctx.beginPath();
            this.atom.ctx.arc(this.x, this.y, size, 0, 2 * Math.PI);
            this.atom.ctx.fill();
            this.atom.ctx.stroke();
        }
    }
}
    


function onScroll() {  
    //atom.draw();
}