const express = require('express')
const router = express.Router();

const {
  SignUp,
  Login,
  Protected
} = require('../controllers/auth.controllers')

const {
  authenticateToken
} = require('../middleware/auth.middleware')

router.post('/signup', SignUp);
router.post('/signin', Login);
router.post('/protected', authenticateToken, Protected);

module.exports = router;