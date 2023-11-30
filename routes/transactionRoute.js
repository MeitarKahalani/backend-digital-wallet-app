const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const TransactionService = require('../services/transactionService');
const UserService = require('../services/userService');

const transactionService = new TransactionService();
const userService = new UserService();

// Middleware to validate user input
const validateInput = [
    check('senderId').notEmpty().isNumeric(),
    check('receiverId').notEmpty().isNumeric(),
    check('amount').notEmpty().isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Route to initiate a transaction
router.post('/initiate', validateInput, async (req, res) => {
    try {
        // Retrieve senderId, receiverId, and amount from request body
        const { senderId, receiverId, amount } = req.body;
        // Fetch sender and receiver information from the database
        const sender = await userService.getUserById(senderId);
        const receiver = await userService.getUserById(receiverId);

        // Check if sender or receiver does not exist
        if (!sender || !receiver) {
            throw new Error('Sender or Receiver not found');
        }

        // Check if sender has sufficient balance for the transaction
        if (sender.wallet.balance < amount) {
            throw new Error('Insufficient balance in the sender account');
        }

        // Initiate a new transaction and retrieve the transaction ID
        const newTransactionId = await transactionService.initiateTransaction(senderId, receiverId, amount);
        console.log(newTransactionId);
        // Respond with the new transaction ID
        res.json({ transactionId: newTransactionId });
    } catch (error) {
        console.error('Error initiating transaction:', error.message);
        res.status(500).json({ error: 'Failed to initiate transaction' });
    }
});

// Route to handle receiver response for a transaction
router.patch('/:transactionId', async (req, res) => {
    try {
        // Retrieve transactionId and response from request parameters and body
        const { transactionId } = req.params;
        const { response } = req.body;
        console.log(transactionId, response);
        // Handle the receiver's response for the specified transaction
        const result = await transactionService.handleReceiverResponse(transactionId, response);
        // Respond with the result of handling the receiver
        res.json({ message: result });
    } catch (error) {
        console.error('Error handling receiver response:', error.message);
        res.status(500).json({ error: 'Failed to handle receiver response' });
    }
});

module.exports = router;
