
const EventEmitter = require('events');

class NotificationService extends EventEmitter {
  constructor() {
    super();
  }

sendNotification(userId, message) {
    console.log(`Notification successfully sent to user ${userId}: ${message}` );
  }
  // async sendNotification(userId, message, retries = 3, delay = 1000) {
  //   let retryCount = 0;

  //   const send = () => {
  //     setTimeout(() => {
  //       // Simulate sending notification asynchronously
  //       if (retryCount < retries) {
  //         console.log(`Retrying notification to user ${userId}, attempt ${retryCount + 1}`);
  //         retryCount++;
  //         send();
  //       } else {
  //         console.log(`Notification successfully sent to user ${userId}: ${message}` );
  //         // Emit a success event or perform other actions
  //         this.emit('notificationSent', { userId, message });
  //       }
  //     }, delay);
  //   };

  //   send();
  // }
}



module.exports = NotificationService;