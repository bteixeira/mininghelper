var http = require('http');

var Crawler = require(__dirname + '/crawler.js');
var multipool = require(__dirname + '/multipool.js');
var bitminter = require(__dirname + '/bitminter.js');
var mtgox = require(__dirname + '/mtgox.js');
require(__dirname + '/catalogues.js');


var crawlers = [multipool, bitminter, mtgox];

function pragDate (timestamp) {
	var MONTHS = 'JA FE MR AP MA JN JL AG ST OT NV DE'.split(' ');
	var date = new Date(timestamp);
	
	var month = MONTHS[date.getMonth()];
	var day = date.getDate();
	var hours = date.getHours();
	if (hours < 10) {
		hours = '0' + hours;
	}
	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	var seconds = date.getSeconds();
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	return month + day + '@' + hours + ':' + minutes + ':' + seconds;
}

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
	}, function(err, docs) {
		if (!err) {
			for (var i = 0 ; i < docs.length ; i++) {
				docs[i].time = pragDate(docs[i].time);
			}
			res.end(jades.balanceSimple({balances: docs}));
		} else {
			console.error(err);
		}
	});

});

app.listen(7410);
