const router = require("express").Router();
const TransactionService = require('../services/transactionService');
const transactionService = new TransactionService();

// Transaction Service Endpoints
router.post('', async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;
        // console.log(senderId, receiverId, amount);
        const newTransactionId = await transactionService.initiateTransaction(senderId, receiverId, amount);
        // Updating sender and receiver balances
        const updatedBalances = await transactionService.updateSenderAndReceiverBalances(senderId, receiverId, amount, newTransactionId);
        // Processing the transaction (updating status to 'completed')
        console.log("newTransaction", newTransactionId);
        await transactionService.processTransaction(newTransactionId);
        // Notifying receiver about the transaction
        console.log('Sender balance updated:', updatedBalances.updatedSender);
        console.log('Receiver balance updated:', updatedBalances.updatedReceiver);

        res.json({ message: 'Transaction processed successfully' });
    } catch (error) {
        console.error('Error performing transaction:', error.message);
        res.status(500).json({ error: 'Failed to perform transaction' });
    }
});

router.patch('/transactions/:transactionId/decision', async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { receiverDecision } = req.body;

        await transactionService.processTransaction(transactionId, receiverDecision);
        res.json({ message: 'Transaction decision processed successfully' });
    } catch (error) {
        console.error('Error processing transaction decision:', error.message);
        res.status(500).json({ error: 'Failed to process transaction decision' });
    }
});

// router.patch('/transactions/:transactionId', async (req, res) => {
//     try {
//         const { transactionId } = req.params;
//         await transactionService.processTransaction(transactionId);
//         res.json({ message: 'Transaction processed successfully' });
//     } catch (error) {
//         console.error('Error in processing transaction:', error.message);
//         res.status(500).json({ error: 'Failed to process transaction' });
//     }
// });

module.exports = router;
