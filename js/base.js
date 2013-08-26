function Base(x,y) {
	this.x = x;
	this.y = y;
	this.boundingBox = new BoundingBox(this.x-32,this.y-32,32,32);
	entities.push(this);
}

Base.prototype.render = function() {

};

Base.prototype.update = function() {
	//Check if colliding with any mobs
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Enemy) {
			if (this.boundingBox.isColliding(entities[i])) {
				player.loseLife();
				new TextParticle(player.lives, this.x,this.y);
				deleteEntity(entities[i]);
			}
		}
	}
};