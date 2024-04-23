// routes/teacher/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/teacher/profileController');
const { jwtAuthMiddleware } = require('../../authentication/authMiddlewares');

router.get('/', jwtAuthMiddleware, profileController.getProfile);
router.put('/editprofile', jwtAuthMiddleware, profileController.updateProfile);
module.exports = router;