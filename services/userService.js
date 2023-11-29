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

  // async createUser(userData) {
  //   try {  
  //     console.log(`inside createUser for userD ${userData}`)
  //     const result = await this.collection.insertOne(userData);
  //     return result;
  //     // return;
  //   } catch (error) {
  //     console.error('Error inserting user:', error.message);
  //     throw new Error('Failed to create user');
  //   }
  // }

  async createUser(userData) {
    try {
      const currentTime = new Date();

      const newUser = {
        userid: userData.userid,
        username: userData.username,
        email: userData.email,
        wallet: userData.wallet,
        createdAt: currentTime.toLocaleString(),
        updatedAt: currentTime.toLocaleString(),
        transactions: [], // Initializing transactions array for the new user
        notifications: []// Initializing notifications array for the new user
      };

      const newUserUpdate = await this.collection.insertOne(newUser);
      const user = await this.collection.findOne({
        _id: newUserUpdate.insertedId
      });
      return user;

    } catch (error) {
      console.error('Error inserting user:', error.message);
      throw new Error('Failed to create user');
    }
  }

  async getUserById(userId) {
    try {
      const userIdAsInt = parseInt(userId, 10);
      const user = await this.collection.findOne({ userid: userIdAsInt });
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Failed to find user');
    }
  }

  async updateUserBalance(userId, newBalance, transactionDetails) {
    try {
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

  // async updateUserBalance(userId, newBalance) {
  //   try {
  //     // console.log('Searching for user with ID:', userId);
  //     // console.log('new Balance:', newBalance);

  //     const updatedUser = await this.collection.findOneAndUpdate(
  //       { userid: userId },
  //       { $set: { 'wallet.balance': newBalance } },
  //       { returnDocument: 'after' }
  //     );

  //     if (!updatedUser) {
  //       console.error(`User with ID ${userId} not found`);
  //       throw new Error('User not found');
  //     }

  //     return updatedUser;
  //   } catch (error) {
  //     console.error('Error updating user balance:', error.message);
  //     throw new Error('Failed to update user balance');
  //   }
  // }

}

module.exports = UserService;
