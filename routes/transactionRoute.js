const router = require("express").Router();
const TransactionService = require('../services/transactionService');
const transactionService = new TransactionService();

// Transaction Service Endpoints
router.post('', async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;
        console.log(senderId, receiverId, amount);
        const newTransaction = await transactionService.initiateTransaction(senderId, receiverId, amount);
        res.json(newTransaction);
    } catch (error) {
        console.error('Error in initiating transaction:', error.message);
        res.status(500).json({ error: 'Failed to initiate transaction' });
    }
});

router.patch('/transactions/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;
        await transactionService.processTransaction(transactionId);
        res.json({ message: 'Transaction processed successfully' });
    } catch (error) {
        console.error('Error in processing transaction:', error.message);
        res.status(500).json({ error: 'Failed to process transaction' });
    }
});

module.exports = router;
