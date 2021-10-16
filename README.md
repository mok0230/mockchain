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

Follow the prompts to choose how many miners to spin up and execute transactions.

## Architecture

### Mining

Miners run on Node.js and are randomly assigned a hashrate. Blocks are mined for every transaction and the difficulty is adjusted every 5 blocks to maintain a block time of 10 seconds (TODO: validate that this is the right block time).

When a block is successfully mined, the miner messages its peers.

Each miner has the following endpoints:

- POST /transactions => accept a new transaction
- POST /data => accept a new block
- GET /data => fetch current state of blockchain

### Transactions

Transactions are executed via the command-line interface (CLI) using prompts. A new block will be mined after each transaction. After a block is mined, a prompt will appear in the terminal when a new transaction can be executed.

### Blockchain

Each miner maintains the state of the blockchain in its local state. The current blockchain can be logged via the CLI.
