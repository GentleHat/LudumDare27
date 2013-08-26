//Using audiofx.min.js

if (AudioFX.supported) {
	//var shufflesound = AudioFX('sounds/cardshuffle', { formats: ['wav'], pool:2 });
	var buildsound = AudioFX('sounds/build', { formats: ['wav'], pool:3, volume:0.6});
	var moneysound = AudioFX('sounds/money', { formats: ['wav'], pool:7, volume:0.6});
	var hitsound = AudioFX('sounds/hit', { formats: ['wav'], pool:10, volume:0.5});
	var loselifesound = AudioFX('sounds/loselife', { formats: ['wav'], pool:5, volume:0.6});
	var firesound = AudioFX('sounds/fire', { formats: ['wav'], pool: 10, volume: 0.2});
	var wavesound = AudioFX('sounds/wave', { formats: ['wav'], pool: 2, volume: 0.3});

}
