exports.pragDate = function (timestamp) {
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
};
