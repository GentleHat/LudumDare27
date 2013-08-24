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
});

Shop.prototype.buyTower = function(type,x,y) {
	player.money -= 10;
	new Tower(type, x, y);
};

var towers = [
	{
		'fullName': "Water Tower",
		'name': 'water',
		'cost': 100,
		'speed': 2,
		'rate': 0.8
	},
	{
		'fullName': "Newspaper Tower",
		'name': 'newspaper',
		'cost': 50
	},
	{
		'fullName': "Shoe Tower",
		'name': 'shoe',
		'cost': 200
	}
];
