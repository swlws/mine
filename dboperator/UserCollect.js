'use strict';

// load opensource code


// load self code
const GetLogger = require('../lib/logger').getLogger;
let db = require('../lib/mongolib.js');

// load config


// global varible


class UserCollet{
    constructor(){
        this.jtbl_config = 'user';
        this.Logger = GetLogger();
    }

    findUserInfo(queryObj, filterObj){
        this.Logger.debug(`Call findAgentConf with: [query(${JSON.stringify(queryObj)})] [filter(${JSON.stringify(filterObj)})]`);

        return db.findOne(this.jtbl_config, queryObj, filterObj);
    }
}
module.exports = UserCollet;