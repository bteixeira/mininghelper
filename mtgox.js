var Crawler = require(__dirname + '/crawler.js');

var bitminter = new Crawler('http://data.mtgox.com/api/2/BTCEUR/money/ticker', function (body) {
	
	this.logExchangeRate({
		buy: 'BTC',
		from: 'EUR',
		rate: body.data.avg.value,
		exchange: 'MTGOX'
	});

});

module.exports = bitminter;
