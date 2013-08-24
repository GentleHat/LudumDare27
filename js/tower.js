
function Tower(type, x,y) {
	this.x = x;
	this.y = y;
	this.type = "";
	this.fireRate = 0.5;
	this.lastFire = 0;
	this.target = null;
	this.img = new Image();
	this.img.src = "";
	entities.push(this);
}


Tower.prototype.render = function() {
	ctx.fillStyle = "#00F";
	ctx.fillRect(this.x,this.y,32,32);
};

Tower.prototype.update = function() {
	if ((this.lastFire - getCurrentMs()) < -this.fireRate) {
		var closestEnemy = null;
		for (var i=0;i<entities.length;i++) {
			if (entities[i] instanceof Enemy) {
				if (closestEnemy === null) closestEnemy = entities[i];
				else if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < new Point(this.x,this.y).getDist(new Point(closestEnemy.x,closestEnemy.y))) {
					closestEnemy = entities[i];
				}
			}
		}
		new Projectile('water',this.x,this.y,closestEnemy);
		this.lastFire = getCurrentMs();
	}
};