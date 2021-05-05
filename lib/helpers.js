/**
 * 
 */

let crypto = require('crypto');
let config = require('../config');

let helpers = {};

// Function to generate SHA256 hashes
helpers.hash = (string) => {
    if (typeof(string) === 'string' && string.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
        return hash;
    }
    else {
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = str => {
    try {
        var obj = JSON.parse(str);
        return obj;
    }
    catch(e) {
        return {};
    }
};

module.exports = helpers;