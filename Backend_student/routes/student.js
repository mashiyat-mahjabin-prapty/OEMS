// router

// Path: routes/student.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const jwtAuthMiddleware = require('../middleware/jwtAuth');

router.get('/profile',jwtAuthMiddleware,studentController.getProfile);

router.post('/updateProfile',jwtAuthMiddleware,studentController.updateProfile);

module.exports = router;
