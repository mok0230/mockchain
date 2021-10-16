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

const getLongestBlockchain = async () => {
  console.log('getLongestBlockchain');
  const allBlockchains = await executePeerRequest('getData');

  console.log('allBlockchains', allBlockchains);
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

module.exports = {
  genesisBlock,
  getBlockHash,
  executePeerRequest,
  getLongestBlockchain
}