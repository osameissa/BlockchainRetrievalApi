// Import required modules
const express = require('express');
const path = require('path');
const Blockchain = require('./blockchain');

// Create an Express app
const app = express();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, '.'))); // to serve static files
app.use(errorHandler); // error handling middleware

// Create a new blockchain
const blockchain = new Blockchain();

// Define routes
app.get('/blockchain', getBlockchain);
app.post('/blockchain', addBlock);
app.get('/blockchain/length', getBlockchainLength);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// Route handlers
async function getBlockchain(req, res) {
    res.send(blockchain);
}

async function addBlock(req, res, next) {
    const data = req.body.data;

    if (!data) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    try {
        const newBlock = blockchain.mineBlock(data);
        blockchain.addBlock(newBlock);
        return res.json(newBlock);
    } catch (error) {
        next(error);
    }
}

async function getBlockchainLength(req, res) {
    res.json({ length: blockchain.chain.length });
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error('Server Error:', err.message);
    res.status(500).json({ error: 'Server error' });
}