// routes/admin/students.js
const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/admin/studentController');
const { jwtAuthMiddlewareAdmin } = require('../../authentication/authMiddlewares');

router.get('/', jwtAuthMiddlewareAdmin, studentController.students);

// Route to get student details
router.get('/:studentID', jwtAuthMiddlewareAdmin, studentController.getStudentDetails);

// Route to create a student
router.post('/createStudent', jwtAuthMiddlewareAdmin, studentController.createStudent);

// Route to update a student
router.put('/:studentID/updateStudent', jwtAuthMiddlewareAdmin, studentController.updateStudent);

// Route to delete a student
router.delete('/:studentID/deleteStudent', jwtAuthMiddlewareAdmin, studentController.deleteStudent);

module.exports = router;