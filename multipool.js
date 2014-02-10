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
		}
	}
});

module.exports = multipool;
