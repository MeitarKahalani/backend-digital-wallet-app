const { MongoClient, ObjectId } = require('mongodb');
const UserService = require('../services/userService');
const NotificationService = require('../services/notificationService');

class TransactionService {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017');
    this.db = null;
    this.collection = null;
    this.userService = new UserService();
    this.notificationService = new NotificationService();
    this.connect();
  }

  // Establish a connection to the MongoDB database
  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db('digitalWalletDB');
      this.collection = this.db.collection('transactions');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  // Initiates a transaction and inserts it into the collection
  async initiateTransaction(senderId, receiverId, amount) {
    try {
      const transaction = {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        amount: amount,
        status: 'pending', // various statuses (pending, completed, rejected)
        receiverDecision: null // Keeps track of receiver's decision (accept/deny)
      };

      const newTransaction = await this.collection.insertOne(transaction);
      // Notifies the receiver about the pending transaction
      this.notificationService.sendNotification(receiverId, `You have a pending transaction. Accept or Deny?`);
      return newTransaction.insertedId;
    } catch (error) {
      console.error('Error initiating transaction:', error.message);
      throw new Error('Failed to initiate transaction');
    }
  }

  // Retrieves transaction details from Mongodb by transaction ID
  async getTransactionById(transactionId) {
    try {
      const transactionIdAsObject = new ObjectId(transactionId);
      const transactionDetails = await this.collection.findOne({ _id: transactionIdAsObject });
      return transactionDetails;
    } catch (error) {
      console.error('Error fetching transaction:', error.message);
      throw new Error('Failed to fetch transaction');
    }
  }

  // Processes a transaction by ID based on receiver's decision
  async processTransaction(transactionId) {
    try {
      const transaction = await this.getTransactionById(transactionId);
      const transactionIdAsObject = new ObjectId(transactionId);

      if (transaction.status === 'pending') {
        const receiverDecision = transaction.receiverDecision;

        let updateStatus = '';
        if (receiverDecision === 'accept') {
          // Updates transaction status to 'completed' if receiver accepts
          updateStatus = 'completed';
          // Notifies sender and receiver about the transaction completion
          this.notificationService.sendNotification(transaction.senderId, 'Receiver accepted the transaction.');
          this.notificationService.sendNotification(receiverId, `You've received ${amount} dollars.`);
        } else if (receiverDecision === 'deny') {
          // Updates transaction status to 'rejected' if receiver denies
          updateStatus = 'rejected';
          // Notifies sender about the transaction denial
          this.notificationService.sendNotification(transaction.senderId, 'Receiver denied the transaction.');
        } else {
          throw new Error('Invalid receiver decision');
        }

        // Updates the status of the transaction in the database
        await this.collection.updateOne(
          { _id: transactionIdAsObject },
          { $set: { status: updateStatus } }
        );

        if (updateStatus === 'completed') {
          // Retrieves sender and receiver details to update balances
          const { senderId, receiverId, amount } = transaction;
          // Updating sender and receiver balances
          await this.updateSenderAndReceiverBalances(senderId, receiverId, amount, transactionIdAsObject);
          // Notifies sender and receiver about the completion of the transaction
          this.notificationService.sendNotification(senderId, 'Transaction completed successfully.');
          this.notificationService.sendNotification(receiverId, 'Transaction completed successfully.');
        }
      } else {
        throw new Error('Transaction is already processed');
      }
    } catch (error) {
      console.error('Error processing transaction:', error.message);
      throw new Error('Failed to process transaction');
    }
  }

  // Updates sender and receiver balances after verifying sender has sufficient balance
  async updateSenderAndReceiverBalances(senderId, receiverId, amount, newTransactionId) {
    try {
      const sender = await this.userService.getUserById(senderId);
      const receiver = await this.userService.getUserById(receiverId);

      if (!sender || !receiver) {
        throw new Error('Sender or Receiver not found');
      }

      if (sender.wallet.balance < amount) {
        throw new Error('Insufficient balance in the sender account');
      }

      // Define transaction details for sender and receiver
      const senderTransaction = {
        transactionId: newTransactionId, // Generate a transaction ID
        type: 'debit',
        amount: amount,
        date: new Date().toLocaleString() // Date of the transaction
      };

      const receiverTransaction = {
        transactionId: newTransactionId, // Generate a transaction ID
        type: 'credit',
        amount: amount,
        date: new Date().toLocaleString() // Date of the transaction
      };

      // Update sender and receiver balances in the database
      const updatedSender = await this.userService.updateUserBalance(
        sender.userid,
        sender.wallet.balance - amount,
        senderTransaction
      );

      const updatedReceiver = await this.userService.updateUserBalance(
        receiver.userid,
        receiver.wallet.balance + amount,
        receiverTransaction
      );

      return { updatedSender, updatedReceiver };
    } catch (error) {
      console.error('Error updating balances:', error.message);
      throw new Error('Failed to update balances');
    }
  }

  // Handles receiver's response (accept/deny) for a pending transaction 
  async handleReceiverResponse(transactionId, receiverResponse) {
    try {
      const transaction = await this.getTransactionById(transactionId);
      const transactionIdAsObject = new ObjectId(transactionId);
      if (!transaction || transaction.status !== 'pending') {
        throw new Error('Invalid transaction or already processed');
      }

      if (receiverResponse === 'accept' || receiverResponse === 'deny') {
        await this.collection.updateOne(
          { _id: transactionIdAsObject },
          { $set: { receiverDecision: receiverResponse } }
        );

        await this.processTransaction(transactionId);
        return `Transaction ${receiverResponse === 'accept' ? 'accepted' : 'denied'} successfully`;
      } else {
        throw new Error('Invalid receiver response');
      }
    } catch (error) {
      console.error('Error handling receiver response:', error.message);
      throw new Error('Failed to handle receiver response');
    }
  }
}

module.exports = TransactionService;
