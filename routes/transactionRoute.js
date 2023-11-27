const router = require("express").Router();
import TransactionService from './services/transactionService';

const transactionService = new TransactionService();

// Transaction Service Endpoints
router.post('/', (req, res) => {
    // Initiate a transaction
    // Example: transactionService.initiateTransaction(req.body.senderId, req.body.receiverId, req.body.amount).then(transaction => res.json(transaction));
  });
  
router.patch('/:transactionId', (req, res) => {
    // Process a transaction
    // Example: transactionService.processTransaction(req.params.transactionId).then(transaction => res.json(transaction));
  });

  export default router;
