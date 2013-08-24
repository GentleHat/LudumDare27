function Base(x,y) {
	this.x = x;
	this.y = y;
	this.boundingBox = new BoundingBox(this.x,this.y,32,32);
	entities.push(this);
}

Base.prototype.render = function() {
	
};

Base.prototype.update = function() {
	//Check if colliding with any mobs
};