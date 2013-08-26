var ui = new UI();

function UI() {

}

UI.prototype.draw = function() {
	ctx.textAlign = 'center';

	ctx.font = 'normal 20pt Calibri';
	ctx.fillStyle = "#FFF";
	if (game.lost) {
		ctx.fillText("Game Over",285,220);
	}

};

UI.prototype.handleInput = function() {

};