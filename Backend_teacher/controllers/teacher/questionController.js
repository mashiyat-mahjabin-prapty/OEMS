// controllers/questionController.js
const Question = require('../../models/question');

// get all questions
exports.questions = async (req, res) => {
    try {
      const questions = await Question.findAll();
      res.status(200).json({ questions });
    } catch (err) {
      console.error('Error in fetching questions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// create a new question
// create a new exam
exports.createExam = async (req, res) => {
    try {
        const { question_stmt,option1, option2, option3, option4,answer,type,difficulty } = req.body;
  
        // Validate input data (check for missing fields, etc.)
        if (!question_stmt || !option1 || !answer || !type)
            return res.status(400).json({ error: 'Please provide all required fields' });
  
      await Question.create({
          question_stmt,
          option1, 
          option2, 
          option3, 
          option4,
          answer,
          type,
          difficulty,
          marks,
        });
        
        res.status(200).json({ message: 'Question updated successfully', data: question });
    } catch (err) {
      console.error('Error in creating exam:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
}

// update question
exports.updateQuestion = async (req, res) => {
  try {
    const questionID = req.params['questionID'];
    const { question_stmt,option1, option2, option3, option4,answer,type,difficulty, marks } = req.body;

    // Validate input data (check for missing fields, etc.)
    if (!questionID || !question_stmt || !option1 || !answer || !type)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the exam to which questions are to be updated
    const question = await Question.findByPk(questionID);

    if (!question) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Update the question record
    await question.update({
      question_stmt,
      option1, 
      option2, 
      option3, 
      option4,
      answer,
      type,
      difficulty,
      marks,
    });

    res.status(200).json({ message: 'Question updated successfully', data: question });
  } catch (err) {
    console.error('Error in updating questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// delete questions from an exam
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { questions } = req.body;

    // Validate input data (check for missing fields, etc.)
    if (!questionId || !questions)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the exam from which questions are to be deleted
    const question = await Question.findByPk(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Delete questions from question table
    const deletedQuestion = await Question.destroy({
      where: { questionId },
    });

    res.status(200).json({ message: 'Questions deleted successfully', data: deletedQuestions });
  } catch (err) {
    console.error('Error in deleting questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}