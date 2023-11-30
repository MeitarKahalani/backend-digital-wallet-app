const { MongoClient, ObjectId } = require('mongodb');

class UserService {
  constructor() {
    // MongoDB client initialization
    this.client = new MongoClient('mongodb://localhost:27017');
    this.db = null;
    this.collection = null;
    this.connect();
  }

  async connect() {
    try {
      // Establish connection to MongoDB
      await this.client.connect();
      this.db = this.client.db('digitalWalletDB');
      this.collection = this.db.collection('users');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  async createUser(userData) {
    try {
      const currentTime = new Date();

      // Create a new user document
      const newUser = {
        userid: userData.userid,
        username: userData.username,
        email: userData.email,
        wallet: userData.wallet,
        createdAt: currentTime.toLocaleString(),
        updatedAt: currentTime.toLocaleString(),
        transactions: [], // Initializing transactions array for the new user
        groups: []// Initializing groups array for the new user
      };

      // Insert the new user document into the collection
      const newUserUpdate = await this.collection.insertOne(newUser);
      // Fetch and return the newly created user
      const user = await this.getUserById(newUserUpdate.insertedId);
      return user;

    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Failed to create user');
    }
  }

  async getUserById(userId) {
    try {
      const userIdAsInt = parseInt(userId, 10);
      // Find and return a user document by user ID
      const user = await this.collection.findOne({ userid: userIdAsInt });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw new Error('Failed to find user');
    }
  }

  async updateUserBalance(userId, newBalance, transactionDetails) {
    try {
      // Update the user's wallet balance and log the transaction
      const updatedUser = await this.collection.findOneAndUpdate(
        { userid: userId },
        {
          $set: { 'wallet.balance': newBalance },
          $push: { transactions: transactionDetails } // Log transaction to user's history
        },
        { returnDocument: 'after' }
      );

      if (!updatedUser) {
        console.error(`User with ID ${userId} not found`);
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user balance:', error.message);
      throw new Error('Failed to update user balance');
    }
  }

}

module.exports = UserService;
