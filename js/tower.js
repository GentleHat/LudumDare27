
function Tower(type, x,y) {
	this.x = x+16;
	this.y = y+16;
	this.type = type;
	this.fireRate = type.rate;
	this.lastFire = 0;
	this.target = null;
	this.range = type.range;
	this.img = new Image();
	this.img.src = "images/"+ this.type.name + "_tower.png";
	this.layer = 1;
	this.target = null;
	entities.push(this);
}


Tower.prototype.render = function() {
	//ctx.fillStyle = "#00F";
	//ctx.fillRect(this.x-16,this.y-16,32,32);
	ctx.drawImage(this.img,this.x-16,this.y-16);
	if (mouse.x - (mouse.x % 32) == this.x - 16 && mouse.y - (mouse.y % 32) == this.y - 16) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.range-16, 0, 2 * Math.PI, false);
		ctx.stroke();
	}
};

Tower.prototype.getNewTarget = function() {
	var closestEnemy = null;
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Enemy) {
			if (closestEnemy === null) {
				if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < this.range) {
					closestEnemy = entities[i];
					continue;
				}
			}
			else {
				if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < new Point(this.x,this.y).getDist(new Point(closestEnemy.x,closestEnemy.y))) {
					if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < this.range) {
						closestEnemy = entities[i];
					}
				}
			}
		}
	}
	this.target = closestEnemy;
};

Tower.prototype.update = function() {
	if ((this.lastFire - getCurrentMs()) < -this.fireRate) {
		if (this.target !== null) {
			if (this.target.health <= 0) {
				this.getNewTarget();
				return;
			}
			if (new Point(this.x,this.y).getDist(new Point(this.target.x,this.target.y)) > this.range) {
				this.getNewTarget();
				return;
			}
			new Projectile(this.type,this.x,this.y,this.target);

			
		}
		else {
			this.getNewTarget();
		}
		this.lastFire = getCurrentMs();
	}
};
