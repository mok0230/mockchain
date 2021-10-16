class Blockchain {
  constructor(genesisBlock) {
    console.log('blockchain constructor');
    console.log('genesis block')
    if (genesisBlock) {
      this.blocks = [ genesisBlock ];
      this.mine();
    } else {
      console.log('getting longest blockchain')
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
}

module.exports = { Blockchain }