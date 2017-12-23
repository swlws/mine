'usr strict';

module.exports = {
    "get": [{
        "uri": "/user",
        "src": "../interface/user",
        "func": "getUserInfo"
    },{
        "uri": "/user/:filter",
        "src": "../interface/user",
        "func": "getUserInfo"
    }],
    "put": [],
    "post": [],
    "del": [],
    "head": [],
    "opts": []
};