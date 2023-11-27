const router = require("express").Router();
const UserService = require('../services/userService');

const userService = new UserService();

// User Service Endpoints
router.post('/', async (req, res) => {
    try {
      const {username} = req.params;
      console.log("try");
      // let userReq = req.body;
      console.log(req.body);
      // const newUser = await userService.createUser(req.body);
      // res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  
router.get('/:userId', async (req, res) => {  
  try {
    const { userId } = req.params;
    console.log(`get-user-id : ${userId}`);
    const userInfo = await userService.getUserById(req.params.userId);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user information' });
  }
});


module.exports = router;
