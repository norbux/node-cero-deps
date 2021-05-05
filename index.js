/*
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const qs = require('querystring');
//const url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');
let handlers = require('./lib/handlers');
let helpers = require('./lib/helpers');

// Instantiating the HTTP server.
let httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort} now`);
    console.log(`envName: ${config.envName}`);
});

// Instantiate the HTTPS server
let httpsOptions = {
    'key': fs.readFileSync('./https/key.key'),
    'cert': fs.readFileSync('./https/cert.crt')
};

let httpsServer = https.createServer(httpsOptions, (req, res) => {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log(`The server is listening on port ${config.httpsPort} now`);
    console.log(`envName: ${config.envName}`);
});

// All the server logic for both the http and https server
let unifiedServer = (req, res) => {
    // Get the path of the URL
    var parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let path = req.url;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    let arr = trimmedPath.split('?');
    trimmedPath = arr[0];
    let searchParams = parsedUrl.searchParams;

    // Get the query string as an object
    let queryString = parsedUrl.search.split('?')[1];
    let queryStringObject = qs.decode(queryString);

    // Get the HTTP Method
    let method = req.method.toLowerCase();

    // Get the headers
    let headers = req.headers;

    // Set content type
    headers['content-type'] = 'application/json';
    headers['content-encoding'] = 'utf-8';

    // Get the paylod if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // Chose the handler this request go to.
        let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'searchParams': searchParams,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        choosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the  handler, or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empy object
            payload = typeof(payload) === 'object' ? payload : {};

            // Convert the payload to a string
            let payloadString = JSON.stringify(payload);

            // Return the response
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
    
    // Log the request
    console.log(`Url: ${parsedUrl.href}`);
    console.log(`Path: ${trimmedPath}\nMethod: ${method}\nQuery string: ${queryString}\n`);
    console.log(`Search params: ${parsedUrl.searchParams}`);
    console.log(headers);
};

let router = {
    'ping': handlers.ping,
    'users': handlers.users
};