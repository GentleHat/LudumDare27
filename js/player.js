//player.js

var player = new Player();

function Player() {
	this.x = 0;
	this.y = 0;
	this.selection = null;
	this.lives = 20;
	this.money = 400;
	this.previewImage = new Image();
	this.previewImage.src = "images/water_tower.png";
}

Player.prototype.update = function() {

};

Player.prototype.render = function() {

	ctx.strokeStyle = "#0F0";
	var x = mouse.x - (mouse.x % 32);
	var y = mouse.y - (mouse.y % 32);
	ctx.strokeRect(x, y, 32, 32);

	if (this.selection !== null && this.previewImage.src.length > 3) {
		//Draw a translucent version of the selected tower so they know what they're placing
		ctx.save();
		ctx.globalAlpha = 0.5;
		this.previewImage.src = "images/"+this.selection.name+"_tower.png";
		ctx.drawImage(this.previewImage, mouse.x - (mouse.x % 32), mouse.y - (mouse.y % 32));
		ctx.restore();

		ctx.beginPath();
		ctx.arc(mouse.x - (mouse.x % 32) + 16, mouse.y - (mouse.y % 32) + 16, this.selection.range-15, 0, 2 * Math.PI, false);
		ctx.stroke();
	}


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
		var canPlace = true;
		for (var x2=0;x2<game.level.width;x2++) {
			for (var y2=0;y2<game.level.height;y2++) {
				if (game.level.tiles[x2][y2].solid) {
					if (x == x2 * 32) {
						if (y == y2 * 32) {
							canPlace = false;
						}
					}
				}
			}
		}
		for (var i=0;i<entities.length;i++) {
			if (entities[i] instanceof Tower) {
				if (entities[i].x - 16 == x && entities[i].y - 16 == y) {
					canPlace = false;
				}
			}
		}
		if (canPlace) {
			shop.buyTower(this.selection,x,y);
			this.selection = null;
		}
	}
};

Player.prototype.loseLife = function() {
	this.lives--;
	loselifesound.play();
	if (this.lives <= 0) {
		game.gameOver();
	}
};