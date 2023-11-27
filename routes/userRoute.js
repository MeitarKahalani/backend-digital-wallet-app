const router = require("express").Router();
const UserService = require('./services/userService');

const userService = new UserService();

// User Service Endpoints
router.post('/', async (req, res) => {
    try {
      const newUser = await userService.createUser(req.body);
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  
router.get('/:userId', (req, res) => {
    // Get user information by ID
    // Example: userService.getUserById(req.params.userId).then(user => res.json(user));
  });


module.exports = router;
