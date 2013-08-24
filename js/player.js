//player.js

var player = new Player();

function Player() {
	entities.push(this);
	this.x = 0;
	this.y = 0;
}

Player.prototype.update = function() {
};

Player.prototype.render = function() {
	if (player.x > 300 && player.x + 300 < screen.maxXOffset * -1) screen.xOffset = -(player.x-300);
	if (player.y > 225 && player.y + 225 < screen.maxYOffset * -1) screen.yOffset = -(player.y-225);

	if (screen.xOffset > 0) screen.xOffset = 0;
	if (screen.yOffset > 0) screen.yOffset = 0;
};



Player.prototype.use = function() {
	
};

Player.prototype.move = function(xm,ym) {
	
};