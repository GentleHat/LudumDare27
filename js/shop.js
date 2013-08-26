var shop = new Shop();


function Shop() {

}


$(window).load(function() {
	$('#shop').append("<div id='towers'></div>");
	for (var i=0;i<towers.length;i++) {
		$('#towers').prepend("<div class='tower'><img class='" + towers[i].name +"' src='images/" + towers[i].name + "_tower.png'>$"+towers[i].cost+"</div>");
	}
	$('.tower').mousedown(function(event) {
		var selection = $(this).find('img').attr("class");
		for (var i=0;i<towers.length;i++) {
			if (towers[i].name == selection) {
				if (player.money >= towers[i].cost) {
					player.selection = towers[i];
				}
				break;
			}
		}
	});
	$("#shop").prepend("<div id='scoreboard'></div>");
	setInterval("shop.updateScore();", 500);
});

Shop.prototype.buyTower = function(type,x,y) {
	if (player.money >= type.cost) {
		player.money -= type.cost;
		new Tower(type, x, y);
		buildsound.play();
	}
	this.updateScore();
};

Shop.prototype.updateScore = function() {
	$("#scoreboard").html("");
	$("#scoreboard").append("Money: <u class='pull-right'>$"+player.money+"</u>");
	$("#scoreboard").append("<br>Next Wave: <u class='pull-right'>" +score.buildTime+"</u>");
	$("#scoreboard").append("<br>Wave #: <u class='pull-right'>"+score.currentWave+"</u>");
	$("#scoreboard").append("<br>Kills: <u class='pull-right'>"+score.spidersKilled+"</u>");
	$("#scoreboard").append("<br>Lives: <u class='pull-right'>"+player.lives+"</u>");
};

var towers = [
	{
		'fullName': "Grass Tower",
		'name': 'grass',
		'cost': 100,
		'speed':3.5,
		'rate':0.8,
		'power':15,
		'range':200
	},
	{
		'fullName': "Stone Tower",
		'name': 'stone',
		'cost': 125,
		'speed':4,
		'rate':1.2,
		'power':35,
		'range':150,
	},
	{
		'fullName': "Water Tower",
		'name': 'water',
		'cost': 125,
		'speed': 2,
		'rate': 0.65,
		'power':15,
		'range':150
	},
	{
		'fullName': "Fire Tower",
		'name': 'fire',
		'cost': 150,
		'speed':2.5,
		'rate':1.5,
		'power':60,
		'range':125
	},
	{
		'fullName': "Gasoline Tower",
		'name': 'gasoline',
		'cost': 250,
		'speed':2,
		'rate':3,
		'power':50,
		'range':300
	}
];
