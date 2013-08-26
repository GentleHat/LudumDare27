//level.js



function Level(num) {
	var fileName = 'maps/level'+num+'.tmx';
	tmxloader.load(fileName);

	this.tiles = [];
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = tmxloader.map.width;
	this.height =  tmxloader.map.height;
	this.overlayAlpha = 0;
	this.fadeStep = 0;
	this.isFading = false;
	this.nodes = [];

	for (var x=0;x<this.width;x++)
	{
		this.tiles[x] = [];
		for (var y=0;y<this.height;y++) {
			this.tiles[x][y] = new Tile(x*32,y*32,tmxloader.map.layers[0].data[y][x]);
		}
	}
	if (tmxloader.map.layers[1] !== undefined) {
		for (var x=0;x<this.width;x++)
		{
			for (var y=0;y<this.height;y++) {
				var id = tmxloader.map.layers[1].data[y][x] - 64; //Subtract offset (how many tiles are in tilesheet.png)
				if (id <= 8) this.nodes[id] = new Node(id,x*32,y*32);
				else if (id == 9) new EnemySpawn(x*32+16,y*32-16);
				else if (id == 10) new EnemySpawn(x*32+48, y*32+16);
				else if (id == 11) new EnemySpawn(x*32+16, y*32+48);
				else if (id == 12) new EnemySpawn(x*32-16,y*32+16);
				else if (id == 17) new Base(x*32,y*32);
			}
		}
	}
}


function renderLevel(level) {
	for (var x=0;x<level.width;x++) {
		for (var y=0;y<level.height;y++) {
			level.tiles[x][y].render();
		}
	}
}

Level.prototype.start = function() {
	//TODO: Fade in the level
};

Level.prototype.fadeIn = function() {
	this.overlayAlpha = 1;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeInLevel, 50);
};

Level.prototype.fadeOut = function() {
	this.overlayAlpha = 0;
	this.isFading = true;
	this.fadeStep = 0;
	setTimeout(fadeOutLevel,50);
};

function fadeInLevel() {
	if (game.level !== null) {
		game.level.overlayAlpha-= 0.030;
		game.level.fadeStep++;
		if (game.level.fadeStep < 75 && game.level.isFading) {
			setTimeout(fadeInLevel, 50);
		}
		else {
			game.level.isFading = false;
		}
	}
}

function fadeOutLevel() {
	if (game.level !== null) {
		game.level.overlayAlpha+= 0.025;
		game.level.fadeStep++;
		if (game.level.fadeStep < 75 && game.level.isFading) {
			setTimeout(fadeOutLevel, 50);
		}
		else {
			game.level.isFading = false;
		}
	}
}

Level.prototype.drawOverlay = function() {
	ctx.fillStyle = "rgba(0, 0, 0, "+this.overlayAlpha+")";
	ctx.fillRect(0,0,600,450);
};