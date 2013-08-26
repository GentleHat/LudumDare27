
var score = new Score();

function Score() {
	this.spidersKilled = 0;
	this.spidersAlive = 0;
	this.currentWave = 1;
	this.waveTime = 10;
	this.buildTime = 0;
	this.building = false;
	this.totalTime = 0;
	this.lastUpdate = 0;
}

Score.prototype.startNextWave = function() {
	this.currentWave++;
	this.building = false;
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof EnemySpawn) {
			entities[i].toSpawn = 10 * (this.currentWave * 0.5);
		}
	}
};

Score.prototype.waveEnd = function() {

};

Score.prototype.startBuildTime = function() {
	this.buildTime = 10;
	this.building = true;
};

Score.prototype.update = function() {
	if ((this.lastUpdate - getCurrentMs()) < -1) { //Updates once per second
		if (this.building) {
			this.buildTime--;
			if (this.buildTime <= 0) this.startNextWave();
		}
		else {
			for (var i=0;i<entities.length;i++) {
				if (entities[i] instanceof EnemySpawn) {
					if (entities[i].toSpawn <= 0) {
						this.startBuildTime();
					}
				}
			}
		}
		this.lastUpdate = getCurrentMs();
	}
};

