'use strict'

const restify = require('restify');
const LoadRoute = require('./route/RouteSetting.js').SetRouteService;
let LogLib = require('./lib/logger.js');
let getMongoConnInstance = require('./lib/mongolib.js').getDBInstance;
let GloablConfig = require('./config/GlobalConfig');

process.title = 'swlws';

let G_Server = undefined;
let Logger = LogLib.getLogger();

/**
 * 准备与Mongodb的通信连接
 */
async function PrepareMongoComm() {
    Logger.info('App Call PrepareMongoComm');

    await getMongoConnInstance();
}

async function startServer(){
    await PrepareMongoComm();

    const version = require('./package.json').version;
    G_Server = restify.createServer({
        name: "swlws Http Service",
        version: version,
        log: LogLib.getAccessLogger()
    });

    await LoadRoute(G_Server);
    await G_Server.listen(GloablConfig.http_server.port ? GloablConfig.http_server.port : 3000 , function(err){
        Logger.info('%s listening at %s ', G_Server.name, G_Server.url);
    })
};

startServer();

process.on('unhandledRejection', function logUnhandleRejection(reason, p) {
    Logger.error('unhandledRejection at: Promise ', p, ' \nreason: ', reason);
});

process.on('uncaughtException', function logUnhandleErr(err) {
    Logger.error('uncaughtException: ');
    Logger.error(err);
});