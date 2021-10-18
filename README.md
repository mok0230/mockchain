# Mockchain

This repo holds a mock proof-of-work blockchain. It was built on a short time-scale so there are various areas that were short coursed.

## Requirements

- Bash 5+
- Node 14+

## Getting started

To start up the blockchain, execute the `main.sh` file in this directory:

```bash
./main.sh
```

Follow the prompts on the command line interface.

## Architecture

### Mining

Miners run on Node.js and are randomly assigned a hashrate. On various events such as the successful mining of a block, the miner makes requests to its peer miners.

### State

Each miner maintains the state of the blockchain in its local state. It is also displayed on the browser-based user interface.

### Logging

The logger Node.js process receives messages from miners and communicates with the client via a WebSocket connection.

### Client

The hashrates and account balances as well as a block explorer are surfaced on a browser-based user interface. It is programmatically launched as part of the main process.

## Future Enhancements

There are many areas where this repo is currently lacking. A few examples are:

- Adjust difficulty every 10 seconds (or different amount of time if it makes sense)
- Add ability to execute a transaction in the UI
- Fix numerous inefficiencies on UI (particularly blockchain/balance updating)
