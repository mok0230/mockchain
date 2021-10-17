#!/usr/bin/env node
// sample CLI arguments
// node miner/server.js --port 3001 --peers 3002 --peers 3003 

const express = require('express');
// const SHA256 = require('crypto-js/sha256');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { genesisBlock, sendLog, getHashrateFromInterval } = require('./utils');
const { Blockchain } = require('./models/Blockchain');
const argv = yargs(hideBin(process.argv)).argv;
// const cors = require('cors');
const app = express();
// app.use(cors());
app.use(express.json());
const { state, setState } = require('./store');


const port = argv.port;

if (!port) {
  throw new Error("port is required")
}

console.log('Starting miner server')

const isSatoshi = !Boolean(argv.peers);
const peers = argv.peers ? Array.isArray(argv.peers) ? argv.peers : [argv.peers] : [];

setState({
  isSatoshi,
  address: isSatoshi ? 'satoshi' : port.toString(),
  peers,
  hashInterval: (Math.random() * 400) + 100
});

sendLog({ type: 'hashrate', data: {
  address: state.address,
  hashrate: getHashrateFromInterval(state.hashInterval)
  }
})

setState({ blockchain: new Blockchain(isSatoshi ? genesisBlock : null) })

console.log('state', state);

app.get('/data', (req, res) => {
  console.log('GET /data');
  console.log('returning', state.blockchain.toJson())
  res.send(state.blockchain.toJson());
});

app.post('/data', (req, res) => {
  console.log('POST /data');
  console.log('req.body', req.body);
  // todo: add block if possible
  res.send(state.blockchain.toJson());
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
