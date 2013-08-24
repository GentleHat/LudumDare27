
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
	if (getCurrentMs() > this.lastFire + getCurrentMs()) {

		this.lastFire = getCurrentMs();
	}
};