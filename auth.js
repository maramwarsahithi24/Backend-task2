const express = require('express');
const router = express.Router();

const {signup, loginUser} = require('../controllers/auth');

router.post('/login',loginUser);
router.post('/signup',signup);

module.exports=router;
