#!/usr/bin/env node
// sample CLI arguments

const express = require('express');
const app = express();
app.use(express.json());

const appPort = 3000;
const webSocketPort = 8080;

const hashrates = [];

const { WebSocketServer } = require('ws');

console.log(`Starting WebSocket server on port ${webSocketPort}`);

const wss = new WebSocketServer({ port: webSocketPort });

let webSocket;

wss.on('connection', function connection(ws) {
  webSocket = ws;
  webSocket.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  webSocket.send('something');
});

console.log('Starting logger server')

app.get('hashrates', (req, res) => {
  console.log('GET /hashrates');
  res.send({ hashrates });
})

app.post('/logs', (req, res) => {
  console.log('POST /logs');
  console.log('req.body', req.body);
  switch(req.body.type) {
    case 'blockchain':
      if (webSocket) {
        console.log('sending via WebSocket')
        webSocket.send(JSON.stringify(req.body));
      }
      break;
    case 'hashrate':
      hashrates.push(req.body.data);
      break;
  }

  

  res.send({ success: true });
});

app.listen(appPort, () => {
  console.log(`Listening on port ${appPort}!`);
});
