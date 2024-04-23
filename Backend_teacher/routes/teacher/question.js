// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/teacher/questionController');

router.get('/', questionController.questions);

// Route to create an exam
router.post('/createQuestion', questionController.createQuestion);

// Route to update questions
router.put('/:questionID/updateQuestion', questionController.updateQuestion);

// Route to delete questions
router.delete('/:questionID/deleteQuestion', questionController.deleteQuestion);

module.exports = router;
