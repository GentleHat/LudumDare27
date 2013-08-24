var shop = new Shop();


function Shop() {
	
}


$(window).load(function() {
	for (var i=0;i<towers.length;i++) {
		$('#shop').append("<div class='tower'><img class='" + towers[i].name +"' src='images/" + towers[i].name + "_tower.png'></div>");
	}
	$('.tower').click(function(event) {
		var selection = $(this).find('img').attr("class");
		for (var i=0;i<towers.length;i++) {
			if (towers[i].name == selection) {
				player.selection = towers[i];
				break;
			}
		}
	});
	$("#shop").append("<div id='scoreboard'></div>");
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
};

var towers = [
	{
		'fullName': "Water Tower",
		'name': 'water',
		'cost': 100,
		'speed': 2,
		'rate': 0.8,
		'power':15
	},
	{
		'fullName': "Newspaper Tower",
		'name': 'newspaper',
		'cost': 50,
		'speed':1.5,
		'rate':1.2,
		'power':30
	},
	{
		'fullName': "Shoe Tower",
		'name': 'shoe',
		'cost': 200,
		'speed':1,
		'rate':2,
		'power':80
	}
];
