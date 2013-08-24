AudioFX=function(){var f="0.4.0";var c=false,e=document.createElement("audio"),a=function(j){var i=e.canPlayType(j);return(i==="probably")||(i==="maybe")};if(e&&e.canPlayType){c={ogg:a('audio/ogg; codecs="vorbis"'),mp3:a("audio/mpeg;"),m4a:a("audio/x-m4a;")||a("audio/aac;"),wav:a('audio/wav; codecs="1"'),loop:(typeof e.loop==="boolean")}}var d=function(m,i,l){var k=document.createElement("audio");if(l){var j=function(){k.removeEventListener("canplay",j,false);l()};k.addEventListener("canplay",j,false)}if(i.loop&&!c.loop){k.addEventListener("ended",function(){k.currentTime=0;k.play()},false)}k.volume=i.volume||0.1;k.autoplay=i.autoplay;k.loop=i.loop;k.src=m;return k};var h=function(i){for(var j=0;j<i.length;j++){if(c&&c[i[j]]){return i[j]}}};var g=function(i){var k,j;for(k=0;k<i.length;k++){j=i[k];if(j.paused||j.ended){return j}}};var b=function(o,j,m){j=j||{};var i=j.formats||[],l=h(i),k=[];o=o+(l?"."+l:"");if(c){for(var p=0;p<(j.pool||1);p++){k.push(d(o,j,p==0?m:null))}}else{m()}return{audio:(k.length==1?k[0]:k),play:function(){var n=g(k);if(n){n.play()}},stop:function(){var r,q;for(r=0;r<k.length;r++){q=k[r];q.pause();q.currentTime=0}}}};b.version=f;b.supported=c;return b}();function Base(x,y) {
	this.x = x;
	this.y = y;
	this.boundingBox = new BoundingBox(this.x,this.y,32,32);
	entities.push(this);
}

Base.prototype.render = function() {

};

Base.prototype.update = function() {
	//Check if colliding with any mobs
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Enemy) {
			if (this.boundingBox.isColliding(entities[i])) {
				player.loseLife();
				entities[i].kill();
			}
		}
	}
};//boundingbox.js

function BoundingBox(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

BoundingBox.prototype.update = function(x,y) {
	this.x = x;
	this.y = y;
	//ctx.fillRect(this.x,this.y,this.width,this.height);
};

BoundingBox.prototype.setWidth = function(width) {
	this.width = width;
};

BoundingBox.prototype.setHeight = function(height) {
	this.height = height;
};

BoundingBox.prototype.wouldCollide = function(x,y,e) {
	var wouldCollide = false;
	this.x += x;
	this.y += y;
	if (this.isColliding(e)) wouldCollide = true;
	this.x -= x;
	this.y -= y;
	return wouldCollide;
};

BoundingBox.prototype.isColliding = function(e) {
	if (e === undefined) return false;
	if (this.x + this.width > e.boundingBox.x && this.x < e.boundingBox.x + e.boundingBox.width) {
		if (this.y + this.height > e.boundingBox.y && this.y < e.boundingBox.y + e.boundingBox.height) {
			return true;
		}
	}
	return false;
};

BoundingBox.prototype.getDistBetween = function(e) {
	var point1a = this.x + (this.width/2);
	var point1b = this.y + (this.height/2);
	var point1 = new Point(point1a,point1b);
	var point2a = e.boundingBox.x+(e.boundingBox.width/2);
	var point2b = e.boundingBox.y+(e.boundingBox.height/2);
	var point2 = new Point(point2a,point2b);
	return point1.getDist(point2);

}

BoundingBox.prototype.isPointIn = function(x,y) {
	if (this.x === undefined || this.y === undefined || this.x === null || this.y === null) return -1;
	if (this.x + this.width > x && this.x < x) {
		if (this.y + this.height > y && this.y < y) {
			return true;
		}
	}
	return false;
};

BoundingBox.prototype.destroy = function() {
	//Remove this bounding box?
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
};
function Enemy(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.type = "spider";
	this.rotation = 0;
	this.img = new Image();
	this.img.src = "images/spider2.png";
	this.boundingBox = new BoundingBox(this.x,this.y,this.width/2,this.height/2);
	this.target = new Point(this.x,this.y);
	this.speed = 1;
	this.currentNode = 1;
	this.xv = 0;
	this.yv = 0;
	this.scale = 1;
	this.health = 100;
	entities.push(this);
}

Enemy.prototype.render = function() {
	setImageSmoothing(true);
	if (this.target !== null) {
		this.rotation = Math.atan2(this.y+screen.yOffset-(this.height/2)-this.target.y+screen.yOffset,this.x+screen.xOffset-(this.width/2)-this.target.x+screen.xOffset)*(180 / Math.PI);
		if(this.rotation < 0) { this.rotation += 360;}
		this.rotation -= 90;
		this.rotation += (Math.random() * 4) - 2;
	}
	ctx.save();
	ctx.translate(this.x+screen.xOffset,this.y+screen.yOffset);
	ctx.rotate(degToRad(this.rotation));
	ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
	ctx.restore();
	//ctx.fillStyle = "#F00";
	//ctx.fillRect(this.x,this.y,5,5);
};

Enemy.prototype.update = function() {

	var distToNode = new Point(this.x,this.y).getDist(new Point(game.level.nodes[this.currentNode].x,game.level.nodes[this.currentNode].y));
	if (distToNode > 40) {
		this.target = new Point(game.level.nodes[this.currentNode].x,game.level.nodes[this.currentNode].y);
	} else {
		if (game.level.nodes[this.currentNode+1] !== undefined) {
			this.currentNode++;
		}
	}
	this.xv = 0;
	this.yv = 0;
	this.boundingBox.update(this.x-(this.width/4),this.y-(this.height/4));
	if (this.target !== null) {
		var dirx = (this.target.x - this.x);
		var diry =  (this.target.y - this.y);

		var hyp = Math.sqrt(dirx*dirx + diry*diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
		if (hyp < 35) {
			this.target = null;
		}
	}
	this.x += this.xv;
	this.y += this.yv;
};

Enemy.prototype.kill = function() {
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Projectile) {
			if (entities[i].target == this) {
				entities[i].target = new Point(this.x,this.y);
			}
		}
	}
	entities.clean(this);
};

Enemy.prototype.takeDamage = function(damage) {
	this.health -= damage;
	if (this.health <= 0) this.kill();
};Function.prototype.inherit = function(parent) {
  this.prototype = Object.create(parent.prototype);
};

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  //return this;
};


function getCurrentMs() {
	var date = new Date();
	var ms = date.getTime() / 1000;
	return ms;
}

function degToRad(angle) {
  return ((angle*Math.PI) / 180);
}

function radToDeg(angle) {
  return ((angle*180) / Math.PI);
}

function setImageSmoothing(setting) {
  ctx.imageSmoothingEnabled = setting;
  ctx.webkitImageSmoothingEnabled = setting;
  ctx.mozImageSmoothingEnabled = setting;
}

function randomFloat(low, high) {
  var rand = (Math.random() * high) + low;
  return rand;
}

function randomInt(low, high) {
  var rand = (Math.random() * high) + low;
  return Math.floor(rand);
}
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
	for (var i=1;i<100;i++) {
		new Enemy(randomInt(88,500),randomInt(66,500));
	}
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
//input.js

/* Interactivity */

$(window).load(function() {
	window.addEventListener('keydown', handleKeyDown, true);
	window.addEventListener('keyup', handleKeyUp, true);
});

var keys = [];
function Mouse() {
	this.x = 0;
	this.y = 0;
	this.down = false;
}
var mouse = new Mouse();
//Disable browsers usual function of scrolling with up/down arrow keys
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=32}

function handleKeyDown(evt) {
	keys[evt.keyCode] = true;
}
function handleKeyUp(evt) {
	keys[evt.keyCode] = false;
}
$('canvas').bind('contextmenu', function(e){
	rightClick(e);
    return false; //Disable usual context menu behaviour
});
$( "canvas" ).mousedown(function(event){
    event.preventDefault();
    mouse.down = true;
});
$( "canvas" ).mouseup(function(event){
    mouse.down = false;
});
//Function for key bindings
function handleInteractions() {
	if (keys[38] || keys[87]) { //Up arrow
		player.move(0,-2);
	}
	if (keys[37] || keys[65]) { //Left Arrow
		player.move(-2,0);
	}
	if (keys[39] || keys[68]) { //right arrow
		player.move(2,0);
	}
	if (keys [40] || keys[83]) { //down arrow
		player.move(0,2);
	}
	if (keys [32]) { //spacebar
		
	}
	if (keys[69]) { //e
		player.use();
	}
	if (keys[70]) { //f
		
	}
	if (keys[71]) { //g
		
	}
	if (keys[82]) { //r
		
	}

}

//Mouse movement
$('#canvas').mousemove(function(e){
    mouse.x = e.pageX - this.offsetLeft,
    mouse.y = e.pageY - this.offsetTop;
    if (screen !== null) {
    	mouse.x += screen.xOffset;
		mouse.y += screen.yOffset;
    }
});

function rightClick(e) {
	
}

//Mouse clicks hook
$("#canvas").click(function(e){
	player.click(mouse.x,mouse.y);
});

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
				var id = tmxloader.map.layers[1].data[y][x] - 32;
				if (id < 32) this.nodes[id] = new Node(id,x*32,y*32);
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
function Node(id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
}
var particles = [];

function Particle(x,y,r,g,b,angle,speed,friction,alpha,decay,lifetime) {
	this.x = x;
	this.y = y;
	this.lifeTime = lifetime;
	this.timeAlive = 0;
	this.r = r;
	this.g = g;
	this.b = b;
	this.coordinates = [];
	this.coordinateCount = 10;
	this.angle = angle;
	this.speed = speed;
	this.friction = friction;
	this.alpha = alpha;
	this.decay = decay;
	while (this.coordinateCount--) {
		this.coordinates.push([this.x,this.y]);
	}
	particles.push(this);
}

Particle.prototype.render = function() {
	//ctx.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x+screen.xOffset, this.y+screen.yOffset );
	ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ');';

	ctx.beginPath();
	ctx.arc(this.x+screen.xOffset,this.y+screen.yOffset, 9, 0, 2 * Math.PI, false);
	//ctx.fillRect(this.x+screen.xOffset,this.y+screen.yOffset, 1,1);
	ctx.fill();
};

Particle.prototype.update = function() {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed;
	this.alpha *= this.decay;
	this.speed *= this.friction;
	this.timeAlive++;
	if (this.timeAlive >= this.lifeTime) {
		deleteParticle(this);
	}
};

function createWaterParticles(x,y) {
	var particleCount = randomInt(5,15);
	while( particleCount-- ) {
		particles.push( new Particle( x,y,0,180,200,randomFloat(0, Math.PI * 2),randomFloat(0.3,2.5),0.8,0.9, 0.9, 30 ) );
	}
}

function renderParticles() {
	for (var i=0;i<particles.length;i++) {
		particles[i].render();
		particles[i].update();
	}
}

function deleteParticle(p) {
	particles.clean(p);
}
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
};//point.js

function Point(x,y) {
	this.x = x;
	this.y = y;
}

Point.prototype.getDist = function(point) {
	var xs = 0;
	var ys = 0;

	xs = point.x - this.x;
	xs = xs * xs;

	ys = point.y - this.y;
	ys = ys * ys;

	return Math.sqrt( xs + ys );
};

function Projectile(type,x,y,target) {
	this.type = type;
	this.x = x;
	this.y = y;
	this.xv = 0;
	this.yv = 0;
	this.width = 16;
	this.height = 25;
	this.target = target;
	this.boundingBox = new BoundingBox(this.x,this.y,this.width,this.height);
	this.img = new Image();
	this.img.src = "images/water.png";
	this.scale = 1;
	this.speed = 2;
	this.power = 10;
	entities.push(this);
}

Projectile.prototype.render = function() {
	if (this.target !== null) {
		this.rotation = Math.atan2(this.y+screen.yOffset-(this.height/2)-this.target.y+screen.yOffset,this.x+screen.xOffset-(this.width/2)-this.target.x+screen.xOffset)*(180 / Math.PI);
		if (this.rotation < 0) { this.rotation += 360;}
		this.rotation -= 270;
	}
	ctx.save();
	ctx.translate(this.x+screen.xOffset,this.y+screen.yOffset);
	ctx.rotate(degToRad(this.rotation));
	ctx.drawImage(this.img, (-(this.img.width/2)), (-(this.img.height/2)), this.img.width*this.scale,this.img.height*this.scale);
	ctx.restore();
};

Projectile.prototype.update = function() {
	for (var i=0;i<entities.length;i++) {
		if (entities[i] instanceof Enemy) {
			if (this.boundingBox.isColliding(entities[i])) {
				entities[i].takeDamage(this.power);
				this.kill();
				createWaterParticles(this.x,this.y);
			}
		}
	}

	this.boundingBox.update(this.x-(this.width/2),this.y-(this.height/2));
	if (this.target === null) {
		this.kill();
	}
	if (this.target instanceof Enemy) { //Guided
		var dirx = (this.target.x - this.x);
		var diry =  (this.target.y - this.y);

		var hyp = Math.sqrt(dirx*dirx + diry*diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
		if (hyp < 35) {
			//this.target = null;
		}
	}
	else if (this.target instanceof Point) {
		var dirx = (this.target.x - this.x);
		var diry =  (this.target.y - this.y);

		var hyp = Math.sqrt(dirx*dirx + diry*diry);
		dirx /= hyp;
		diry /= hyp;
		this.xv = dirx * this.speed;
		this.yv = diry * this.speed;
		if (hyp < 15) {
			this.target = null;
		}
	}
	else {
		this.kill();
	}
	this.x += this.xv;
	this.y += this.yv;
};

Projectile.prototype.kill = function() {
	entities.clean(this);
};
function Screen() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.width = 600;
	this.height = 450;
	this.maxXOffset = game.level.width * 32 * -1;
	this.maxYOffset = game.level.height * 32 * -1;
}

Screen.prototype.scroll = function() {
	this.move(0,0);
};

Screen.prototype.move = function(x,y) {
	if (x < 0) {
		if (this.xOffset + x > this.maxXOffset + this.width) {
			this.xOffset += x;
		}
	}
	else if (x > 0) {
		if (this.xOffset + x < 0) {
			this.xOffset += x;
		}
	}
	if (y < 0) {
		if (this.yOffset + y > this.maxYOffset + this.height) {
			this.yOffset += y;
		}
	}
	else if (y > 0) {
		if (this.yOffset + y < 0) {
			this.yOffset += y;
		}
	}
};

Screen.prototype.setOffset = function(x,y) {
	if (x > this.maxXOffset) x = this.maxXOffset;
	if (y > this.maxYOffset) y = this.maxYOffset;
	if (x > 0) x = 0;
	if (y > 0) y = 0;
	this.xOffset = x;
	this.yOffset = y;
};
$("#shop").append("<div class='tower'><img class='watertower' src='images/water.png'></div>");


$('.tower').click(function() {
	player.selection = 'water';
});

var watertower = {
	'name': 'Water Tower',
	'cost': 100
};//Using audiofx.min.js

if (AudioFX.supported) {
	//var shufflesound = AudioFX('sounds/cardshuffle', { formats: ['wav'], pool:2 });
	var sound = AudioFX('sounds/soundfilename', { formats: ['wav'], pool:8, volume:0.3});
}
//tile.js

var r=0,g=0,b=0;
var tileSheet = new Image();
tileSheet.src = "images/tilesheet.png";

function Tile(x, y, id) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.boundingBox = new BoundingBox(this.x,this.y,32,32);
	this.color = '#060';
	if (this.id <= 16) this.solid = true;
}

Tile.prototype.setColor = function(color) {
	this.color = color;
};

Tile.prototype.render = function() {
	var xOffset = ((this.id - 1) % 8) * 32;
	var yOffset = Math.floor(((this.id - 1) / 8)) * 32;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x+screen.xOffset,this.y+screen.yOffset,32,32);
	ctx.drawImage(tileSheet,xOffset,yOffset,32,32,this.x+screen.xOffset,this.y+screen.yOffset,32,32);
};

function isSolidTile(x,y) {
	if (game.level.tiles[x][y] === undefined) return -1;
	if (game.level.tiles[x][y] === null) return -1;
	if (game.level.tiles[x][y].solid) return true;
	else return false;
}
/**
 * tmx-loader.js  - A Javascript loader for the TMX File Format.
 *
 * 	Currenty Supports: 
 *						- Map
 *						- Layers
 *						- Tile Data (CSV only)
 *
 * 	Depends on: Jquery for file loading and XML parsing
 *
 */
 
var tmxloader = {}

tmxloader.trim  = function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

tmxloader.Map = function(width,height,tileWidth,tileHeight,layers,properties){
	this.width = width;
	this.height = height;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.tilesets = new Array();
	this.layers = new Array(layers);
	this.properties = properties;
}

tmxloader.Tileset = function(firstgid, name, tileWidth,tileHeight,src,width,height,properties){
	this.firstGid = firstgid;
	this.name = name;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.src = src;
	this.width = width;
	this.height = height;
	this.properties = properties;
}

tmxloader.Layer = function(layerName,width,height,properties){
	this.name = layerName;
	this.width = width;
	this.height = height;
	this.data  = new Array(height);
	this.properties = properties;
	
	for(var d = 0;d < height;++d){
		this.data[d] = new Array(width);
	}
	
	this.loadCSV = function(data){
		var layerData = tmxloader.trim(data).split('\n');		
		for(var x = 0; x <layerData.length; ++x){
			var line = tmxloader.trim(layerData[x]);
			var entries = line.split(',');
			for(var e = 0;e <width;++e){
				this.data[x][e] = entries[e];
			}
		}
	}	
}

tmxloader.Object = function(objectname, type, x, y, width, height,properties){
	this.name = objectname;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.type  = type;
	this.properties = properties;
}


tmxloader.ObjectGroup = function(groupname,width,height,properties){
	this.name = groupname;
	this.width = width;
	this.height = height;
	this.objects  = new Array();
	this.properties = properties;
}

tmxloader.parseProperties = function($xml){
     var properties = new Array();
	 $xml.find('properties:first ').each(function(){	
	 	$xml.find('property').each(function(){	
	 		console.log("Processing Property: " + $(this).attr("name") + " =  "+  $(this).attr("value"));
	 		properties[''+$(this).attr("name")+''] = $(this).attr("value");
	 	});
	 });
	 return properties;
}

tmxloader.load = function(url){

		var result;
		 $.ajax({
		    url: url,
		    type: 'get',
		    dataType: 'html',
		    async: false,
		    success: function(data) {
		        result = data;
		    } 
		 });

		 var xmlDoc = jQuery.parseXML( result );
		 $xml = $(xmlDoc);
		 $version = $xml.find("map").attr("version");
		 console.log('Parsing...' + $version);
		 $width = $xml.find("map").attr("width");
		 $height = $xml.find("map").attr("height");
		 
		 $tilewidth = $xml.find("map").attr("tilewidth");
		 $tileheight = $xml.find("map").attr("tileheight");
		 var properties = tmxloader.parseProperties($xml);
		 tmxloader.map = new tmxloader.Map($width,$height,$tilewidth,$tileheight, $xml.find('layer').length,properties);
		 
		 console.log('Creating Map...' +  tmxloader.map.width + " x " + tmxloader.map.height + " Tiles: " +  tmxloader.map.tileWidth + " x " +  tmxloader.map.tileHeight);
		 
		 console.log("Found " + $xml.find('layer').length + " Layers");
		 var layerCount = 0;
		 $xml.find('layer').each(function(){			
			console.log("Processing Layer: " + $(this).attr("name"));
			$data = $(this).find("data");
			
			$lwidth = $(this).attr("width");
		 	$lheight = $(this).attr("height");
		 	var properties = tmxloader.parseProperties($(this));
		 	tmxloader.map.layers[layerCount] = new tmxloader.Layer($(this).attr("name"),$lwidth,$lheight,properties);
		
			if($data.attr("encoding") =="csv"){
				console.log("Processing CSV");
				var eData = $data.text();
				tmxloader.map.layers[layerCount].loadCSV(eData);
				
			} else {
				console.log("Unsupported Encoding Scheme");
			}
			
			
			
			++layerCount;
		
		 });
		 
		$xml.find('tileset').each(function(){	
			 $firstgid = $(this).attr("firstgid");
			 $name = $(this).attr("name");
			 $tilewidth = $(this).attr("tilewidth");
			 $tileheight = $(this).attr("tileheight");
			 
				$image =  $(this).find('image');
				$src = $image.attr("source");
				$width = $image .attr("width");
			 	$height = $image .attr("height"); 
			 	var properties = tmxloader.parseProperties($(this));
			 tmxloader.map.tilesets.push(new tmxloader.Tileset($firstgid,$name,$tilewidth,$tileheight,$src,$width,$height,properties));
		 });
		 
		 $xml.find('objectgroup').each(function(){	
		 
		 		

			$lwidth = $(this).attr("width");
		 	$lheight = $(this).attr("height");
		 	$numobjects =  $(this).find('object').length;
		 	tmxloader.map.objectgroup = new Object();
		 	console.log("Processing Object Group: " + $(this).attr("name") + " with " + $numobjects + " Objects");
		 	var properties = tmxloader.parseProperties($(this));
		 	tmxloader.map.objectgroup[''+$(this).attr("name")+''] = new tmxloader.ObjectGroup($(this).attr("name"),$lwidth,$lheight,properties);
		
			$objectGroupName = $(this).attr("name");
				 $xml.find('object').each(function(){
				 	$objectname =  $(this).attr("name");
				 	$objecttype =  $(this).attr("type");
				 	$objectx = $(this).attr("x");
				 	$objecty = $(this).attr("y");
				 	$objectwidth = $(this).attr("width");
				 	$objectheight = $(this).attr("height");
				 	console.log("Processing Object: " + $objectname);
				 	var properties = tmxloader.parseProperties($(this));
				 	tmxloader.map.objectgroup[''+$objectGroupName+''].objects.push(new tmxloader.Object($objectname, $objecttype , $objectx, $objecty, $objectwidth,  $objectheight,properties) );
				 });

		 } );
		 
}	

function Tower(type, x,y) {
	this.x = x;
	this.y = y;
	this.type = "";
	this.fireRate = 0.5;
	this.lastFire = 0;
	this.target = null;
	this.range = 300;
	this.img = new Image();
	this.img.src = "";
	entities.push(this);
}


Tower.prototype.render = function() {
	ctx.fillStyle = "#00F";
	ctx.fillRect(this.x,this.y,32,32);
};

Tower.prototype.update = function() {
	if ((this.lastFire - getCurrentMs()) < -this.fireRate) {
		var closestEnemy = null;
		for (var i=0;i<entities.length;i++) {
			if (entities[i] instanceof Enemy) {
				closestEnemy = { x:9999,y:99999};
				if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < new Point(this.x,this.y).getDist(new Point(closestEnemy.x,closestEnemy.y))) {
					if (new Point(this.x,this.y).getDist(new Point(entities[i].x,entities[i].y)) < this.range) {
						closestEnemy = entities[i];
					}
				}
			}
		}
		if (closestEnemy instanceof Enemy) {
			new Projectile('water',this.x,this.y,closestEnemy);
			this.lastFire = getCurrentMs();
		}
	}
};var ui = new UI();

function UI() {

}

UI.prototype.draw = function() {
	ctx.textAlign = 'center';

	ctx.font = 'normal 20pt Calibri';
	ctx.fillStyle = "#FFF";

};

UI.prototype.handleInput = function() {

};