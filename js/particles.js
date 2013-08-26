
var particles = [];

function Particle(x,y,size,r,g,b,angle,speed,friction,alpha,decay,lifetime) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.lifeTime = lifetime;
	this.timeAlive = 0;
	this.r = r;
	this.g = g;
	this.b = b;
	this.coordinates = [];
	this.coordinateCount = 10;
	this.angle = angle;
	this.speed = speed;
	this.friction = friction;
	this.alpha = alpha;
	this.decay = decay;
	while (this.coordinateCount--) {
		this.coordinates.push([this.x,this.y]);
	}
	particles.push(this);
}

Particle.prototype.render = function() {
	//ctx.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x+screen.xOffset, this.y+screen.yOffset );
	ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ');';

	ctx.beginPath();
	ctx.arc(this.x+screen.xOffset,this.y+screen.yOffset, this.size, 0, 2 * Math.PI, false);
	//ctx.fillRect(this.x+screen.xOffset,this.y+screen.yOffset, 1,1);
	ctx.fill();
};

Particle.prototype.update = function() {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed;
	this.alpha *= this.decay;
	this.speed *= this.friction;
	this.timeAlive++;
	if (this.timeAlive >= this.lifeTime) {
		deleteParticle(this);
	}
};

function createWaterParticles(x,y) {
	var particleCount = randomInt(6,15);
	while( particleCount-- ) {
		new Particle( x,y,2,0,180,250,randomFloat(0, Math.PI * 2),randomFloat(0.3,2.5),0.8,0.9, 0.9, 30 );
	}
}
function createFireParticles(x,y) {
	var particleCount = randomInt(5,15);
	while( particleCount-- ) {
		//Todo: 50/50 of the two fire colors in fire.png sprite
		if (randomInt(0,10) <= 5)
			new Particle(x,y,1,250, 0, 0, randomFloat(0,Math.PI * 2), randomFloat(0.3,3.5),1,0.9,0.6,6);
		else
			new Particle(x,y,1,0,250,0, randomFloat(0,Math.PI * 2), randomFloat(0.3,3.5),1,0.9,0.6,6);
	}
}
function createGrassParticles(x,y) {
	var particleCount = randomInt(3,6);
	while( particleCount-- ) {
		new Particle( x,y,1,30,180,30,randomFloat(0, Math.PI * 2),randomFloat(0.3,2.5),0.8,0.9, 0.7, 30 );
	}
}
function createStoneParticles(x,y) {
	var particleCount = randomInt(5,15);
	while( particleCount-- ) {
		new Particle( x,y,1,60,60,60,randomFloat(0, Math.PI * 2),randomFloat(0.3,1.8),0.8,0.9, 0.9, 30 );
	}
}
function createGasolineParticles(x,y) {
	var particleCount = randomInt(5,15);
	while( particleCount-- ) {
		new Particle( x,y,3,10,10,10,randomFloat(0, Math.PI * 2),randomFloat(0.3,1.8),0.8,0.9, 0.97, 30 );
	}
}

function renderParticles() {
	for (var i=0;i<particles.length;i++) {
		particles[i].render();
		particles[i].update();
	}
}

function deleteParticle(p) {
	for (var i=0;i<particles.length;i++) {
		if (particles[i] == p) {
			particles.splice(i, 1);
			break;
		}
	}
}

function TextParticle(str, x, y) {
	this.str = str;
	this.x = x;
	this.y = y;
	this.decay = 0.8;
	this.alpha = 1;
	particles.push(this);
}

TextParticle.prototype.render = function() {
	ctx.font = 'normal 10pt Calibri';
	ctx.fillStyle = 'rgba(' + 0 + ',' + 255 + ',' + 0 + ',' + this.alpha + ');';
	ctx.fillText(this.str, this.x, this.y);
};

TextParticle.prototype.update = function() {
	this.y -= 1;
	this.alpha *= this.decay;
	if (this.alpha < 0.2) deleteParticle(this);
};
