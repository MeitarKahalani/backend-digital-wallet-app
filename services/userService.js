const { MongoClient } = require('mongodb');

class UserService {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
    this.db = null;
    this.collection = null;
    this.connect();
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db('digitalWalletDB');
    this.collection = this.db.collection('users');
  }

  async createUser(userData) {
    const result = await this.collection.insertOne(userData);
    return result.ops[0];
  }

  async getUserById(userId) {
    return await this.collection.findOne({ _id: ObjectId(userId) });
  }

  async updateUserBalance(userId, newBalance) {
    await this.collection.updateOne({ _id: ObjectId(userId) }, { $set: { balance: newBalance } });
  }
}

module.exports = UserService;