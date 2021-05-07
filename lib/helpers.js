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

// Create a string of random alphanumeric characters of the given lenght
helpers.createRandomString = stringLength => {
    stringLength = typeof(stringLength) === 'number' && stringLength > 0 ? stringLength : false;

    if (stringLength) {
        // Define all the possible characters that could go into a string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345678790';

        // Start the final string
        let str = '';

        for (i = 1; i <= stringLength; i++) {
            // Get a random character from the possibleCharacters string
            let randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomChar;
        }

        return str;
    }
    else {
        return false;
    }
};

module.exports = helpers;