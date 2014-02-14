var db = require('mongojs').connect('mininghelper', ['exchange_rates']);
var request = require('request');

var TIMEOUT = 1000;

var exchanges = {
	BTER: 'BTER'
};

/* BTER COINS */
var coins = ['BTC', 'PPC', 'ZET', 'FRC', 'NMC', 'DOGE', 'BTB'];

function getBterUrl(buy, from) {
	return 'http://data.bter.com/api/1/ticker/' + buy.toLowerCase() + '_' + from.toLowerCase();
}

var num = 0;
function setCrawler(buy, from) {
	var n = num++;
	var url = getBterUrl(pair.buy, pair.from);
	console.log('setting BTER crawler ' + n + ' for ' + url);
	function fetch () {
		request({
			url: url,
			json: true
		}, function (err, response, body) {
			if (err) {
				throw err;
			}
			if (response.statusCode !== 200) {
				console.warn('warning, status code is ' + response.statusCode);
			}
			if (body) {
				console.log(n, body.low);
				db.exchange_rates.save({
					buy: buy,
					from: from,
					rate: body.low,
					time: new Date().getTime(),
					exchange: exchanges.BTER
				});
			} else {
				console.warn('no data received');
			}
			setTimeout(fetch, TIMEOUT);
		});
	}

	fetch();
}

var pairs = [
	{buy: 'PPC', from: 'BTC'},
	{buy: 'ZET', from: 'BTC'},
	{buy: 'FRC', from: 'BTC'},
	//{buy: 'FRC', from: 'LTC'},
	{buy: 'NMC', from: 'BTC'},
	//{buy: 'NMC', from: 'LTC'}
	{buy: 'DOGE', from: 'BTC'},
	{buy: 'BTB', from: 'BTC'}
];

var pair;
for (var i = 0 ; i < pairs.length ; i++) {
	pair = pairs[i];
	setCrawler(pair.buy, pair.from);
}


/******************************************************************************/
/*
addExchangeCrawler({
	url: 'http://data.bter.com/api/1/ticker/doge_btc',
	buy: coins.DOGE,
	from: coins.BTC,
	parser: parsers.BTER
});
*/
