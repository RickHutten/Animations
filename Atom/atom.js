var atom;

$(function() {
    window.addEventListener("resize", onResize);
    
    atom = new Atom('atomCanvas', 200, 1800);
    
    render()
});

function onResize() {
    atom.update()
}

function render() {
    var angle = 0.15*0.017453;  // Change angle by 0.15 degrees every frame
    atom.ctx.translate(atom.c.width*0.5*(1 - 1.4142*Math.cos(angle+0.785398)), 
                       atom.c.width*0.5*(1 - 1.4142*Math.sin(angle+0.785398)));
    atom.ctx.rotate(angle);
    atom.angle += angle;
    atom.draw()
    
    requestAnimationFrame(render);
}

class Atom {
    constructor(id, start, end) {
        this.angle = 0; // Count angle that has been rotated, needed when updating resolution
        this.c = document.getElementById(id);
        this.c.width = Math.max(this.c.clientHeight, this.c.clientWidth); // Make width equal to the biggest size, width or height
        this.c.height = this.c.width; // Make the canvas element square
        this.start = start;
        this.end = end;
        this.ctx = this.c.getContext("2d");
        
        // Set up particles
        this.core1 = new Particle(this, 0.55, 0.53, 0.00, 0.10, 'neutron');
        this.core2 = new Particle(this, 0.45, 0.47, 0.20, 0.25, 'proton');
        this.core3 = new Particle(this, 0.50, 0.55, 0.05, 0.15, 'proton');
        this.core4 = new Particle(this, 0.45, 0.53, 0.15, 0.25, 'neutron');
        this.core5 = new Particle(this, 0.55, 0.47, 0.05, 0.15, 'proton');
        this.core6 = new Particle(this, 0.50, 0.45, 0.15, 0.25, 'neutron');
        this.core7 = new Particle(this, 0.50, 0.50, 0.10, 0.20, 'proton');
        
        this.electron1 = new Particle(this, 0.50, 0.95, 0.15, 0.35, 'electron');
        this.electron2 = new Particle(this, 0.05, 0.50, 0.40, 0.60, 'electron');
        this.electron3 = new Particle(this, 0.50, 0.05, 0.65, 0.85, 'electron');
        this.electron4 = new Particle(this, 0.95, 0.50, 0.85, 1.00, 'electron');
    }
    update() {
        // Update the resolution of the canvas when the screen is resized
        this.c.width = Math.max(this.c.clientHeight, this.c.clientWidth);
        this.c.height = this.c.width;
        // Set the rotation else this is lost when the width and height change
        atom.ctx.translate(atom.c.width*0.5*(1 - 1.4142*Math.cos(atom.angle+0.785398)), 
                       atom.c.width*0.5*(1 - 1.4142*Math.sin(atom.angle+0.785398)));
        atom.ctx.rotate(atom.angle);
    }
    draw() {
        if (window.scrollY < this.start || window.scrollY > this.end) {
            // Don't draw atom
            // return null; // Buggy, since some scroll positions are skipped
        }
        // Clear canvas
        this.ctx.clearRect(0,0,this.c.width,this.c.height); //TODO: Don't clear if progress was 0 previous time
        
        // Calculate fraction of atom that has to be drawn
        var fraction = (window.scrollY-this.start) / (this.end-this.start);
        this.progress = 0.5 - 0.419*Math.atan(2.5 - 5*fraction);
        if (window.scrollY > this.end) this.progress = 1;
        else if (window.scrollY < this.start) return null; // Window is already cleared, don't draw anything
        
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
            this.atom.ctx.arc(this.atom.c.width*this.x, this.atom.c.height*this.y, size, 0, 6.283185);
            this.atom.ctx.fill();
            this.atom.ctx.stroke();
        }
    }
}