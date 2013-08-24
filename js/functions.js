Function.prototype.inherit = function(parent) {
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
  return frames / 30;
  /*
	var date = new Date();
	var ms = date.getTime() / 1000;
	return ms; */
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