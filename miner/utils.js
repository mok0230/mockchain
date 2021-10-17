const SHA256 = require('crypto-js/sha256');
const { state } = require('./store');
const fetch = require('node-fetch');

const LOGGER_URI = 'http://localhost:3000';

const getPeerUri = peerPort => `http://localhost:${peerPort}/data`

const genesisBlock = {
  height: 0,  
  previousHash: 0x0,
  transactions: [
    {
      sender: 'coinbase',
      recipient: 'satoshi',
      amount: 50
    }
  ],
  nonce: 34
};

const getBlockHash = block => {
  return SHA256(JSON.stringify(block)).toString();
}

const executePeerRequest = async (type, data) => {
  console.log('peers', state.peers);
  console.log('executePeerRequest', type);

  let requests;

  switch(type) {
    case 'getData':
      requests = state.peers.map(peer => fetch(getPeerUri(peer)).then(response => response.json()));
    case 'postData':
      requests = state.peers.map(peer => fetch(getPeerUri(peer), {method: 'POST', body: data}).then(response => response.json()));
  }

  return await Promise.all(requests);
}

const sendLog = async logData => {
  console.log('sendLog')
  console.log('logData', logData)
  fetch(`${LOGGER_URI}/logs`, { 
    method: 'POST', 
    body: JSON.stringify(logData),
    headers: {'Content-Type': 'application/json'}
  });
}

const getLongestBlockchain = async () => {
  console.log('getLongestBlockchain');
  const allBlockchains = await executePeerRequest('getData');

  console.log('allBlockchains', allBlockchains);

  console.log(allBlockchains[0].blocks[0]);

  console.log(allBlockchains[0].blocks[1]);


  const validBlockchains = allBlockchains.filter(blockchainValidityFilter);

  console.log('validBlockchains', validBlockchains);

  let longestBlockchain = validBlockchains[0];

  for (let i = 1; i < validBlockchains.length; i++) {
    if (validBlockchains[i].block.length > longestBlockchain.blocks.length) {
      longestBlockchain = validBlockchains[i];
    }
  }

  console.log('longestBlockchain', longestBlockchain);

  return longestBlockchain;
}

const blockchainValidityFilter = blockchain => {
  // TODO: expand validation filter to include required properties and difficulty
  for (let i = 1; i < blockchain.blocks.length; i++ ) {
    if (blockchain.blocks[i].previousHash !== getBlockHash(blockchain.blocks[i - 1])) return false;
  }

  return true;
}

const targetDifficulty = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

module.exports = {
  genesisBlock,
  getBlockHash,
  executePeerRequest,
  getLongestBlockchain,
  targetDifficulty,
  sendLog
}