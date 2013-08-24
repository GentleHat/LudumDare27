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
				switch(tmxloader.map.layers[1].data[y][x] - 32) {
					case 1: this.nodes[1] = new Node(1, x*32,y*32); break;
					case 2: this.nodes[2] = new Node(2, x*32,y*32); break;
					case 3: this.nodes[3] = new Node(3, x*32,y*32); break;
					case 4: this.nodes[4] = new Node(4, x*32,y*32); break;
					case 5: this.nodes[5] = new Node(5, x*32,y*32); break;
				}
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