const { state } = require('../store');
const { getLongestBlockchain, targetDifficulty, executePeerRequest, getBlockHash, sendLog } = require('../utils');
const SHA256 = require('crypto-js/sha256');

class Blockchain {
  constructor(genesisBlock) {
    console.log('blockchain constructor');
    console.log('genesis block')
    this.mempool = [];
    this.isMining = false;
    this.blocks =[];
    if (genesisBlock) {
      this.blocks = [ genesisBlock ];
      sendLog({ sender: state.address, type: 'blockchain', data: [genesisBlock] });
      this.mine();
    } else {
      console.log('getting longest blockchain')
      console.log('peers', state.peers);
      this.setBlocksFromPeers();
    }
  }

  setBlocksFromPeers() {
    executePeerRequest('getData')
      .then(allBlockchains => getLongestBlockchain(allBlockchains))
      .then(longestBlockchain => {
        if(longestBlockchain) {
          console.log('setting blocks')
          this.blocks = longestBlockchain.blocks
          this.mine();
        }
      });
  }

  // addTransactionToMempool(transaction) {
  //   this.mempool.push(transaction);
  // }

  mine() {
    console.log('Mining!');
    this.isMining = true;

    let candidateNonce = 1;

    setInterval(() => {
      const candidateBlock = {
        height: this.blocks.length,
        previousHash: getBlockHash(this.blocks[this.blocks.length - 1]),
        transactions: [
          {
            sender: 'coinbase',
            recipient: state.address,
            amount: 50
          }
        ],
        nonce: candidateNonce
    };

    if (state.showFullMiningDebugLogs) {
      console.log('candidateBlock', candidateBlock);  
    }

    const candidateBlockStringified = JSON.stringify(candidateBlock);

    const candidateBlockHash = SHA256(candidateBlockStringified);

    candidateNonce++;

    if (BigInt(`0x${candidateBlockHash}`) < targetDifficulty) {
      console.log('Target difficulty met')
      console.log('candidateBlockHash', candidateBlockHash.toString());
      this.blocks.push(candidateBlock);

      executePeerRequest('postData', { blocks: this.blocks });

      sendLog({ sender: state.address, type: 'blockchain', data: this.blocks })
      
      candidateNonce = 1;
    }
    }, state.hashInterval)
  }

  toJson() {
    return { blocks: this.blocks };
  }
}

module.exports = { Blockchain }