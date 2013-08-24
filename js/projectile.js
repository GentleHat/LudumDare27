
function Projectile(type,x,y,target) {
	this.type = type;
	this.x = x;
	this.y = y;
	this.xv = 0;
	this.yv = 0;
	this.width = 16;
	this.height = 25;
	this.target = target;
	this.boundingBox = new BoundingBox(this.x,this.y,this.width,this.height);
	this.img = new Image();
	this.img.src = "images/water.png";
	this.scale = 1;
	this.speed = 2;
	this.power = 10;
	entities.push(this);
}

Projectile.prototype.render = function() {
	if (this.target !== null) {
		this.rotation = Math.atan2(this.y+screen.yOffset-(this.height/2)-this.target.y+screen.yOffset,this.x+screen.xOffset-(this.width/2)-this.target.x+screen.xOffset)*(180 / Math.PI);
		if (this.rotation < 0) { this.rotation += 360;}
		this.rotation -= 270;
	}
	ctx.save();
	ctx.translate(this.x+screen.xOffset,this.y+screen.yOffset);
	ctx.rotate(degToRad(this.rotation));
	ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
	ctx.restore();
};

Projectile.prototype.update = function() {
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Enemy) {
			if (this.boundingBox.isColliding(entities[i])) {
				entities[i].takeDamage(this.power);
				this.kill();
				createWaterParticles(this.x,this.y);
			}
		}
	}

	this.boundingBox.update(this.x-(this.width/2),this.y-(this.height/2));
	if (this.target === null) {
		this.kill();
	}
	if (this.target instanceof Enemy) { //Guided
		var dirx = (this.target.x - this.x);
		var diry =  (this.target.y - this.y);

		var hyp = Math.sqrt(dirx*dirx + diry*diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
		if (hyp < 35) {
			//this.target = null;
		}
	}
	else if (this.target instanceof Point) {
		var dirx = (this.target.x - this.x);
		var diry =  (this.target.y - this.y);

		var hyp = Math.sqrt(dirx*dirx + diry*diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
		if (hyp < 15) {
			this.target = null;
		}
	}
	else {
		this.kill();
	}
	this.x += this.xv;
	this.y += this.yv;
};

Projectile.prototype.kill = function() {
	entities.clean(this);
};