const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const jwtAuthMiddleware = require('../middleware/jwtAuth');

// route to deduct marks


router.get('/getallEnrolledCourses', jwtAuthMiddleware, courseController.getAllEnrolledCourses);

router.get('/getallCoursesbyclass', jwtAuthMiddleware, courseController.getAllCoursesByClass);
// Route to get course details by course ID

// Route to enroll in a course by course ID
router.post('/enroll', jwtAuthMiddleware, courseController.enrollStudentToCourse);
// Route to get course details by query
router.get('/getallCoursesbyquery/:query', courseController.getAllCoursesByQuery);


// Route to get course details by course ID
router.get('/:courseId', courseController.getCourseDetails);

// router.get('/getallCoursesbySubject', courseController.getAllCoursesBySubject);

// route to get all exams of a course
router.get('/:courseId/getallExams', jwtAuthMiddleware, courseController.getAllExams);

// route to load a written exam
router.get('/:courseId/exams/:examId/loadWrittenExam', jwtAuthMiddleware, courseController.getWrittenExamDetails);

// route to submit the written answer
router.post('/:courseId/exams/:examId/submitWrittenAnswer', jwtAuthMiddleware, courseController.submitWrittenExamAnswers);

// route to load a mcq exam
router.get('/:courseId/exams/:examId/loadMcqExam', jwtAuthMiddleware, courseController.getMcqExamDetails);

// route to submit the mcq answer
router.post('/:courseId/exams/:examId/submitMcqAnswer', jwtAuthMiddleware, courseController.submitMcqExamAnswers);

// route to get all the exams a student has appeared in under a course
router.get('/:courseId/exams/taken', jwtAuthMiddleware, courseController.getAllExamsAppeared);

// get marks of an exam of a student under a course
router.get('/:courseId/exams/:examId/marks', jwtAuthMiddleware, courseController.getMarksOfExam);

// route to see if a student has submitted the exam or not
router.get('/:courseId/exams/:examId/submitted', jwtAuthMiddleware, courseController.checkIfExamSubmitted);

router.post('/:courseId/giveRating', jwtAuthMiddleware, courseController.giveRating);

module.exports = router;
