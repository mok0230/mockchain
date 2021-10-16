class Blockchain {
  constructor(genesisBlock) {
    if (genesisBlock) {
      this.blocks = [ genesisBlock ];
      this.mine()
    } else {
      // TODO: ping peers to get longest blockchain
    }
  }

  mine() {
    console.log('Mining!')
    // TODO: implement mining
  }
}

module.exports = { Blockchain }