
const EventEmitter = require('events');

class NotificationService extends EventEmitter {
  constructor() {
    super();
  }
sendNotification(userId, message) {
    console.log(`Notification successfully sent to user ${userId}: ${message}` );
  }
}


module.exports = NotificationService;