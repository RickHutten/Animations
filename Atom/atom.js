var atom;

$(function() {
    
    atom = new Atom('atomCanvas', 250, 250, 200, 1800);
    
    render()
});

function render() {
    var angle = 0.15*0.017453;  // Change angle by 0.15 degrees every frame
    atom.ctx.translate(atom.c.width*0.5*(1 - 1.4142*Math.cos(angle+0.785398)), 
                       atom.c.width*0.5*(1 - 1.4142*Math.sin(angle+0.785398)));
    atom.ctx.rotate(angle);
    atom.draw()
    
    requestAnimationFrame(render);
}

class Atom {
    constructor(id, width, height, start, stop) {
        this.c = document.getElementById(id);
        this.c.width = width;
        this.c.height = height;
        this.start = start;
        this.stop = stop;
        this.ctx = this.c.getContext("2d");
        
        // Set up particles
        this.core1 = new Particle(this, this.c.width*0.55, this.c.height*0.53, 0.00, 0.10, 'neutron');
        this.core2 = new Particle(this, this.c.width*0.45, this.c.height*0.47, 0.20, 0.25, 'proton');
        this.core3 = new Particle(this, this.c.width*0.50, this.c.height*0.55, 0.05, 0.15, 'proton');
        this.core4 = new Particle(this, this.c.width*0.45, this.c.height*0.53, 0.15, 0.25, 'neutron');
        this.core5 = new Particle(this, this.c.width*0.55, this.c.height*0.47, 0.05, 0.15, 'proton');
        this.core6 = new Particle(this, this.c.width*0.50, this.c.height*0.45, 0.15, 0.25, 'neutron');
        this.core7 = new Particle(this, this.c.width*0.50, this.c.height*0.50, 0.10, 0.20, 'proton');
        
        this.electron1 = new Particle(this, this.c.width*0.50, this.c.height*0.95, 0.15, 0.35, 'electron');
        this.electron2 = new Particle(this, this.c.width*0.05, this.c.height*0.50, 0.40, 0.60, 'electron');
        this.electron3 = new Particle(this, this.c.width*0.50, this.c.height*0.05, 0.65, 0.85, 'electron');
        this.electron4 = new Particle(this, this.c.width*0.95, this.c.height*0.50, 0.85, 1.00, 'electron');
    }
    draw() {
        if (window.scrollY < this.start || window.scrollY > this.stop) {
            // Don't draw atom
            // return null; // Buggy, since some scroll positions are skipped
        }
        // Clear canvas
        this.ctx.clearRect(0,0,this.c.width,this.c.height);
        
        // Calculate fraction of atom that has to be drawn
        var fraction = (window.scrollY-this.start) / (this.stop-this.start);
        this.progress = 0.5 - 0.419*Math.atan(2.5 - 5*fraction)
        if (window.scrollY > this.stop) this.progress = 1;
        else if (window.scrollY < this.start) this.progress = 0;
        
        // Draw electron path
        this.ctx.lineWidth = this.c.width * 0.025;
        this.ctx.strokeStyle = '#ccc';
        this.ctx.beginPath();
        this.ctx.arc(this.c.width*0.5, this.c.height*0.5, Math.min(this.c.width*0.5, this.c.height*0.5)*0.9, 0, this.progress*6.283185);
        this.ctx.stroke();
        
        // Draw core
        this.ctx.strokeStyle = '#fff';
        this.core1.draw();
        this.core2.draw();
        this.core3.draw();
        this.core4.draw();
        this.core5.draw();
        this.core6.draw();
        this.core7.draw();
        
        // Draw electrons        
        this.electron1.draw();
        this.electron2.draw();
        this.electron3.draw();
        this.electron4.draw();
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
            // Change style to the kind of particle
            if (this.style == 'electron') {
                this.maxSize = this.atom.c.width * 0.04;
                this.atom.ctx.lineWidth = this.atom.c.width * 0.015;
                this.atom.ctx.fillStyle = '#666';
            }
            else if (this.style == 'proton') {
                this.maxSize = this.atom.c.width * 0.05;
                this.atom.ctx.lineWidth = this.atom.c.width * 0.0075;
                this.atom.ctx.fillStyle = '#444';
            }
            else if (this.style == 'neutron') {
                this.maxSize = this.atom.c.width * 0.05;
                this.atom.ctx.lineWidth = this.atom.c.width * 0.0075;
                this.atom.ctx.fillStyle = '#888';
            }
            // Calculate size and draw particle
            var size = Math.min((this.atom.progress-this.start) / (this.end-this.start), 1) * this.maxSize;
            this.atom.ctx.beginPath();
            this.atom.ctx.arc(this.x, this.y, size, 0, 6.283185);
            this.atom.ctx.fill();
            this.atom.ctx.stroke();
        }
    }
}