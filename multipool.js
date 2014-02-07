/*
var db = require('mongojs').connect('mininghelper', ['rewards']);
var request = require('request');
require(__dirname + '/config.js');

var TIMEOUT = 60 * 1000;

function fetch () {
	request({
			url: 'http://api.multipool.us/api.php?api_key=' + KEYS.MULTIPOOL,
			json: true
		}, function (err, response, body) {
			if (err) {
				throw err;
			}
			if (response.statusCode !== 200) {
				console.warn('warning, status code is ' + response.statusCode);
			}
			if (body) {
				console.log(body);
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
			} else {
				console.warn('no data received');
			}
			setTimeout(fetch, TIMEOUT);
		}
	);
}
	
fetch();
*/

var Crawler = require(__dirname + '/crawler.js');
require(__dirname + '/config.js');

var multipool = new Crawler('http://api.multipool.us/api.php?api_key=' + KEYS.MULTIPOOL, function (body) {
	var coins = body.currency;
	var coin;
	for (var name in coins) {
		if (coins.hasOwnProperty(name)) {
			coin = coins[name];
			
			this.logBalance({
				coin: name.toUpperCase(),
				confirmed: coin.confirmed_rewards,
				unconfirmed: coin.estimated_rewards,
				wallet: 'MULTIPOOL'
			});
			
			this.logHashrate({
				coin: name.toUpperCase(),
				hashrate: coin.hashrate,
				pool: 'MULTIPOOL'
			});
			/*
			db.rewards.save({
				time: new Date().getTime(),
				coin: name.toUpperCase(),
				confirmed: coin.confirmed_rewards,
				unconfirmed: coin.estimated_rewards,
				hashrate: coin.hashrate
			});
			*/
		}
	}
});

module.exports = multipool;
