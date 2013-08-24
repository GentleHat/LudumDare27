//player.js

var player = new Player();

function Player() {
	this.x = 0;
	this.y = 0;
	this.selection = null;
	this.lives = 20;
}

Player.prototype.update = function() {

};

Player.prototype.render = function() {

	ctx.strokeStyle = "#00F";
	var x = mouse.x - (mouse.x % 32);
	var y = mouse.y - (mouse.y % 32);
	ctx.strokeRect(x, y, 32, 32);
	ctx.stroke();

	//Ignore this code, for screen scrolling games
	if (player.x > 300 && player.x + 300 < screen.maxXOffset * -1) screen.xOffset = -(player.x-300);
	if (player.y > 225 && player.y + 225 < screen.maxYOffset * -1) screen.yOffset = -(player.y-225);

	if (screen.xOffset > 0) screen.xOffset = 0;
	if (screen.yOffset > 0) screen.yOffset = 0;
};

Player.prototype.click = function(x,y) {
	x = x - (x % 32);
	y = y - (y % 32);
	if (this.selection !== null) {
		new Tower(this.selection, x,y);
	}
	this.selection = null;
};

Player.prototype.loseLife = function() {
	this.lives--;
	if (this.lives <= 0) {
		//Game over
	}
};