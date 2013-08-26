var shop = new Shop();


function Shop() {

}


$(window).load(function() {
	for (var i=0;i<towers.length;i++) {
		$('#shop').append("<div class='tower'><img class='" + towers[i].name +"' src='images/" + towers[i].name + "_tower.png'></div>");
	}
	$('.tower').mousedown(function(event) {
		var selection = $(this).find('img').attr("class");
		for (var i=0;i<towers.length;i++) {
			if (towers[i].name == selection) {
				player.selection = towers[i];
				break;
			}
		}
	});
	$("#shop").append("<div id='scoreboard'></div>");
	setInterval("shop.updateScore();", 500);
});

Shop.prototype.buyTower = function(type,x,y) {
	if (player.money >= type.cost) {
		player.money -= type.cost;
		new Tower(type, x, y);
	}
	this.updateScore();
};

Shop.prototype.updateScore = function() {
	$("#scoreboard").text("Money: $"+player.money);
	$("#scoreboard").append("Next Wave in: " +score.buildTime);
	$("#scoreboard").append("Wave: "+score.currentWave);
};

var towers = [
	{
		'fullName': "Grass Tower",
		'name': 'grass',
		'cost': 25,
		'speed':3.5,
		'rate':1.5,
		'power':20
	},
	{
		'fullName': "Stone Tower",
		'name': 'stone',
		'cost': 50,
		'speed':4,
		'rate':1.2,
		'power':30
	},
	{
		'fullName': "Water Tower",
		'name': 'water',
		'cost': 100,
		'speed': 2,
		'rate': 0.8,
		'power':15
	},
	{
		'fullName': "Fire Tower",
		'name': 'fire',
		'cost': 150,
		'speed':2.5,
		'rate':1.5,
		'power':60
	},
	{
		'fullName': "Gasoline Tower",
		'name': 'gasoline',
		'cost': 150,
		'speed':2,
		'rate':1.5,
		'power':0
	}
];
