// routes/signin.js
const express = require('express');
const router = express.Router();
const signinController = require('../controllers/signinController');
const jwtAuthMiddleware = require('../middleware/jwtAuth');

router.post('/', signinController.signin);

module.exports = router;
