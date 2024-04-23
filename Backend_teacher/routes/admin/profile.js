// profile route for admin

const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin/profileController');
const { jwtAuthMiddlewareAdmin } = require('../../authentication/authMiddlewares');

router.get('/', jwtAuthMiddlewareAdmin, profileController.getProfile);
router.put('/editprofile', jwtAuthMiddlewareAdmin, profileController.updateProfile);

module.exports = router;