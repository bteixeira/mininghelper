var util = require('util');
var _ = require('underscore');
var qs = require('querystring');
var request = require('request');

var url = 'https://coinex.pw/api/v2/trade_pairs';
var UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36';

console.log('Fetching', url);

request({
    url: url,
    headers: {

    }
}, function (err, res, body) {
    console.log('Status is', res.statusCode);

    var cookie = res.headers['set-cookie'][0].split(';')[0];
    console.log('Cookie', cookie);

    var data = {
        jschl_vc: body.match(/name="jschl_vc" value="([a-zA-Z0-9]+)"/)[1]
    };
    console.log('VC', data.jschl_vc);

    var action = body.match(/action="([^"]+)"/)[1];
    console.log('Action', action);

    var ch = body.match(/a\.value = ([0-9\+\*\-\/]+)/)[1];
    console.log('Challenge', ch);
    data.jschl_answer = parseInt(eval(ch), 10) + 'coinex.pw'.length;
    console.log('Challenge solved', data.jschl_answer);

    console.log('Parameters are', data);

//    setTimeout(function () {
//        url = 'https://coinex.pw' + action + '?' + qs.stringify(data);
//        console.log('Fetching', url);
//        var headers = {
//            cookie: cookie,
//            'user-agent': UA,
//            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//            'accept-encoding': 'gzip,deflate,sdch',
//            'accept-language': 'en-US,en;q=0.8,pt;q=0.6,pt-PT;q=0.4,de-DE;q=0.2,de;q=0.2,nl;q=0.2',
//            referer: 'https://coinex.pw/api/v2/trade_pairs'
//        };
//        console.log('With headers', headers);
//        request({
//            url: url,
//            headers: headers
//        }, function (err, res, body) {
//            console.log('Status is', res.statusCode);
//            console.log('\n', body);
//        });
//    }, 5850);
});


//request ({
//    url: 'https://coinex.pw/cdn-cgi/l/chk_jschl?jschl_vc=06ee07b448f9ad7dd33ef62507c65e61&jschl_answer=349',
//    headers: {
//        'accept-encoding': 'gzip,deflate,sdch',
//        'accept-language': 'en-US,en;q=0.8,pt;q=0.6,pt-PT;q=0.4,de-DE;q=0.2,de;q=0.2,nl;q=0.2',
//        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36',
//        'accept': '/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//        'referer': 'https://coinex.pw/api/v2/trade_pairs',
//        'cookie': '__cfduid=d9ca6564d7078716b6e709e5da8517b6a1392921902658'
//    }
//}, function (err, res, body) {
//    console.log('Status is', res.statusCode);
//    console.log('\n', body);
//});