const SHA256 = require('crypto-js/sha256');

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

module.exports = {
  genesisBlock,
  getBlockHash
}