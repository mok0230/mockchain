const express = require('express');
const app = express();
// const port = 3000;
// const SHA256 = require('crypto-js/sha256');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const port = { argv };

if (argv.peers) {
  console.log('Peers!', argv.peers);
} else {
  console.log('No peers defined!')
}

app.use(express.json());

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
