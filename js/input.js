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

