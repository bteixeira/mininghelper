var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var bitminter = new Crawler('https://bitminter.com/api/users?key=' + KEYS.BITMINTER, function (body) {
	
	this.logHashrate({
		coin: 'BTC',
		hashrate: body.hashrate,
		pool: 'BITMINTER'
	});
	
	this.logBalance({
		coin: 'BTC',
		confirmed: body.balances.BTC,
		wallet: 'BITMINTER'
	});
	
	this.logBalance({
		coin: 'NMC',
		confirmed: body.balances.NMC,
		wallet: 'BITMINTER'
	});

});

module.exports = bitminter;
