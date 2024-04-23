// routes/examRoutes.js
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const jwtAuthMiddleware = require('../middleware/jwtAuth');

router.post('/:examId/deductMarks', jwtAuthMiddleware, examController.deductMarks);
// Route to get exam details and questions
router.get('/mcq/:examId', examController.getExamDetails);

// Route to get exam details and questions for written exam
router.get('/written/:examId', examController.getWrittenExamDetails);

// Route to submit exam answers and calculate the score
router.post('/mcq/:examId/submit', jwtAuthMiddleware, examController.submitExamAnswers);

router.post('/written/:examId/submit', jwtAuthMiddleware, examController.submitWrittenExamAnswers);

router.get('/getallExamsbyCoursesEnrolled', jwtAuthMiddleware, examController.getallExamsbyCoursesEnrolled);

router.get('/getStatistics', jwtAuthMiddleware, examController.getStatistics);

module.exports = router;
