'use strict';

// load opensource code


// load self code
const GetLogger = require('../lib/logger').getLogger;

// load config


// global varible


class BaseSvc{
    /**
     * 初始化参数
     * @param {HttpRequest} request 
     * @param {HttpResponse} response  
     * @param {String} handleName 方法名
     * @param {String} filter 过滤字段
     */
    setParameters(request,response,handleName,filter = null){
        this.Logger = GetLogger();
        this.handleName = handleName;
        this.request = request;
        this.response = response;
        this.filter = filter ? {
            [filter]: 1
        } : {};
        this.filterKey = filter;
    }

    /**
     * 参数校验
     */
    verify() {
        this.Logger.debug(`[${this.handleName}]: verify`);
    }

     /**
     * 将处理结果返回给客户端
     * @param {Error} err 是否发生错误，如果为null，表示没有错误
     * @param {Data}  res 返回给请求的值
     */
    sendToClient(err, res) {
        this.response.charSet('utf-8');
        this.response.status(200);

        let _res = {};

        if (err) {
            this.Logger.error(`[${this.handleName}] Occur Error: `);
            this.Logger.error(err);

            _res.r0 = 1;
            _res.r1 = 'error';

            if (err instanceof Error) {
                _res.res = err.message;
            } else {
                _res.res = err;
            }

            this.response.send(_res);
            this.Logger.debug(`[${this.handleName}]: sendToClient Occur Err`);

        } else {
            _res.r0 = 0;
            _res.r1 = 'ok';

            if (res) {
                _res.res = res;
            }

            this.response.send(_res);
            this.Logger.debug(`[${this.handleName}]: sendToClient`);
        }

        this.response.end();
    }
}

module.exports = BaseSvc;