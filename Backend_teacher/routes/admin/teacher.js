// routes/admin/teachers.js
const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/admin/teacherController');
const { jwtAuthMiddlewareAdmin } = require('../../authentication/authMiddlewares');

router.get('/', jwtAuthMiddlewareAdmin, teacherController.teachers);

// Route to get teacher details
router.get('/:teacherID', jwtAuthMiddlewareAdmin, teacherController.getTeacherDetails);

// Route to create a teacher
router.post('/createTeacher', jwtAuthMiddlewareAdmin, teacherController.createTeacher);

// Route to update a teacher
router.put('/:teacherID/updateTeacher', jwtAuthMiddlewareAdmin, teacherController.updateTeacher);

// Route to delete a teacher
router.delete('/:teacherID/deleteTeacher', jwtAuthMiddlewareAdmin, teacherController.deleteTeacher);

module.exports = router;