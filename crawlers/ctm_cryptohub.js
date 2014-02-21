var Crawler = require(__dirname + '/../crawler.js');
var KEYS = require(__dirname + '/../config.js').KEYS;

var ctm = new Crawler('http://ctm.cryptohub.org/index.php?page=api&action=getuserbalance&api_key=' + KEYS.CTM_CRYPTOHUB, function (body) {

    var balance = body.getuserbalance.data;
    this.logBalance({
            coin: 'CTM',
            confirmed: balance.confirmed,
            unconfirmed: balance.unconfirmed,
            wallet: 'CTM_CRYPTOHUB'
        });

    });

module.exports = ctm;
