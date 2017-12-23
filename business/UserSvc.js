'use strict';

// load opensource code


// load self code
let BaseSvc = require('../lib/BaseSvc.js');
let ConfigCollect = require('../dboperator/UserCollect.js');

// load config


// global varible


/**
 * 
 */

 class UserSvc extends BaseSvc{
    constructor() {
        super();
        this.configCollect = new ConfigCollect();
    }

    // 校验参数有效性，待补上
    async verify() {
        this.Logger.info(`[${this.handleName}]: Call verify`);
        // do some check
        super.verify();
    }

    filterFunc(agtconf) {
        if (!agtconf || (this.filterKey && !agtconf[this.filterKey])) {
            throw Error(`[${this.handleName}]: filterFunc conf error`);
        }

        if (this.filterKey){
            return {
                [this.filterKey]: agtconf[this.filterKey]
            };
        } else {
            return {
                conf: agtconf
            };
        }
    }

    async getUserInfo() {
        try {
            this.verify();

            this.Logger.info(`[${this.handleName}]: Call findUserInfo`);
            let agtconf = await this.configCollect.findUserInfo({
                uuid: this.agtpid
            }, this.filter);

            let retConf = this.filterFunc(agtconf);

            this.Logger.info(`[${this.handleName}]: Call sendToClient`);
            this.sendToClient(null, retConf);
            this.Logger.info(`Call sendToClient end`);
        } catch (error) {
            this.sendToClient(error);
        }
    }
 }

 module.exports = UserSvc;