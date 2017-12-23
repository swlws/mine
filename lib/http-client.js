'use strict';

// load opensource code
const querystring = require('querystring');
const restifyClients = require('restify-clients');

// load self code
const Logger = require('../lib/logger.js').getLogger({
    mod: 'http-client'
});

let HttpBase = require('./http-common.js');

// load config
const WebCfg = require('../config/WebServer.js');
const NotifyEvent = WebCfg.NotifyEvent;

const ConnUrl = 'http://' + WebCfg.AgtServerIP + ':' + WebCfg.HttpPort;

function joinUrlString(SrvEvent, queryObj) {
    if (typeof NotifyEvent[SrvEvent].path === 'string') {
        if (queryObj)
            return NotifyEvent[SrvEvent].path + '?' + querystring.stringify(queryObj);
        else
            return NotifyEvent[SrvEvent].path;
    } else
        return undefined;
}

function httpWrap() {
    let client = restifyClients.createClient({
        url: ConnUrl,
        type: 'json',
        headers: {
            charset: 'utf-8'
        },
        agent: false
    });

    let httpClient = new HttpBase(client, 'http');

    function RealWrap(SrvEvent, queryObj, rawData) {
        let url = joinUrlString(SrvEvent, queryObj);
        Logger.debug(`Enter SrvEvent(${SrvEvent}): [${url}]`);

        if (url) {
            switch (NotifyEvent[SrvEvent].method) {
                case 'get':
                    return httpClient.get(url);
                case 'put':
                    return httpClient.put(url, rawData);
                case 'post':
                    return httpClient.post(url, rawData);
            }
        } else {
            return Promise.reject(`Invalid URL By SrvEvent: ${SrvEvent}`);
        }
    }

    return RealWrap;
}

exports.httpWrap = httpWrap();