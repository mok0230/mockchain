const SHA256 = require('crypto-js/sha256');

const genesisBlock = {
  height: 0,  
  previousHash: 0x0,
  transactions: [],
  nonce: 1 // TODO: update nonce to match difficulty
};

const getBlockHash = block => {
  return SHA256(block);
}

module.exports = {
  genesisBlock,
  getBlockHash
}