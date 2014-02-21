var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var asc = new Crawler('http://mining.mike.kz/index.php?page=api&action=getuserbalance&api_key=' + KEYS.ASC_MININGMIKE, function (body) {

    var balance = {
        coin: 'ASC',
        confirmed: body.getuserbalance.data.confirmed,
        unconfirmed: body.getuserbalance.data.unconfirmed,
        wallet: 'ASC_MININGMIKE'
    };
    this.logBalance(balance);

});

module.exports = asc;
