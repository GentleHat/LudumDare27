
function Enemy(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.type = "spider";
	this.rotation = 0;
	this.img = new Image();
	this.img.src = "images/spider.png";
	this.boundingBox = new BoundingBox(this.x,this.y,this.width,this.height);
	this.target = new Point(222,222);
	this.speed = 1;
	this.xv = 0;
	this.yv = 0;
	this.scale = 1;
	entities.push(this);
}

Enemy.prototype.render = function() {
	if (this.target !== null) {
		this.rotation = Math.atan2(this.y+screen.yOffset-(this.height/2)-this.target.y+screen.yOffset,this.x+screen.xOffset-(this.width/2)-this.target.x+screen.xOffset)*(180 / Math.PI);
		if(this.rotation < 0) { this.rotation += 360;}
		this.rotation -= 270;
	}
	ctx.save();
	ctx.translate(this.x+screen.xOffset,this.y+screen.yOffset);
	ctx.rotate(degToRad(this.rotation));
	ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
	ctx.restore();
	ctx.fillStyle = "#F00";
	ctx.fillRect(this.x,this.y,5,5);
};

Enemy.prototype.update = function() {
	this.xv = 0;
	this.yv = 0;
	this.boundingBox.update(this.x,this.y);
	if (this.target !== null) {
		var dirx = (this.target.x - this.x);
		var diry =  (this.target.y - this.y);

		var hyp = Math.sqrt(dirx*dirx + diry*diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
		if (hyp < 5) {
			this.target = null;
		}
	}
	this.x += this.xv;
	this.y += this.yv;
};