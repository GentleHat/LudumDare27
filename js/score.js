
var score = new Score();

function Score() {
	this.spidersKilled = 0;
	this.spidersAlive = 0;
	this.currentWave = 1;
	this.waveTime = 10;
	this.buildTime = 0;
	this.totalTime = 0;
}

Score.prototype.startWave = function() {

};