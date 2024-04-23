// routes/signup.js
const express = require('express');
const router = express.Router();
const signupController = require('../../controllers/admin/signupController');

// Route for teacher sign-up
router.post('/', signupController.signup);

module.exports = router;
