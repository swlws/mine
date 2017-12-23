'use strict';

// load opensource code
const bunyan = require('bunyan');

// load self code


// load config
const LogConf = require('../config/LogConf.js');
const serverLogConf = LogConf.serverLog;
const restifyLogConf = LogConf.restifyLog;

// global varible


let serverLog = bunyan.createLogger(serverLogConf);
let restifyLog = bunyan.createLogger(restifyLogConf);


function getLogger(child) {
    if (child && serverLog.child)
        return serverLog.child(child);
    else
        return serverLog;
}

function getAccessLogger() {
    return restifyLog;
}

exports.getLogger = getLogger;
exports.getAccessLogger = getAccessLogger;

// var Log = {
//     error : console.error,
//     info : console.info,
//     debug : console.dir
// };

// module.exports.GetLogger = function () {
//     return Log;
// };