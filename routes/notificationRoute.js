const router = require("express").Router();
const NotificationService = require('../services/notificationService');

const notificationService = new NotificationService();
// Notification Service Endpoints
router.post('/notifications', (req, res) => {
    // Send notification
    // Example: notificationService.sendNotification(req.body.userId, req.body.message).then(() => res.json({ success: true }));
  });


  module.exports = router;
