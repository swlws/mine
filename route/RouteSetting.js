'use strict';

// load opensource code
const restify = require('restify');
const serveStatic = require('serve-static-restify');


// load self code
const Logger = require('../lib/logger.js').getLogger({
    mod: 'SetRoute'
});

// load config
const RoutesConf = require('./RouteTable.js');


// global varible

//获取Route Hanlde函数
function GetRouteHandle(srcPath, func) {
    const funcObj = require(srcPath);
    const retFunc = funcObj[func];

    if (!retFunc) {
        Logger.error(`GetRouteHanlde Error: [srcPath: ${srcPath}] [func: ${func}]`);
    }

    return retFunc;
}

/**
 * 设置路由服务
 * @param {Object} server Restify Server对象
 */
function SetRouteService(server) {
    server.pre(serveStatic('public'));
    server.pre(restify.plugins.pre.dedupeSlashes());
    server.pre(restify.plugins.pre.sanitizePath());

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser({
        mapParams: true,
        arrayLimit: 0,
        depth: 0,
        parameterLimit: 8,
        parseArrays: false
    }));
    server.use(restify.plugins.bodyParser({
        mapParams: true
    }));


    let RouteMothods = Object.keys(RoutesConf);

    for (const RouteMothod of RouteMothods) {
        const RouteClass = RoutesConf[RouteMothod];

        for (const RouteConf of RouteClass) {
            server[RouteMothod](RouteConf.uri, GetRouteHandle(RouteConf.src, RouteConf.func));
        }
    }
}
exports.SetRouteService = SetRouteService;