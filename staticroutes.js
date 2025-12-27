const express = require('express');
const router = express.Router();
const verifyToken = require('./middleware/auth');

router.get('/login',(req, res) => {
    return res.render('login');
});

router.get('/signup',(req, res) => {
    return res.render('signup');
});

router.get('/syntexhub',verifyToken, (req, res) => {
  res.render('syntexhub');
});

module.exports = router;