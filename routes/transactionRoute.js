const router = require("express").Router();
const TransactionService = require('./services/transactionService');

const transactionService = new TransactionService();

// Transaction Service Endpoints
router.post('/transactions', async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;
        const newTransaction = await transactionService.initiateTransaction(senderId, receiverId, amount);
        res.json(newTransaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to initiate transaction' });
    }
});

router.patch('/:transactionId', (req, res) => {
    // Process a transaction
    // Example: transactionService.processTransaction(req.params.transactionId).then(transaction => res.json(transaction));
});

module.exports = router;
