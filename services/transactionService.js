const { MongoClient, ObjectId } = require('mongodb');
const NotificationService = require('../services/notificationService');
const UserService = require('../services/userService');

class TransactionService {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017');
    this.db = null;
    this.collection = null;
    this.connect();
    this.notificationService = new NotificationService();
    this.userService = new UserService();
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("connected to MongoDB")
      this.db = this.client.db('digitalWalletDB');
      this.collection = this.db.collection('transactions');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  async initiateTransaction(senderId, receiverId, amount) {
    try {
      const transaction = {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        amount: amount,
        status: 'pending' // various statuses (pending, completed, rejected)
      };
      // Initiate the transaction
      const newTransaction = await this.collection.insertOne(transaction);
      console.log(newTransaction);
      console.log(newTransaction.insertedId);
      // await this.notificationService.sendNotification(receiverId, `You've received ${amount} dollars.`);
      return newTransaction.insertedId;
    } catch (error) {
      console.error('Error initiating transaction:', error.message);
      throw new Error('Failed to initiate transaction');
    }
  }

  async processTransaction(transactionId) {
    try {
      await this.collection.updateOne(
        { _id: transactionId },
        { $set: { status: 'completed' } }
      );
    } catch (error) {
      console.error('Error processing transaction:', error.message);
      throw new Error('Failed to process transaction');
    }
  }


  async updateSenderAndReceiverBalances(senderId, receiverId, amount, newTransactionId) {
    try {
      const sender = await this.userService.getUserById(senderId);
      const receiver = await this.userService.getUserById(receiverId);

      // console.log(sender,receiver);
      if (!sender || !receiver) {
        throw new Error('Sender or Receiver not found');
      }

      console.log(sender.wallet.balance - amount,receiver.wallet.balance + amount)
      // const updatedSender = await this.userService.updateUserBalance(sender.userid, sender.wallet.balance - amount);
      // const updatedReceiver = await this.userService.updateUserBalance(receiver.userid, receiver.wallet.balance + amount);
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
}

module.exports = TransactionService;
