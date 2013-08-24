AudioFX=function(){var f="0.4.0";var c=false,e=document.createElement("audio"),a=function(j){var i=e.canPlayType(j);return(i==="probably")||(i==="maybe")};if(e&&e.canPlayType){c={ogg:a('audio/ogg; codecs="vorbis"'),mp3:a("audio/mpeg;"),m4a:a("audio/x-m4a;")||a("audio/aac;"),wav:a('audio/wav; codecs="1"'),loop:(typeof e.loop==="boolean")}}var d=function(m,i,l){var k=document.createElement("audio");if(l){var j=function(){k.removeEventListener("canplay",j,false);l()};k.addEventListener("canplay",j,false)}if(i.loop&&!c.loop){k.addEventListener("ended",function(){k.currentTime=0;k.play()},false)}k.volume=i.volume||0.1;k.autoplay=i.autoplay;k.loop=i.loop;k.src=m;return k};var h=function(i){for(var j=0;j<i.length;j++){if(c&&c[i[j]]){return i[j]}}};var g=function(i){var k,j;for(k=0;k<i.length;k++){j=i[k];if(j.paused||j.ended){return j}}};var b=function(o,j,m){j=j||{};var i=j.formats||[],l=h(i),k=[];o=o+(l?"."+l:"");if(c){for(var p=0;p<(j.pool||1);p++){k.push(d(o,j,p==0?m:null))}}else{m()}return{audio:(k.length==1?k[0]:k),play:function(){var n=g(k);if(n){n.play()}},stop:function(){var r,q;for(r=0;r<k.length;r++){q=k[r];q.pause();q.currentTime=0}}}};b.version=f;b.supported=c;return b}();//boundingbox.js

function BoundingBox(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

BoundingBox.prototype.update = function(x,y) {
	this.x = x;
	this.y = y;
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
	canvas.width = 600;
	canvas.height = 450;
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
    //player.render();
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

	for (var x=0;x<this.width;x++)
	{
		this.tiles[x] = [];
		for (var y=0;y<this.height;y++) {
			this.tiles[x][y] = new Tile(x*32,y*32,tmxloader.map.layers[0].data[y][x]);
		}
	}

	for (var x=0;x<this.width;x++)
	{
		for (var y=0;y<this.height;y++) {
			switch(tmxloader.map.layers[1].data[y][x] - 32) {
				case 1: break; //Code to execute for tile 1, etc
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
	if (new Point(this.x,this.y).getDist(new Point(player.x,player.y)) < 450) {

		var xOffset = ((this.id - 1) % 4) * 32;
		var yOffset = Math.floor(((this.id - 1) / 4)) * 32;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x+screen.xOffset,this.y+screen.yOffset,32,32);
		ctx.drawImage(tileSheet,xOffset,yOffset,32,32,this.x+screen.xOffset,this.y+screen.yOffset,32,32);
	}
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
var ui = new UI();

function UI() {

}

UI.prototype.draw = function() {
	ctx.textAlign = 'center';

	ctx.font = 'normal 20pt Calibri';
	ctx.fillStyle = "#FFF";

};

UI.prototype.handleInput = function() {

};