// routes/signin.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const signinController = require('../../controllers/teacher/signinController');

router.post('/', signinController.signin);

module.exports = router;
