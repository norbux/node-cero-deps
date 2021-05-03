Notes
-----------------

To run a node app using NODE_ENV on Windows
it's convenient to install the module win-node-env:

$npm install -g win-node-env

with win-node-env installed we can now run:

$SET NODE_ENV=env-name node index.js

just as if we were on Linux/MacOs. This will not work
on PowerSehll! only on a regular cmd terminal.

Create a self-signed certificate on Linux
------------------------------------------
openssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout key.key -out cert.crt
