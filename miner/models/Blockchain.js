const { state } = require('../store');
const { executePeerRequest } = require('../utils');

class Blockchain {
  constructor(genesisBlock) {
    console.log('blockchain constructor');
    console.log('genesis block')
    if (genesisBlock) {
      this.blocks = [ genesisBlock ];
      console.log('state', state)
      this.mine();
    } else {
      console.log('getting longest blockchain')
      console.log('peers', state.peers);
      executePeerRequest('getData')
        .then(blockchains => console.log('blockchains', blockchains))
      
      
      // TODO: ping peers to get longest blockchain
    }
  }

  async getLongestBlockchain() {
    // TODO: get longest blockchain
  }

  mine() {
    console.log('Mining!')
    // TODO: implement mining
  }

  toJson() {
    return { blocks: this.blocks };
  }
}

module.exports = { Blockchain }