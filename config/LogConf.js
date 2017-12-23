'usr strict';

module.exports = {
    "serverLog": {
        "src": true,
        "name": "swlws-Server",
        "streams": [{
                "type": "rotating-file",
                "level": "error",
                "path": "log/error.log",
                "period": "1d",
                "count": 3
            },
            {
                "type": "rotating-file",
                "level": "info",
                "path": "log/info.log",
                "period": "1d",
                "count": 3
            },
            {
                "type": "rotating-file",
                "level": "debug",
                "path": "log/debug.log",
                "period": "1d",
                "count": 1
            }
        ]
    },
    "restifyLog": {
        "src": false,
        "name": "swlws-AccessLog",
        "streams": [{
            "type": "rotating-file",
            "level": "info",
            "path": "log/access.log",
            "period": "1d",
            "count": 3
        }]
    }
};