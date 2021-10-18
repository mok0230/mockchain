#!/usr/bin/env node
// sample CLI arguments
// node miner/server.js --port 3001 --peers 3002 --peers 3003 

const express = require('express');
// const SHA256 = require('crypto-js/sha256');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { genesisBlock, sendLog, getHashrateFromInterval, executePeerRequest, isValidBlockchain } = require('./utils');
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
let peers = [];
if (argv.peers) {
  console.log('argv.peers', argv.peers)
  peers = Array.isArray(argv.peers) ? argv.peers : [argv.peers];
}

setState({
  isSatoshi,
  address: isSatoshi ? 'satoshi' : port.toString(),
  peers,
  hashInterval: (Math.random() * 400) + 100,
  showFullMiningDebugLogs: false
});

// notify peers to add me as peer
if (peers.length) executePeerRequest('postPeer', { address: state.address });

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
  
  if (state.blockchain && state.blockchain.blocks && (!state.blockchain.blocks.length || req.body.blocks.length > state.blockchain.blocks.length)) {
    console.log('Updating local blockchain');
    state.blockchain.blocks = req.body.blocks;
    if(!state.blockchain.isMining) state.blockchain.mine()
  }

  res.send(state.blockchain.toJson());
});

app.post('/peers', (req, res) => {
  console.log('POST /peers');
  const response = { added: false };

  if (state.peers.indexOf(req.body.address) === -1) {
    console.log('adding peer', req.body.address);
    state.peers.push(req.body.address);
    response.added = true;
  }

  res.send(response);
});

app.post('/transactions', (req, res) => {
  // TODO: add new transaction to mempool
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
