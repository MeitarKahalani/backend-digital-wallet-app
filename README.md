# Digital Wallet Microservice System

This system comprises microservices to facilitate digital wallet transactions among users. It uses Express.js for the API and MongoDB for data storage.

## Overview

The system consists of three main components:

1. **Transaction Service**: Manages transactions between users. It handles initiating transactions, processing them, and managing transaction statuses.

2. **User Service**: Handles user-related functionalities. It allows creating users, retrieving user details, and updating user balances.

3. **Notification Service**: Notifies users about pending transactions, successful transaction completions, and denials.

## Setup

### Requirements

- Node.js
- MongoDB

### Installation

1. Clone the repository: `git clone https://github.com/your-repo-url.git`
2. Install dependencies: `npm install`
3. Set up MongoDB and configure connection details in the services.

## Running the Server

To start the Server, run the following command:

`node server.js`

## API Endpoints

### User Service

- `POST /users`: Create a new user.
- `GET /users/:userId`: Get user details by ID.
- `PATCH /users/:userId`: Update user details.

### Transaction Service

- `POST /transactions/initiate`: Initiate a new transaction.
- `PATCH /transactions/:transactionId`: Handle the receiver's response to a transaction.

### Notification Service

- The notification service works internally between other services and doesn't expose external APIs.

## Future Improvements

1. **Support in groups** - Implement clusters - clusters of users can be associated to the same group which has its
own amount.
2. **Security Measures**: Implement authentication and authorization mechanisms.
3. **Transaction Validation**: Add additional checks for transaction validity.
4. **Logging**: Incorporate centralized logging for better monitoring.


