const SHA256 = require('crypto-js/sha256');
const { state } = require('./store');
const fetch = require('node-fetch');

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

const executePeerRequest = async (type) => {
  console.log('executePeerRequest', type);
  console.log('peers', state.peers);
  switch(type) {
    case 'getData':
      console.log('making requests')
      const requests = state.peers.map(peer => fetch(`http://localhost:${peer}/data`).then(response => response.json()));
      return await Promise.all(requests);
  }
  
}

module.exports = {
  genesisBlock,
  getBlockHash,
  executePeerRequest
}