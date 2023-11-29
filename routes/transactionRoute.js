const router = require("express").Router();
const TransactionService = require('../services/transactionService');
const transactionService = new TransactionService();

// Transaction Service Endpoints
router.post('', async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;
        // console.log(senderId, receiverId, amount);
        const newTransaction = await transactionService.initiateTransaction(senderId, receiverId, amount);
        // Updating sender and receiver balances
        const updatedBalances = await transactionService.updateSenderAndReceiverBalances(senderId, receiverId, amount);
        // Processing the transaction (updating status to 'completed')
        console.log("newTransaction", newTransaction._id);
        await transactionService.processTransaction(newTransaction._id);
        // Notifying receiver about the transaction
        console.log('Sender balance updated:', updatedBalances.updatedSender);
        console.log('Receiver balance updated:', updatedBalances.updatedReceiver);

        res.json(newTransaction);
    } catch (error) {
        console.error('Error in performing transaction:', error.message);
        res.status(500).json({ error: 'Failed to perform transaction' });
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
