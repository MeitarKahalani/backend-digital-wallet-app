
const EventEmitter = require('events');

class NotificationService extends EventEmitter {
  constructor() {
    super();
  }

  sendNotification(userId, message, retries = 3, delay = 1000) {
    let retryCount = 0;

    const send = () => {
      setTimeout(() => {
        // Simulate sending notification asynchronously
        if (retryCount < retries) {
          console.log(`Retrying notification to user ${userId}, attempt ${retryCount + 1}`);
          this.emit('notification', { userId, message });
          retryCount++;
          send();
        } else {
          console.log(`Notification failed after ${retries} attempts for user ${userId}`);
        }
      }, delay);
    };

    send();
  }
}

module.exports = NotificationService;