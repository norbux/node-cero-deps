/**
 * Library for storing and editing data
 */

let fs = require('fs');
let path = require('path');
const helpers = require('./helpers');

let lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/.././.data/');
lib.create = (dir, file, data, callback) => {
    // Open the file for writing
    let path = `${lib.baseDir}${dir}\\${file}.json`;
    fs.open(path, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            let stringData = JSON.stringify(data);

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, error => {
                if (!err) {
                    fs.close(fileDescriptor, error => {
                        if (!err) {
                            callback(false);
                        }
                        else {
                            callback('Error closing new file');
                        }
                    });
                }
                else {
                    callback('Error writing to new file');
                }
            });
        }
        else {
            callback('Could not create new file, it may already exist');
        }
    });
};

// Read data from a file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}${dir}\\${file}.json`, 'utf-8', (err, data) => {
        if (!err && data) {
            let parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        }
        else {
            callback(err, data);
        }
    });
}

// Update data inside a file
lib.update = (dir, file, data, callback) => {
    // Open the file for writing
    fs.open(`${lib.baseDir}${dir}\\${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            let stringData = JSON.stringify(data);

            // Truncate the file
            fs.ftruncate(fileDescriptor, err => {
                if (!err) {
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, err => {
                        if (!err) {
                            fs.close(fileDescriptor, err => {
                                if (!err) {
                                    callback(false);
                                }
                                else {
                                    callback('Error closing file');
                                }
                            });
                        }
                        else {
                            callback('Error writing to existing file');
                        }
                    });
                }
                else {
                    callback('Error truncating file');
                }
            });
        }
        else {
            callback('Could not open the file for updating, it may not exist yet');
        }
    });
};

// Delete file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir}${dir}\\${file}.json`, err => {
        if (!err) {
            callback(false);
        }
        else {
            callback('Error deleteing file');
        }
    });
};

module.exports = lib;