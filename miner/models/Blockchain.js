const { state } = require('../store');
const { getLongestBlockchain, targetDifficulty, executePeerRequest, getBlockHash, sendLog } = require('../utils');
const SHA256 = require('crypto-js/sha256');

class Blockchain {
  constructor(genesisBlock) {
    console.log('blockchain constructor');
    console.log('genesis block')
    this.mempool = [];
    if (genesisBlock) {
      this.blocks = [ genesisBlock ];
      console.log('state', state)
      this.mine();
    } else {
      console.log('getting longest blockchain')
      console.log('peers', state.peers);
      this.setBlocksFromPeers();
    }
  }

  setBlocksFromPeers() {
    getLongestBlockchain().then(longestBlockchain => {
      console.log('setting blocks')
      this.blocks = longestBlockchain.blocks
      this.mine();
    });
  }

  // addTransactionToMempool(transaction) {
  //   this.mempool.push(transaction);
  // }

  mine() {
    console.log('Mining!')

    const { blocks } = this;

    let candidateNonce = 1;

    setInterval(() => {
      const candidateBlock = {
        height: blocks.length,
        previousHash: getBlockHash(blocks[blocks.length - 1]),
        transactions: [
          {
            sender: 'coinbase',
            recipient: state.address,
            amount: 50
          }
        ],
        nonce: candidateNonce
    };

    console.log('candidateBlock', candidateBlock);

    const candidateBlockStringified = JSON.stringify(candidateBlock);

    const candidateBlockHash = SHA256(candidateBlockStringified);

    candidateNonce++;

    if (BigInt(`0x${candidateBlockHash}`) < targetDifficulty) {
      console.log('Target difficulty met')
      console.log('candidateBlockHash', candidateBlockHash.toString());
      executePeerRequest('postData', candidateBlock);
      sendLog(candidateBlock)
      blocks.push(candidateBlock);
      candidateNonce = 1;
    }
    }, state.hashInterval)
  }

  toJson() {
    return { blocks: this.blocks };
  }
}

module.exports = { Blockchain }