'use strict';

const fs = require('fs');
const util = require('util');

exports.writeFile = util.promisify(fs.writeFile);

exports.existsSync = fs.existsSync;

exports.writeFileSync = fs.writeFileSync;

exports.readFileSync = fs.readFileSync;