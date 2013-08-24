
function Enemy(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.type = "spider";
	this.rotation = 0;
	this.img = new Image();
	this.img.src = "images/spider2.png";
	this.boundingBox = new BoundingBox(this.x,this.y,this.width/2,this.height/2);
	this.target = null;
	this.speed = 1;
	this.currentNode = 1;
	this.xv = 0;
	this.yv = 0;
	this.scale = 1;
	this.health = 100;
	entities.push(this);
}

Enemy.prototype.render = function() {
	setImageSmoothing(true);
	if (this.target !== null) {
		this.rotation = Math.atan2(this.y+screen.yOffset-(this.height/2)-this.target.y+screen.yOffset,this.x+screen.xOffset-(this.width/2)-this.target.x+screen.xOffset)*(180 / Math.PI);
		if(this.rotation < 0) { this.rotation += 360;}
		this.rotation -= 90;
		this.rotation += (Math.random() * 4) - 2;
	}
	ctx.save();
	ctx.translate(this.x+screen.xOffset,this.y+screen.yOffset);
	ctx.rotate(degToRad(this.rotation));
	ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
	ctx.restore();
	//ctx.fillStyle = "#F00";
	//ctx.fillRect(this.x,this.y,5,5);
};

Enemy.prototype.update = function() {
	if (this.target === null) this.target = new Point(game.level.nodes[this.currentNode].x,game.level.nodes[this.currentNode].y);
	var distToNode = new Point(this.x,this.y).getDist(new Point(game.level.nodes[this.currentNode].x,game.level.nodes[this.currentNode].y));
	if (distToNode < 20) {
		//this.target = new Point(game.level.nodes[this.currentNode].x+randomInt(-50,50),game.level.nodes[this.currentNode].y+randomInt(-50,50));
		
		if (game.level.nodes[this.currentNode+1] !== undefined) {
			this.currentNode++;
		}
		this.target = null;
	}
	this.xv = 0;
	this.yv = 0;
	this.boundingBox.update(this.x-(this.width/4),this.y-(this.height/4));
	if (this.target !== null) {
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
	this.x += this.xv;
	this.y += this.yv;
};

Enemy.prototype.kill = function() {
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Projectile) {
			if (entities[i].target == this) {
				entities[i].target = new Point(this.x,this.y);
			}
		}
	}
	deleteEntity(this);
};

Enemy.prototype.takeDamage = function(damage) {
	this.health -= damage;
	if (this.health <= 0) this.kill();
};