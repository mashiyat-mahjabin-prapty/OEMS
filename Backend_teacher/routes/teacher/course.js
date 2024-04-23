// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/teacher/courseController');
const { jwtAuthMiddleware } = require('../../authentication/authMiddlewares');

router.get('/', jwtAuthMiddleware, courseController.courses);

router.get('/:courseID', jwtAuthMiddleware, courseController.getCourseDetails);

// Route to get exam details and questions
router.get('/:courseID/exams/:examID', jwtAuthMiddleware, courseController.getExamDetails);

// Route to create an exam
router.post('/:courseID/createExam', jwtAuthMiddleware, courseController.createExam);

router.delete('/:courseID/exams/:examID/deleteExam', jwtAuthMiddleware, courseController.deleteExam);

// Route to update an exam
router.put('/:courseID/exams/:examID/updateExam', jwtAuthMiddleware, courseController.updateExam);

// Route to add questions
router.post('/:courseID/exams/:examID/addQuestion', jwtAuthMiddleware, courseController.addQuestion);

// update a question in an exam
router.put('/:courseID/exams/:examID/updateQuestion/:questionID', jwtAuthMiddleware, courseController.updateQuestion);

//remove a question from an exam
router.delete('/:courseID/exams/:examID/deleteQuestion/:questionID', jwtAuthMiddleware, courseController.deleteQuestion);

// get all questions of an exam
router.get('/:courseID/exams/:examID/questions', jwtAuthMiddleware, courseController.getQuestions);

// get all teachers of a course
router.get('/:courseID/teachers', jwtAuthMiddleware, courseController.getTeachers);

// get the student list and exam summary of an exam
router.get('/:courseID/exams/:examID/summary', jwtAuthMiddleware, courseController.getExamSummary);

// get all exam scripts of an exam
router.get('/:courseID/exams/:examID/scripts', jwtAuthMiddleware, courseController.getExamScripts);

// fetch the number of questions of an exam
router.get('/:courseID/exams/:examID/details', jwtAuthMiddleware, courseController.getQuestionsCount);

// update the exam status
router.put('/:courseId/exams/:examId/scripts/:studentId', jwtAuthMiddleware, courseController.updateExamStatus);

module.exports = router;
