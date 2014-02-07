var http = require('http');

var Crawler = require(__dirname + '/crawler.js');
var multipool = require(__dirname + '/multipool.js');
require(__dirname + '/catalogues.js');

/*
var crawlers = [
	new Crawler('http://api.multipool.us/api.php?api_key=' + KEYS.MULTIPOOL, function (body) {
		var coins = body.currency;
		var coin;
		for (var name in coins) {
			if (coins.hasOwnProperty(name)) {
				coin = coins[name];
				db.rewards.save({
					time: new Date().getTime(),
					coin: name.toUpperCase(),
					confirmed: coin.confirmed_rewards,
					unconfirmed: coin.estimated_rewards,
					hashrate: coin.hashrate
				});
			}
		}
	})
];
*/

var crawlers = [multipool];

for (var i = 0 ; i < crawlers.length ; i++) {
	crawlers[i].start();
}







var db = require('mongojs').connect('mininghelper', ['balances']);
var express = require('express');
var app = express();
var jade = require('jade');
var fs = require('fs');

var jades = {};
fs.readdir('./views', function(err, files) {
	if (!files) {
		console.warn('warn: no templates or no template dir');
		return;
	}
	files.forEach(function(val) {
		var path = './views/' + val;
		console.log('file', val);
		jades[val.replace(/\.[^/.]+$/, '')] = jade.compile(fs.readFileSync(path), {filename: path, pretty: true});
	});
});
console.log('jades' + jades);

app.use('/static', express.static('static'));

app.use(express.bodyParser());

app.get('/', function (req, res) {
    res.redirect('balance');
});

app.get('/balance', function (req, res) {
	db.balances.find(function(err, docs) {
		if (!err) {
			res.end(jades.balance({balances: docs}));
		}
	});
});

app.listen(7410);
