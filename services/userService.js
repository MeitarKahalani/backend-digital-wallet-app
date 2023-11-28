const { MongoClient, ObjectId } = require('mongodb');

class UserService {
  constructor() {
    this.client = new MongoClient('mongodb://localhost:27017');
    this.db = null;
    this.collection = null;
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("connected to MongoDB")
      this.db = this.client.db('digitalWalletDB');
      this.collection = this.db.collection('users');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  async createUser(userData) {
    try {  
      console.log(`inside createUser for userD ${userData}`)
      const result = await this.collection.insertOne(userData);
      return result;
      // return;
    } catch (error) {
      console.error('Error inserting user:', error.message);
      throw new Error('Failed to create user');
    }
  }
  
  async getUserById(userId) {
    const client = new MongoClient('mongodb://localhost:27017');
  
    try {
      // await client.connect();
      // console.log("connected to MongoDB from getuser ", parseInt(userId, 10))
      const db = client.db('digitalWalletDB'); 
      const userIdAsInt = parseInt(userId, 10);

      const user = await db.collection('users').findOne({ userid:userIdAsInt});
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
    } finally {
      await client.close();
    }
  }

  async updateUserBalance(userId, newBalance) {
    try {
      const userIdAsInt = parseInt(userId, 10);
      const updatedUser = await this.collection.findOneAndUpdate(
        { userid: userIdAsInt },
        { $set: { balance: newBalance } },
        { returnDocument: 'after' } // Returns the updated document
      );
  
      if (!updatedUser.value) {
        console.error('User not found');
        throw new Error('User not found');
      }
  
      return updatedUser.value;
    } catch (error) {
      console.error('Error updating user balance:', error.message);
      throw new Error('Failed to update user balance');
    }
  }
  
}

module.exports = UserService;
