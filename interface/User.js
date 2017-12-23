'use strict';

// load opensource code


// load self code
let ConfigSvc = require('../business/UserSvc.js');


// load config


// global varible
let G_UserSvc = new ConfigSvc();

/**
 * 获取AgentConfig的信息
 * @param {String} filter 需要过滤的字段，默认为空(null)
 */
exports.getUserInfo = function (req, res) {
    let {filter=null} = req.params;
    G_UserSvc.setParameters(req, res, 'getUserInfo',filter);
    return G_UserSvc.getUserInfo();
};