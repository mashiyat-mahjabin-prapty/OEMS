// controllers/courseController.js
const Course = require('../../models/course');
const Exam = require('../../models/exam');
const Question = require('../../models/question');
const QuestionExam = require('../../models/question_exam');
const ExamStudent = require('../../models/exam_student');
const CourseTeacher = require('../../models/teacher_course');
const Teacher = require('../../models/teacher');
const Student = require('../../models/student');
const ExamAnswer = require('../../models/exam_answer');
const axios = require('axios');

// get all courses of a teacher
exports.courses = async (req, res) => {
  try {
    const teacherID = req.jwt.teacher_id;
    console.log(teacherID);
    // Fetch all courses of a teacher
    const coursest = await CourseTeacher.findAll({
      where: { teacher_id: teacherID },
    });
    //console.log(coursest);

    // get course details from course table
    const courseIds = coursest.map((course) => course.course_id);
    //console.log(courseIds);
    const courses = await Course.findAll({
      where: { course_id: courseIds },
    });
    // console.log(courses);
    res.status(200).json({ courses });
  }
  catch (err) {
    console.error('Error in fetching courses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params['courseID'];
    console.log('Course ID:', courseId);

    // Fetch course details
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Fetch exams for the course
    const examCourseEntries = await Exam.findAll({
      where: { course_course_id: courseId },
    });
    // console.log(examCourseEntries);

    res.status(200).json({ course, examCourseEntries });
  } catch (err) {
    console.error('Error in fetching course details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getExamDetails = async (req, res) => {
  try {
    const { courseID, examID } = req.params;

    // Fetch exam details
    const exam = await Exam.findByPk(examID);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Fetch questions for the exam
    const questionExamEntries = await QuestionExam.findAll({
      where: { exam_exam_id: examID },
    });

    const questionIds = questionExamEntries.map((entry) => entry.question_question_id);

    // Fetch question details
    const questions = await Question.findAll({
      where: { question_id: questionIds },
    });

    res.status(200).json({ exam, questions });
  } catch (err) {
    console.error('Error in fetching exam details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// create a new exam
exports.createExam = async (req, res) => {
  try {
    const courseId = req.params['courseID'];
    console.log(courseId);
    const { total_marks, name, duration, exam_type } = req.body;

    // Validate input data (check for missing fields, etc.)
    if (!total_marks || !name || !exam_type)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the course to which exam is to be added
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    //check if exam name already exists
    const exam = await Exam.findOne({
      where: { name: name },
    });

    if (exam) {
      return res.status(404).json({ error: 'Exam name already exists' });
    }

    // Create new exam entry in the exam table
    const newExam = await Exam.create({
      total_marks,
      name,
      duration,
      course_course_id: courseId,
      exam_type,
    });

    res.status(200).json({ message: 'Exam created successfully', data: newExam });
  } catch (err) {
    console.error('Error in creating exam:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// update an exam
exports.updateExam = async (req, res) => {
  try {
    const { courseID, examID } = req.params;
    const { total_marks, name, duration, exam_type } = req.body;

    // Validate input data (check for missing fields, etc.)
    if (!total_marks || !name || !exam_type)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the exam to be updated
    const exam = await Exam.findByPk(examID);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    //check if exam name already exists
    const examName = await Exam.findOne({
      where: { name: name },
    });

    if (examName) {
      return res.status(404).json({ error: 'Exam name already exists' });
    }

    // Update the exam record
    await exam.update({
      total_marks,
      name,
      duration,
      exam_type,
    });

    res.status(200).json({ message: 'Exam updated successfully', data: exam });
  } catch (err) {
    console.error('Error in updating exam:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// delete an exam
exports.deleteExam = async (req, res) => {
  try {
    const { courseID, examID } = req.params;

    // Validate input data (check for missing fields, etc.)
    if (!courseID || !examID)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the exam to be deleted
    const exam = await Exam.findByPk(examID);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // delete all questions from question_exam table
    await QuestionExam.destroy({
      where: { exam_exam_id: examID },
    });

    // delete all entries from exam_student table
    await ExamStudent.destroy({
      where: { exam_exam_id: examID },
    });

    // Delete the exam record
    await Exam.destroy({
      where: { exam_id: examID },
    });

    res.status(200).json({ message: 'Exam deleted successfully', data: exam });
  } catch (err) {
    console.error('Error in deleting exam:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// add question to an exam
exports.addQuestion = async (req, res) => {
  try {
    const { courseID, examID } = req.params;
    const { question_stmt, option1, option2, option3, option4, answer, type, difficulty, marks, image_url } = req.body;

    console.log(courseID, examID, question_stmt, option1, option2, option3, option4, answer, type, difficulty, marks, image_url);

    // Validate input data (check for missing fields, etc.)
    if (!question_stmt || !option1 || !answer || !type)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the exam to which questions are to be added
    const exam = await Exam.findByPk(examID);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Create new question entry in the question table
    const newQuestion = await Question.create({
      question_stmt,
      option1,
      option2,
      option3,
      option4,
      answer,
      type,
      difficulty,
      marks,
      image_url,
    });

    // fetch the question id
    const questionId = newQuestion.question_id;

    // Add one question to the exam
    const newQuestionExam = await QuestionExam.create({
      exam_exam_id: examID,
      question_question_id: questionId,
    });

    res.status(200).json({ message: 'Question added successfully', data: newQuestionExam });
  } catch (err) {
    console.error('Error in adding questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// update a question in an exam
exports.updateQuestion = async (req, res) => {
  try {
    const { courseID, examID, questionID } = req.params;

    const { question_stmt, option1, option2, option3, option4, answer, type, difficulty, marks, image_url } = req.body;

    // Validate input data (check for missing fields, etc.)
    if (!question_stmt || !option1 || !answer || !type)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the exam to which questions are to be added
    const exam = await Exam.findByPk(examID);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Fetch the question to be updated
    const question = await Question.findByPk(questionID);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
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
      image_url,
    });

    res.status(200).json({ message: 'Question updated successfully', data: question });
  } catch (err) {
    console.error('Error in updating question:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// remove a question from an exam
exports.deleteQuestion = async (req, res) => {
  try {
    const { courseID, examID, questionID } = req.params;
    // console.log(courseID, examID, questionID);
    // Validate input data (check for missing fields, etc.)
    if (!courseID || !examID || !questionID)
      return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the question to be deleted
    const question = await Question.findByPk(questionID);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Delete the questionexam record
    await QuestionExam.destroy({
      where: { question_question_id: questionID, exam_exam_id: examID },
    });

    res.status(200).json({ message: 'Question deleted successfully', data: question });
  } catch (err) {
    console.error('Error in deleting question:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// get all questions of an exam
exports.getQuestions = async (req, res) => {
  try {
    const { courseID, examID } = req.params;
    console.log(courseID, examID);
    // Fetch all questions of an exam
    const examQuestions = await QuestionExam.findAll({
      where: { exam_exam_id: examID },
    });

    // get question details from question table
    const questionIds = examQuestions.map((question) => question.question_question_id);

    const questions = await Question.findAll({
      where: { question_id: questionIds },
    });

    res.status(200).json({ questions });
  }
  catch (err) {
    console.error('Error in fetching questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// get all teachers of a course
exports.getTeachers = async (req, res) => {
  try {
    const { courseID } = req.params;

    // Fetch all teachers of a course
    const courseTeachers = await CourseTeacher.findAll({
      where: { course_id: courseID },
    });

    // get teacher details from teacher table
    const teacherIds = courseTeachers.map((course) => course.teacher_id);

    const teachers = await Teacher.findAll({
      where: { teacher_id: teacherIds },
    });

    // send only required fields
    teachers.forEach((teacher) => {
      delete teacher.dataValues.password;
      delete teacher.dataValues.date_of_birth;
      delete teacher.dataValues.address;
      delete teacher.dataValues.contact_number;
    });
    // console.log('teachers:', teachers);
    res.status(200).json({ teachers });
  }
  catch (err) {
    console.error('Error in fetching teachers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// get the student list and exam summary of an exam
exports.getExamSummary = async (req, res) => {
  try {
    const courseID = req.params['courseID'];
    const examID = req.params['examID'];

    console.log(courseID, examID);

    // Fetch all students of an exam
    const examStudents = await ExamStudent.findAll({
      where: { exam_exam_id: examID },
    });

    // get student details from student table
    const studentIds = examStudents.map((student) => student.student_stu_id);

    const students = await Student.findAll({
      where: { stu_id: studentIds },
    });

    // send only required fields
    students.forEach((student) => {
      delete student.dataValues.password;
      delete student.dataValues.date_of_birth;
      delete student.dataValues.address;
      delete student.dataValues.contact_number;
    });

    console.log('students:', students);



    // fetch the number of students in the course
    const course = await Course.findByPk(courseID);
    // fetch all the exams of the course
    const exams = await Exam.findAll({
      where: { course_course_id: courseID },
    });
    // count the number of entries in exam_student table for each exam
    const examStudentsCount = await Promise.all(exams.map(async (exam) => {
      const examId = exam.exam_id;
      const examStudentsCount = await ExamStudent.count({
        where: { exam_exam_id: examId },
      });
      return examStudentsCount;
    }));

    // sum the entries in examStudentsCount array
    const total = examStudentsCount.reduce((a, b) => a + b, 0);

    console.log('examStudentsCount:', examStudentsCount);
    // console.log(exam);

    // make an object with student id, name, obtained marks
    const exam = examStudents.map((student) => {
      const studentId = student.student_stu_id;
      const obtainedMarks = student.obtained_marks;
      const studentName = students.find((student) => student.stu_id === studentId).name;
      const studentClass = students.find((student) => student.stu_id === studentId).class;
      return { studentId, studentName, obtainedMarks, studentClass };
    });

    res.status(200).json({ exam, total });
  } catch (err) {
    console.error('Error in fetching exam summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// get all scripts of an exam
exports.getExamScripts = async (req, res) => {
  try {
    const courseID = req.params['courseID'];
    const examID = req.params['examID'];

    console.log(courseID, examID);

    // Fetch all exam scripts of an exam
    const examScripts = await ExamAnswer.findAll({
      where: { exam_id: examID },
    });

    // search if there is any entry in the exam_student table
    const examStudents = await ExamStudent.findAll({
      where: { exam_exam_id: examID },
    });

    // for each examScripts entry if there is an entry in exam_student table then add obtained marks to the entry
    examScripts.forEach((script) => {
      const studentId = script.student_id;
      const examStudent = examStudents.find((student) => student.student_stu_id === studentId);
      if (examStudent) {
        script.dataValues.obtained_marks = examStudent.obtained_marks;
      }
      else {
        script.dataValues.obtained_marks = 0;
      }
    });

    console.log('examScripts:', examScripts);

    res.status(200).json({ examScripts });
  } catch (err) {
    console.error('Error in fetching exam scripts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getQuestionsCount = async (req, res) => {
  try {
    const courseID = req.params['courseID'];
    const examID = req.params['examID'];

    console.log(courseID, examID);

    // Fetch all questions of an exam
    const examQuestions = await QuestionExam.findAll({
      where: { exam_exam_id: examID },
    });

    console.log('examQuestions:', examQuestions);

    res.status(200).json({ questions: examQuestions.length });

  } catch (err) {
    console.error('Error in fetching questions count:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.updateExamStatus = async (req, res) => {
  try {
    const courseID = req.params['courseId'];
    const examID = req.params['examId'];
    const studentID = req.params['studentId'];
    const { isChecked, comment, marks } = req.body[0];
    // console.log(req.body);
    console.log(courseID, examID, studentID, isChecked, comment, marks);

    // Fetch the exam to which questions are to be added
    const exam = await Exam.findByPk(examID);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Fetch the student to which questions are to be added
    const student = await Student.findByPk(studentID);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the exam record
    const pp = await ExamAnswer.update({
      isChecked: isChecked,
      comment: comment,
    }, {
      where: { exam_id: examID, student_id: studentID },
    });
    if (pp) {
      console.log('updated');
    }

    // check if there is an entry in exam_student table
    const examStudent = await ExamStudent.findOne({
      where: { exam_exam_id: examID, student_stu_id: studentID },
    });

    if (examStudent) {
      // update the entry in exam_student table
      await examStudent.update({
        obtained_marks: marks,
      });
    }
    else {
      // add a new entry in exam_student table
      const newExamStudent = await ExamStudent.create({
        exam_exam_id: examID,
        student_stu_id: studentID,
        obtained_marks: marks,
      });
    }

    res.status(200).json({ message: 'Exam status updated successfully' });
  } catch (err) {
    console.error('Error in updating exam status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}