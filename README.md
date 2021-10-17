# Mockchain

This repo holds a mock proof-of-work blockchain.

## Requirements

- Bash 5+
- Node 14+

## Getting started

To start up the blockchain, execute the `main.sh` file in this directory:

```bash
main.sh
```

Follow the prompts on the command line interface.

## Architecture

### Mining

Miners run on Node.js and are randomly assigned a hashrate. Blocks are mined on average every 10 seconds and the difficulty is adjusted every 10 blocks.

When a block is successfully mined, the miner messages its peers.

Each miner has the following endpoints:

- GET /data => fetch current state of blockchain
- POST /data => add a new block
- POST /peers => add a peer
- POST /transactions => accept a new transaction

### Transactions

Transactions are executed via the command-line interface (CLI) using prompts. Every time a new block is mined, the updated balances will appear in the terminal.

### State

Each miner maintains the state of the blockchain in its local state. It will also be displayed on the browser-based user interface.

## Future Enhancements

- Adjust difficulty every 10 seconds (or different amount of time if it makes sense)
- Add ability to execute a transaction in the UI
- Fix numerous inefficiencies on UI (particularly blockchain/balance updating)
