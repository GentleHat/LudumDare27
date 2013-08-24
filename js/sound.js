//Using audiofx.min.js

if (AudioFX.supported) {
	//var shufflesound = AudioFX('sounds/cardshuffle', { formats: ['wav'], pool:2 });
	var sound = AudioFX('sounds/soundfilename', { formats: ['wav'], pool:8, volume:0.3});
}
