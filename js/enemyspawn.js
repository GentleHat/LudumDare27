
function EnemySpawn(x,y) {
	this.x = x;
	this.y = y;
	this.lastSpawn = 0;
	this.spawnRate = 1;
	entities.push(this);
}

EnemySpawn.prototype.render = function() {
	//Empty
};

EnemySpawn.prototype.update = function() {
	if ((this.lastSpawn - getCurrentMs()) < -this.spawnRate) {
		new Enemy(this.x,this.y);
		this.lastSpawn = getCurrentMs();
	}
};