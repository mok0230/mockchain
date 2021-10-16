const { state } = require('../store');
const { getLongestBlockchain } = require('../utils');

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
      this.setBlocksFromPeers();
    }
  }

  setBlocksFromPeers() {
    console.log('this in setBlocksFromPeers', this);
    getLongestBlockchain().then(longestBlockchain => this.blocks = longestBlockchain.blocks);
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