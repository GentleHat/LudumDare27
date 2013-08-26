
var score = new Score();

function Score() {
	this.spidersKilled = 0;
	this.spidersAlive = 0;
	this.currentWave = 0;
	this.waveTime = 10;
	this.buildTime = 0;
	this.building = false;
	this.totalTime = 0;
	this.lastUpdate = 0;
	this.difficulty = 1;
}

Score.prototype.startNextWave = function() {
	this.currentWave++;
	this.building = false;

	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof EnemySpawn) {
			var enemyToSpawn = 1;
			var wave = this.currentWave % 12;
			if (this.currentWave > 12) wave++;
			if (wave <= 3) enemyToSpawn = 1;
			else if (wave <= 6) enemyToSpawn = 2;
			else if (wave <= 8) enemyToSpawn = 3;
			else if (wave <= 10) enemyToSpawn = 4;
			else if (wave <= 12) enemyToSpawn = 5;
			else if (wave >= 13) {
				this.increaseDifficulty();
				enemyToSpawn = 1;
			}
			entities[i].enemyType = enemies[enemyToSpawn - 1];
			var spawnAmount = 10;
			var spawnRate = 1;
			switch (wave) {
				case 1: spawnAmount = 10; spawnRate = 1; break;
				case 2: spawnAmount = 20; spawnRate = 0.9; break;
				case 3: spawnAmount = 25; spawnRate = 0.8; break;
				case 4: spawnAmount = 10; spawnRate = 1; break;
				case 5: spawnAmount = 15; spawnRate = 1; break;
				case 6: spawnAmount = 20; spawnRate = 1; break;
				case 7: spawnAmount = 10; spawnRate = 1.1; break;
				case 8: spawnAmount = 12; spawnRate = 1.1; break;
				case 9: spawnAmount = 10; spawnRate = 1.2; break;
				case 10: spawnAmount = 15; spawnRate = 1.2; break;
				case 11: spawnAmount = 12; spawnRate = 1.4; break;
				case 12: spawnAmount = 15; spawnRate = 1.4; break;
				case 13: spawnAmount = 5; spawnRate = 2; break;
			}
			entities[i].toSpawn = spawnAmount;
			entities[i].spawnRate = spawnRate;
		}
	}
};

Score.prototype.increaseDifficulty = function() {
	this.difficulty++;
	for (var i=0;i<enemies.length;i++) {
		enemies[i].speed *= 1.25;
		enemies[i].health *= 2.5;
		enemies[i].reward = Math.floor(entities[i].reward * 0.8);
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

