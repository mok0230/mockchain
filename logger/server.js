#!/usr/bin/env node
// sample CLI arguments

const express = require('express');
const app = express();
app.use(express.json());

const port = 3000;

const hashrates = {};
const blockHistory = [];

const { WebSocketServer } = require('ws');

console.log('Starting WebSocket server on port 8080');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

console.log('Starting logger server')

app.post('/logs', (req, res) => {
  console.log('POST /logs');
  console.log('req.body', req.body);
  switch(req.body.type) {
    case 'block':
      blockHistory.push(req.body.data);
      break;
    case 'hashrate':
      hashrates[req.body.data.address] = req.body.data.hashrate;
      break;
  }
  res.send({ success: true });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
