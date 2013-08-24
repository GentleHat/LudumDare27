
function Tower(type, x,y) {
	this.x = x+16;
	this.y = y+16;
	this.type = "";
	this.fireRate = 0.5;
	this.lastFire = 0;
	this.target = null;
	this.range = 300;
	this.img = new Image();
	this.img.src = "";
	entities.push(this);
}


Tower.prototype.render = function() {
	ctx.fillStyle = "#00F";
	ctx.fillRect(this.x-16,this.y-16,32,32);
};

Tower.prototype.update = function() {
	if ((this.lastFire - getCurrentMs()) < -this.fireRate) {
		var closestEnemy = null;
		for (var i=0;i<entities.length;i++) {
			if (entities[i] instanceof Enemy) {
				closestEnemy = { x:9999,y:99999};
				if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < new Point(this.x,this.y).getDist(new Point(closestEnemy.x,closestEnemy.y))) {
					if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < this.range) {
						closestEnemy = entities[i];
					}
				}
			}
		}
		if (closestEnemy instanceof Enemy) {
			new Projectile('water',this.x,this.y,closestEnemy);
			this.lastFire = getCurrentMs();
		}
	}
};