const { MongoClient, ObjectId } = require('mongodb');

class TransactionService {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
    this.db = null;
    this.collection = null;
    this.connect();
    this.notificationService = new NotificationService();
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db('digitalWalletDB');
    this.collection = this.db.collection('transactions');
  }

  async initiateTransaction(senderId, receiverId, amount) {
    const transaction = {
      senderId: ObjectId(senderId),
      receiverId: ObjectId(receiverId),
      amount: amount,
      status: 'pending' // You can define various statuses (pending, completed, rejected)
    };
    const result = await this.collection.insertOne(transaction);
    return result.ops[0];
  }

  async processTransaction(transactionId) {
    // Update the status of the transaction to 'completed' or 'rejected'
    await this.collection.updateOne({ _id: ObjectId(transactionId) }, { $set: { status: 'completed' } });
  }

}

module.exports = TransactionService;
