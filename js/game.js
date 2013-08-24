
var canvas = null;
var ctx = null;



//Draw entire buffer onto main canvas: ctx.drawImage(canvasBuffer, 0, 0);

/* Loading */

var game = null;
var entities = [];
var player = null;
var screen = null;

//HTML onLoad event - Loading the game
$(window).load(function() {
	canvas = document.getElementById('canvas');
	canvas.width = 576;
	canvas.height = 448;
	//check whether browser supports getting canvas context
	if (canvas && canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.fillStyle="#000";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		//ctx.webkitImageSmoothingEnabled = false; //For pixel art scaling
	}
	game = new Game();
	game.start();
	loop();
});

function Game() {
	this.level = null;
	this.currentLevel = 1;
}
Game.prototype.start = function() {
	this.level = new Level(this.currentLevel);
	this.level.fadeIn();
	this.inGame = true;
	screen = new Screen();
};
Game.prototype.end = function() {
	this.level = null;
	entities = [];
	player = new Player(); //Has to be after clearing entities as we're putting the player in there!
	ui = new UI();
};
Game.prototype.changeLevel = function() {
	this.inGame = false;
	//Clear the entities array - Keep the player and player objects.
	for (var i=0;i<entities.length;i++) {
		if (entities[i] !== player) {
			deleteEntity(this);
		}
	}
	this.currentLevel++;
	this.level = new Level(1);
	screen = new Screen();
	this.inGame = true;
	this.level.fadeIn();
};
Game.prototype.gameOver = function() {
	this.inGame = false;
	this.level.fadeOut();
	setTimeout("game.end();",3000);
};

/* Game Loop */
var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;
var frames = 0;

function loop()
{
	requestAnimationFrame(loop);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
		then = now - (delta % interval);
		draw();
		update();
    }
}

function draw() {
	frames++;
	if (game.inMenu) {
		game.mainMenu.render();
		return; //Don't draw the game if we're not in it yet.
	}

	// draw stuff
	renderLevel(game.level);
	screen.scroll();
	entities.sort(sortByLayer);
	for (var i=0;i<entities.length;i++) {
		if (entities[i] !== null) {
			if (!(entities[i] instanceof Player)) entities[i].render();
			if (game.inGame) entities[i].update();
		}
	}
	if (entities.length > 500) {
		for (var i=0;i<entities.length;i++) {
			entities.clean(null);
		}
	}
	if (particles.length > 500) {
		for (var i=0;i<entities.length;i++) {
			entities.clean(null);
		}
	}
	renderParticles();
    player.render();
    game.level.drawOverlay();
    ui.draw();
}

function sortByLayer(a,b) {
	if (a === null) return 1;
	if (b === null) return -1;
	if (a.layer === undefined) a.layer = 0;
	if (b.layer === undefined) b.layer = 0;
  if (a.layer < b.layer)
     return -1;
  if (a.layer > b.layer)
    return 1;
  return 0;
}

function deleteEntity(e) {
	for (var i=0;i<entities.length;i++) {
		if (entities[i] === e) {
			entities[i] = null; //For now this works. Potentially making arrays very large though, which is bad perf.
			//entities.splice(i,1);
			break;
		}
	}
}

function update() {
	handleInteractions();
}
