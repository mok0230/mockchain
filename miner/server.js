#!/usr/bin/env node
// sample CLI arguments
// node miner/server.js --peers 3001 --peers 3002 --port 3000

const express = require('express');
// const SHA256 = require('crypto-js/sha256');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { genesisBlock } = require('./utils');
const { Blockchain } = require('./models/Blockchain');
const argv = yargs(hideBin(process.argv)).argv;
const app = express();
app.use(express.json());

const port = argv.port;

if (!port) {
  throw new Error("port is required")
}

console.log('Starting server')

// the only node that has no peers is the first one
const isSatoshi = Boolean(argv.peers);

const address = isSatoshi ? 'satoshi' : port.toString();

const peers = argv.peers || [];

const blockchain = new Blockchain(isSatoshi ? genesisBlock : null);

console.log('blockchain.blocks', blockchain.blocks);

app.get('/data', (req, res) => {
  // TODO: return current blockchain
});

app.post('/data', (req, res) => {
  // TODO: add new block
});

app.post('/peers', (req, res) => {
  // TODO: add new peer
});

app.post('/transactions', (req, res) => {
  // TODO: add new transaction to mempool
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
