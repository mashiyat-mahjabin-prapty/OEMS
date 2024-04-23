// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/admin/courseController');
const { jwtAuthMiddlewareAdmin } = require('../../authentication/authMiddlewares');

router.get('/', jwtAuthMiddlewareAdmin, courseController.courses);
// fetch all subjects
router.get('/subjects', jwtAuthMiddlewareAdmin, courseController.subjects);
// Route to get course details
router.get('/:courseID', jwtAuthMiddlewareAdmin, courseController.getCourseDetails);

// Route to create an exam
router.post('/createCourse', jwtAuthMiddlewareAdmin, courseController.createCourse);

// Route to update a course
router.put('/:courseID/updateCourse', jwtAuthMiddlewareAdmin, courseController.updateCourse);

// Route to get exam details and questions
router.get('/:courseID/exams/:examId', jwtAuthMiddlewareAdmin, courseController.getExamDetails);

// Route to create an exam under a course
router.post('/:courseID/exams/createExam', jwtAuthMiddlewareAdmin, courseController.createExam);

// Route to update an exam
router.put('/:courseID/exams/:examId/updateExam', jwtAuthMiddlewareAdmin, courseController.updateExam);

// Route to add a single question
router.post('/:courseID/exams/:examID/addQuestion', jwtAuthMiddlewareAdmin, courseController.addQuestion);

// Route to add questions
router.post('/:courseID/exams/:examID/addQuestions', jwtAuthMiddlewareAdmin, courseController.addQuestions);

// Route to update questions
router.put('/:courseID/exams/:examID/updateQuestions', jwtAuthMiddlewareAdmin, courseController.updateQuestions);

//remove a question from an exam
router.delete('/:courseID/exams/:examID/deleteQuestions', jwtAuthMiddlewareAdmin, courseController.deleteQuestions);

// Route to see all students under a course
router.get('/:courseID/students', jwtAuthMiddlewareAdmin, courseController.getStudents);

module.exports = router;
