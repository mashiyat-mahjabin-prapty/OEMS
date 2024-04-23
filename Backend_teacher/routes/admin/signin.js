// routes/signin.js
const express = require('express');
const router = express.Router();
const signinController = require('../../controllers/admin/signinController');

router.post('/', signinController.signin);

module.exports = router;
