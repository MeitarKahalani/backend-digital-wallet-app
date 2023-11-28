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
    await this.client.connect();
    this.db = this.client.db('digitalWalletDB');
    this.collection = this.db.collection('transactions');
  }

  async initiateTransaction(senderId, receiverId, amount) {
    try {
      const transaction = {
        senderId: ObjectId(senderId),
        receiverId: ObjectId(receiverId),
        amount: amount,
        status: 'pending' // various statuses (pending, completed, rejected)
      };
      const result = await this.collection.insertOne(transaction);

      // Notifying receiver about the transaction
      await this.notificationService.sendNotification(receiverId, `You've received ${amount} dollars.`);

      return result.ops[0];
    } catch (error) {
      console.error('Error initiating transaction:', error.message);
      throw new Error('Failed to initiate transaction');
    }
  }

  async processTransaction(transactionId) {
    try {
      // Update the status of the transaction to 'completed'
      await this.collection.updateOne({ _id: ObjectId(transactionId) }, { $set: { status: 'completed' } });
    } catch (error) {
      console.error('Error processing transaction:', error.message);
      throw new Error('Failed to process transaction');
    }
  }

  async updateSenderAndReceiverBalances(senderId, receiverId, amount) {
    try {
      const sender = await this.userService.getUserById(senderId);
      const receiver = await this.userService.getUserById(receiverId);

      if (!sender || !receiver) {
        throw new Error('Sender or Receiver not found');
      }

      const updatedSender = await this.userService.updateUserBalance(senderId, sender.balance - amount);
      const updatedReceiver = await this.userService.updateUserBalance(receiverId, receiver.balance + amount);

      return { updatedSender, updatedReceiver };
    } catch (error) {
      console.error('Error updating balances:', error.message);
      throw new Error('Failed to update balances');
    }
  }
}

module.exports = TransactionService;
