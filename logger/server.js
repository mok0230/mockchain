#!/usr/bin/env node
// sample CLI arguments

const express = require('express');
const app = express();
app.use(express.json());

const port = 3000;

console.log('Starting logger server')

app.post('/logs', (req, res) => {
  console.log('POST /logs');
  console.log('req', req)
  console.log('req.body', JSON.stringify(req.body));
  res.send({ success: true });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
