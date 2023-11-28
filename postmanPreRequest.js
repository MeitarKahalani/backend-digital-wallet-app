// Pre-request Script or Tests section in Postman

// test User Service Post Request  
function generateRandomId() {
  const min = 10000000; // Minimum value for an 8-digit number
  const max = 99999999; // Maximum value for an 8-digit number

  // Generate a random number within the specified range
  const randomId = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomId;
}

// Usage:
const randomUserId = generateRandomId();

const jsonData = {
  "userid": randomUserId,
  "username": "user1",
  "email": "user1@example.com",
  "wallet": {
    "balance": 15,
    "currency": "USD"
  },
  "notifications": [] // Array to store notifications for this user
  // Other user-related fields
}

pm.sendRequest({
  url: 'http://localhost:3000/api/users/',
  method: 'POST',
  header: {
    'Content-Type': 'application/json'
  },
  body: {
    mode: 'raw',
    raw: JSON.stringify(jsonData)
  }
}, function (err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log(res);
  }
});

// end test User Service Post Request  

// test Transaction Service Post Request  
  
  // Usage:
  
  const jsonData = {
    "senderId": randomUserId,
    "receiverId": "user1",
    "amount": 15,
  }
  
  pm.sendRequest({
    url: 'http://localhost:3000/api/users/',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    body: {
      mode: 'raw',
      raw: JSON.stringify(jsonData)
    }
  }, function (err, res) {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  });
  
