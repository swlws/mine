'use strict';

const os = require('os');

function getLocalIPAddr() {
    const interfaces = os.networkInterfaces();
    let ipaddrs = [];

    Object.keys(interfaces).forEach(function (nic) {
        interfaces[nic].forEach(function (details) {
            details.family = details.family.toLowerCase();
            if ((details.family === 'ipv4') && (!details.internal)) {
                ipaddrs.push(details);
            }
        });
    });

    return ipaddrs.length > 0 ? ipaddrs[0].address : undefined;
}

exports.getLocalIPAddr = getLocalIPAddr;


var localIPAddr = getLocalIPAddr();
console.log(localIPAddr);