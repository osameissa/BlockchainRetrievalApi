const SHA256 = require('crypto-js/sha256');

// Block class
class Block {
    constructor(index, timestamp, data, previousHash = '', nonce = 0) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
}

// Blockchain class
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        if (!newBlock.data) {
            throw new Error('Block must contain data');
        }
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    mineBlock(data) {
        const latestBlock = this.getLatestBlock();
        const index = latestBlock.index + 1;
        const timestamp = Date.now();
        const previousHash = latestBlock.hash;

        let nonce = 0;
        let hash = SHA256(index + previousHash + timestamp + JSON.stringify(data) + nonce).toString();

        const difficulty = 3; // number of zeros hash must start with
        const target = '0'.repeat(difficulty);
        while (hash.substring(0, difficulty) !== target) {
            nonce++;
            hash = SHA256(index + previousHash + timestamp + JSON.stringify(data) + nonce).toString();
        }

        return new Block(index, timestamp, data, previousHash, nonce);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// Export the Blockchain class
module.exports = Blockchain;