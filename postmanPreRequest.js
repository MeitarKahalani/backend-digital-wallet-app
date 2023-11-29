// // Pre-request Script or Tests section in Postman
// test User Service Post Request  
// function generateRandomId() {
//     const min = 10000000; // Minimum value for an 8-digit number
//     const max = 99999999; // Maximum value for an 8-digit number
  
//     // Generate a random number within the specified range
//     const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
  
//     return randomId;
//   }
  
//   // Usage:
//   const randomUserId = generateRandomId();
//   const randomNumber = Math.floor(Math.random() * 100) + 1;
  
//   const userName = `user_${randomNumber}`;
//   const userMail = `${userName}@gmail.com`;
  
//   const jsonData = {
//     "userid": randomUserId,
//     "username": userName,
//     "email": userMail,
//     "wallet": {
//       "balance": 15,
//       "currency": "USD"
//     }
//     // Other user-related fields
//   }
  
//   pm.sendRequest({
//     url: 'http://localhost:3000/api/users/',
//     method: 'POST',
//     header: {
//       'Content-Type': 'application/json'
//     },
//     body: {
//       mode: 'raw',
//       raw: JSON.stringify(jsonData)
//     }
//   }, function (err, res) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(res);
//     }
//   });

// // end test User Service Post Request  

// // test Transaction Service Post Request  
  
//   // Usage:
  
// // Pre-request Script or Tests section in Postman
// const jsonData = {
//     "senderId": 60124151,
//     "receiverId": 48404077,
//     "amount": 5,
//   }
  
//   pm.sendRequest({
//     url: 'http://localhost:3000/api/transactions',
//     method: 'POST',
//     header: {
//       'Content-Type': 'application/json'
//     },
//     body: {
//       mode: 'raw',
//       raw: JSON.stringify(jsonData)
//     }
//   }, function (err, res) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(res);
//     }
//   });

// // end of test Transaction Service Post Request  

