const router = require("express").Router();
const UserService = require('../services/userService');

const userService = new UserService();

// User Service Endpoints
router.post('', async (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Request body is empty');
    }

    console.log(JSON.stringify(req.body));
    const userData = req.body;
    const createdUser = await userService.createUser(userData);
    // console.log('User created:', createdUser);
    res.json(createdUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    console.log(req.params.userId);
    const userInfo = await userService.getUserById(req.params.userId);
    res.json(userInfo);
  } catch (error) {
    console.error('Error getting user information:', error.message);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

module.exports = router;
