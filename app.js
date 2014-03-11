//var http = require('http');
var util = require('util');

//var Crawler = require(__dirname + '/crawler.js');
//var multipool = require(__dirname + '/crawlers/multipool.js');
//var bitminter = require(__dirname + '/crawlers/bitminter.js');
//var mtgox = require(__dirname + '/crawlers/mtgox.js');
//var coinbase = require(__dirname + '/crawlers/coinbase.js');
//require(__dirname + '/catalogues.js');
var utils = require(__dirname + '/src/utils.js');
var pragDate = utils.pragDate;
var _ = require('underscore');


var crawlers = utils.requireAll(__dirname + '/crawlers'); //[multipool, bitminter, mtgox, coinbase];

for (var i = 0; i < crawlers.length; i++) {
    if (!crawlers[i].start) {
        console.warn('supposed crawler does not know Start: ' + util.inspect(crawlers[i]));
    } else {
        crawlers[i].start();
    }
}

function getCoinValues(callback) {
    db.exchange_rates.group({
            key: {
                buy: 1,
                from: 1
            },
            reduce: function (doc, res) {
                if (!res.exchanges[doc.exchange] || res.exchanges[doc.exchange].time < doc.time) {
                    res.exchanges[doc.exchange] = doc;
                }
            },
            initial: {
                exchanges: {}
            },
            finalize: function (res) {
                for (var p in res.exchanges) {
                    if (res.exchanges.hasOwnProperty(p)) {
                        if (!res.best || parseFloat(res.exchanges[p].rate) > parseFloat(res.best.rate)) {
                            res.best = res.exchanges[p];
                        }
                    }
                }
            }
        }, function (err, docs) {
            if (err) {
                console.log(err);
            }

            docs = docs.reduce(function (res, doc) {
                if (!res[doc.buy]) {
                    res[doc.buy] = [];
                }
                res[doc.buy].push({
                    from: doc.from,
                    rate: Number(doc.best.rate).toFixed(8),
                    exchange: doc.best.exchange,
                    time: doc.best.time
                });
                return res;
            }, {});

            _.each(docs, function (v, k) {
                docs[k] = _.indexBy(v, 'from');
            });
            _.each(docs, function (v, k) {
                if (!v.EUR && v.BTC && docs.BTC.EUR) {
                    v.EUR = {
                        rate: (v.BTC.rate * docs.BTC.EUR.rate).toFixed(8),
                        exchange: docs.BTC.EUR.exchange,
                        time: Math.min(v.BTC.time, docs.BTC.EUR.time)
                    }
                }
            });

            callback(docs);
        }
    );
}


var db = require('mongojs').connect('mininghelper', ['balances', 'exchange_rates']);
var express = require('express');
var app = express();
var jade = require('jade');
var fs = require('fs');

var jades = {};
fs.readdir('./views', function (err, files) {
    if (!files) {
        console.warn('warn: no templates or no template dir');
        return;
    }
    files.forEach(function (val) {
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

    db.balances.group({
        key: {coin: 1},
        reduce: function (doc, res) {
            var wallet = doc.wallet;
            if (!(wallet in res.wallets)) {
                res.wallets[wallet] = doc;
            } else if (doc.time > res.wallets[wallet].time) {
                res.wallets[wallet] = doc;
            }
        },
        initial: {
            wallets: {}
        },
        finalize: function (result) {
            result.balance = 0;
            result.unconfirmed = 0;
            result.time = Infinity;
            var wallet;
            var t, c, u;
            for (var k in result.wallets) {
                wallet = result.wallets[k];
                c = parseFloat(wallet.confirmed) || 0;
                u = parseFloat(wallet.unconfirmed) || 0;
                t = wallet.time;

                result.balance += c + u;
                result.unconfirmed += u;
                if (t < result.time) {
                    result.time = t;
                }
            }
        }
    }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        for (var i = 0; i < docs.length; i++) {
            docs[i].time = pragDate(docs[i].time);
        }
        getCoinValues(function (values) {
            res.end(jades.balance({balances: docs, values: values}));
        });

    });

});

app.get(/\/balance\/(\w+)/, function (req, res) {
    var coin = req.params[0];
    db.balances.group({
        key: {
            wallet: 1
        },
        reduce: function (doc, res) {
            if (doc.time > res.time) {
                res.time = doc.time;
                res.balance = (parseFloat(doc.confirmed) || 0) + (parseFloat(doc.unconfirmed) || 0);
                res.unconfirmed = parseFloat(doc.unconfirmed) || 0;
            }
        },
        initial: {
            time: 0,
            balance: 0,
            unconfirmed: 0
        },
        cond: {
            coin: coin
        }
    }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        for (var i = 0; i < docs.length; i++) {
            docs[i].time = pragDate(docs[i].time);
        }
        res.end(jades.balanceCoin({coin: coin, wallets: docs}));
    });
});

app.get(/\/exchange\/(\w+)/, function (req, res) {
    console.log(util.inspect(req.params));
    db.exchange_rates.group({
        key: {
            buy: 1,
            exchange: 1
        },
        reduce: function (doc, res) {
            if (!res.time || doc.time > res.time) {
                res.time = doc.time;
                res.rate = doc.rate;
            }
        },
        initial: {},
        cond: {
            from: 'BTC'
        }
    }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        for (var i = 0; i < docs.length; i++) {
            docs[i].time = pragDate(docs[i].time);
        }
        console.log(util.inspect(docs));

    });
});

app.listen(7410);
