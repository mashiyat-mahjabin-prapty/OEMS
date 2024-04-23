// routes/signup.js
const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');

// Route for student sign-up
router.post('/', signupController.signup);

module.exports = router;
