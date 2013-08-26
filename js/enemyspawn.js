
function EnemySpawn(x,y) {
	this.x = x;
	this.y = y;
	this.lastSpawn = 0;
	this.spawnRate = 0;
	this.toSpawn = 0;
	this.enemyType = null;
	entities.push(this);
}

EnemySpawn.prototype.render = function() {
	//Empty
};

EnemySpawn.prototype.update = function() {
	if ((this.lastSpawn - getCurrentMs()) < -this.spawnRate) {

		if (this.toSpawn > 0) {
			new Enemy(this.enemyType,this.x,this.y);
			score.spidersAlive++;
			this.lastSpawn = getCurrentMs();
			this.toSpawn--;
		}
	}
};