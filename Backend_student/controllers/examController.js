// controllers/examController.js
const Exam = require('../models/exam');
const Question = require('../models/question');
const QuestionExam = require('../models/question_exam');
const ExamStudent = require('../models/exam_student');
const QuestionAnswer = require('../models/question_answer');
const StudentCourse = require('../models/student_course');
const Course = require('../models/course');

exports.getExamDetails = async (req, res) => {
  try {
    const { examId } = req.params;

    // Fetch exam details
    const exam = await Exam.findByPk(examId);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Fetch questions for the exam
    const questionExamEntries = await QuestionExam.findAll({
      where: { exam_exam_id: examId },
    });

    const questionIds = questionExamEntries.map((entry) => entry.question_question_id);

    // Fetch question details
    const questions = await Question.findAll({
      where: { question_id: questionIds },
    });

    // check the type of the question. keep only mcq type questions
    const mcqQuestions = questions.filter((question) => question.type === 'MCQ');

    res.status(200).json({ exam, mcqQuestions });
  } catch (err) {
    console.error('Error in fetching exam details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// controllers/examController.js
exports.submitExamAnswers = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    // console.log(answers[1]);

    // Calculate the student's score
    let score = 0;

    const questionExamEntries = await QuestionExam.findAll({
      where: { exam_exam_id: examId },
    });

    // using the id of question from question exam table, fetch the correct answer from question table  
    for (const entry of questionExamEntries) {
      const questionId = entry.question_question_id;

      const question = await Question.findByPk(questionId);
      const correctAnswer = question.answer;
      const studentAnswer = answers[questionId];

      if (correctAnswer === studentAnswer) {
        score++;
      }
    }


    // Save the student's score to the database
    //  console.log('checking session')
    //  console.log(req.session.studentId);
    //  console.log(req.session.studentName);
    //  get the student id from the token
    const stu_id = req.user.studentId;
    console.log('from token', stu_id);
    // const  stu_id  = req.session.studentId; // Assuming you have the student's ID from authentication middleware
    const obtainedMarks = score;
    var final_score = 0;

    const examStudentEntry = await ExamStudent.findOne({
      where: { exam_exam_id: examId, student_stu_id: stu_id },
    });

    if (examStudentEntry) {
      // If the entry already exists, update the obtained_marks value
      // check if the marks is negative then add with the obtained marks
      if (examStudentEntry.obtained_marks < 0) {
        examStudentEntry.obtained_marks = examStudentEntry.obtained_marks + obtainedMarks;
      }
      else {
        examStudentEntry.obtained_marks = obtainedMarks;
      }
      final_score = examStudentEntry.obtained_marks;

      await examStudentEntry.save();
    } else {
      // If the entry does not exist, create a new entry
      await ExamStudent.create({
        exam_exam_id: examId,
        student_stu_id: stu_id,
        obtained_marks: obtainedMarks,
      });
      final_score = obtainedMarks;
    }

    console.log('final score', final_score);

    res.status(200).json({ final_score });
  } catch (err) {
    console.error('Error in submitting exam answers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getWrittenExamDetails = async (req, res) => {
  try {
    const { examId } = req.params;

    // Fetch exam details
    const exam = await Exam.findByPk(examId);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Fetch questions for the exam
    const questionExamEntries = await QuestionExam.findAll({
      where: { exam_exam_id: examId },
    });

    const questionIds = questionExamEntries.map((entry) => entry.question_question_id);

    // Fetch question details
    const questions = await Question.findAll({
      where: { question_id: questionIds },
    });

    // check the type of the question. keep only mcq type questions
    const writtenQuestions = questions.filter((question) => question.type === 'WRITTEN' || question.type === 'Written' || question.type === 'written');

    res.status(200).json({ exam, writtenQuestions });
  } catch (err) {
    console.error('Error in fetching exam details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.submitWrittenExamAnswers = async (req, res) => {
  // create a entry with exam id and student id and answer_script_url in exam_student table
  // get the student id from the token
  const stu_id = req.user.studentId;
  const { examId } = req.params;
  console.log(examId)

  const answerScriptUrl = req.body.answer_script_url;
  console.log(stu_id);
  console.log(answerScriptUrl);
  try {
    // before inserting check if the exam_id and student_id is present if prsent just update  the answer script url
    const questionAnserEntry = await QuestionAnswer.findOne({
      where: { exam_id: examId, student_id: stu_id },
    });

    if (questionAnserEntry) {
      // If the entry already exists, update the answer script url
      questionAnserEntry.answer_script_url = answerScriptUrl;
      await questionAnserEntry.save();
    }
    else {
      // If the entry does not exist, create a new entry
      await QuestionAnswer.create({
        exam_id: examId,
        student_id: stu_id,
        answer_script_url: answerScriptUrl,
      });
    }

    res.status(200).json({ message: 'Answer script url saved successfully' });
  } catch (err) {
    console.error('Error in submitting exam answers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.deductMarks = async (req, res) => {
  try {
    const { examId } = req.params;
    const marks = 2;
    const stu_id = req.user.studentId;
    const examStudentEntry = await ExamStudent.findOne({
      where: { exam_exam_id: examId, student_stu_id: stu_id },
    });
    if (examStudentEntry) {
      // If the entry already exists, update the obtained_marks value
      // check if examStudentEntry.obtained_
      examStudentEntry.obtained_marks = examStudentEntry.obtained_marks - marks;
      await examStudentEntry.save();
    }
    else {
      // If the entry does not exist, create a new entry
      await ExamStudent.create({
        exam_exam_id: examId,
        student_stu_id: stu_id,
        obtained_marks: 0 - marks,
      });
    }
    res.status(200).json({ message: 'Marks deducted successfully' });
  }
  catch (err) {
    console.error('Error in deducting marks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }


}

exports.getallExamsbyCoursesEnrolled = async (req, res) => {

  // get the student id from the token
  const stu_id = req.user.studentId;
  // get all enrolled courses of the student from db
  const courses = await StudentCourse.findAll({
    where: { student_stu_id: stu_id },
  });

  const courseIds = courses.map((entry) => entry.course_course_id);

  // fetch all the exam details which are associated with the courses
  const exams = await Exam.findAll({
    where: { course_course_id: courseIds },
  });


  res.status(200).json({ exams });
}


exports.getStatistics = async (req, res) => {

  // get the student id from the token
  const stu_id = req.user.studentId;
  console.log('from token', stu_id);
  // get all the entries that the student has in exam_student table
  const examStudentEntries = await ExamStudent.findAll({
    where: { student_stu_id: stu_id },
  });

  // kepp the obtainedMarks from the examStudentEntries
  const obtainedMarks = examStudentEntries.map((entry) => entry.obtained_marks);



  // now get the exam ids from the exam_student table
  const examIds = examStudentEntries.map((entry) => entry.exam_exam_id);

  // now get the highest marks from the exam_student table for each examId
  const highestMarksEachExam = await Promise.all(
    examIds.map(async (entry) => {
      const examStudentEntries = await ExamStudent.findAll({
        where: { exam_exam_id: entry },
      });
      const obtainedMarks = examStudentEntries.map((entry) => entry.obtained_marks);
      console.log(obtainedMarks);
      const highestMarks = Math.max(...obtainedMarks);
      console.log(highestMarks);
      return highestMarks;
    })
  );
  
  console.log("highestMarks");
  console.log(highestMarksEachExam);
  // now get the exam details from the exam table
  const exams = await Exam.findAll({
    where: { exam_id: examIds },
  });

  // from the exams keep exam name and exam id
  const examDetails = exams.map((entry) => {
    return {
      exam_id: entry.exam_id,
      exam_name: entry.name,
      total_marks: entry.total_marks,
      course_id: entry.course_course_id,
    }
  });

  // get the name of the course from the course table
  const courseIds = examDetails.map((entry) => entry.course_id);
  const courses = await Course.findAll({
    where: { course_id: courseIds },
  });

  // from the courses keep course name and course id
  const courseDetails = courses.map((entry) => {
    return {
      course_id: entry.course_id,
      course_name: entry.name,
    }
  });

  // now add the course name to the exam details
  examDetails.forEach((entry, index) => {
    const courseName = courseDetails.find((course) => course.course_id === entry.course_id).course_name;
    examDetails[index].course_name = courseName;
  });

  console.log(examDetails);
  

  // now create a object with exam details and obtained marks
  const examDetailsWithMarks = examDetails.map((entry, index) => {
    return {
      exam_id: entry.exam_id,
      exam_name: entry.exam_name,
      total_marks: entry.total_marks,
      obtained_marks: obtainedMarks[index],
      course_name: entry.course_name,
    }
  });


  // now create a object with exam details and obtained marks and highest marks
  const examDetailsWithMarksAndHighestMarks = examDetailsWithMarks.map((entry, index) => {
    return {
      exam_id: entry.exam_id,
      exam_name: entry.exam_name,
      total_marks: entry.total_marks,
      obtained_marks: obtainedMarks[index],
      highest_marks: highestMarksEachExam[index],
      course_name: entry.course_name,
    }
  }
  );

  res.status(200).json({ examDetailsWithMarksAndHighestMarks });
}
 






