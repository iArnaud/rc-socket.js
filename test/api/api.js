/*
 * test/commands/api.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */


// ----------------------------------------------------------------------------
// DEPENDENCIES
// ----------------------------------------------------------------------------

// Core
var spawn = require('child_process').spawn,
    path  = require('path');

// 3rd party
var Hapi = require('hapi');


// ----------------------------------------------------------------------------
// MODULE VARS
// ----------------------------------------------------------------------------

var socketProcess;


// ----------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------
var server = Hapi.createServer('localhost', 9997, { cors: true });

server.route({
  method: 'POST',
  path: '/socket/start',
  handler: function (request, reply) {
    var filePath = path.join(__dirname, 'web-socket.js');
    socketProcess = spawn('node', [filePath]);
    reply().code(204);
  }
});

server.route({
  method: 'POST',
  path: '/socket/stop',
  handler: function (request, reply) {
    socketProcess.kill('SIGINT');
    reply().code(204);
  }
});

// Gracefully shutdown if websocket started
process.on('SIGINT', function () {
  socketProcess.kill('SIGINT');
  process.exit();
});

// Start the server
server.start();