
$("#shop").append("<div class='tower'><img class='watertower' src='images/water.png'></div>");


$('.watertower').click(function() {
	player.selection = 'water';
});

var watertower = {
	'name': 'Water Tower',
	'cost': 100
};