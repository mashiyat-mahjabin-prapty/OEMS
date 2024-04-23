// controllers/examController.js
const Course = require('../../models/course');
const Exam = require('../../models/exam');
const Question = require('../../models/question');
const QuestionExam = require('../../models/question_exam');
const CourseStudent = require('../../models/course_student');
const CourseTeacher = require('../../models/teacher_course');
const Student = require('../../models/student');
const Teacher = require('../../models/teacher');
const Subject = require('../../models/subject');

// get all courses
exports.courses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.status(200).json({ courses });
    } catch (err) {
        console.error('Error in fetching courses:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// get all subjects
exports.subjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        console.log(subjects);
        // only send the subject names
        const subjectNames = subjects.map((subject) => subject.dataValues.name);
        console.log(subjectNames);

        res.status(200).json({ subjectNames });
        
    } catch (err) {
        console.error('Error in fetching subjects:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// get the course details
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseID } = req.params;
        
        // Fetch course details
        const course = await Course.findByPk(courseID);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

         // Fetch all exams under the course
         const exams = await Exam.findAll({
            where: { course_course_id: courseID },
        });

        // fetch all instructor of the course
        const teacherIDs = await CourseTeacher.findAll({
            where: { course_id: courseID },
        });

        // fetch teachers details
        const teachers = await Promise.all(
            teacherIDs.map(async (teacherID) => {
                const { teacher_id } = teacherID.dataValues;

                const teacher = await Teacher.findByPk(teacher_id);

                return teacher;
            })
        );

        // fetch all student IDs under a course
        const studentIDs = await CourseStudent.findAll({
            where: { course_course_id: courseID },
        });

        // fetch all student details
        const students = await Promise.all(
            studentIDs.map(async (studentID) => {
                const { student_stu_id } = studentID.dataValues;

                const student = await Student.findByPk(student_stu_id);

                return student;
            })
        );

        res.status(200).json({ course, exams, teachers, students });
    } catch (err) {
        console.error('Error in fetching course details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// create a new course
exports.createCourse = async (req, res) => {
    try {
        const { name, cls, subject, duration, instructors } = req.body;
        console.log(req.body);
        // Validate input data (check for missing fields, etc.)
        if (!name || !cls || !subject || !duration || !instructors)
            return res.status(400).json({ error: 'Please provide all required fields' });

            // Check if course already exists
        const course = await Course.findOne({
            where: { name },
        });

        if (course) {
            return res.status(404).json({ error: 'Course already exists' });
        }
        // Create a new course record in the database
        const newCourse = await Course.create({
            name,
            class: cls,
            subject,
            duration,
        });

        // Add teachercourse entries to the teacher_course table
        const teacherCourseEntries = await Promise.all(
            instructors.map(async (instructor) => {
                const teacher_id = instructor;

                const teacherCourseEntry = await CourseTeacher.create({
                    teacher_id: teacher_id,
                    course_id: newCourse.course_id,
                });

                return teacherCourseEntry;
            })
        );

        res.status(200).json({ message: 'Course created successfully', data: newCourse });
    } catch (err) {
        console.error('Error in creating course:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// update a course
exports.updateCourse = async (req, res) => {
    try {
        const { courseID } = req.params;
        const { name, cls, subject, duration } = req.body;

        // Validate input data (check for missing fields, etc.)
        if (!name || !cls || !subject || !duration)
            return res.status(400).json({ error: 'Please provide all required fields' });

        // Fetch the course to be updated
        const course = await Course.findByPk(courseID);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        // Update the course record
        await course.update({
            name,
            class: cls,
            subject,
            duration,
        });

        res.status(200).json({ message: 'Course updated successfully', data: course });

    } catch (err) {
        console.error('Error in updating course:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// get exam details and questions
exports.getExamDetails = async (req, res) => {
    try {
        const { courseID, examId } = req.params;

        // Fetch exam details
        const exam = await Exam.findByPk(examId);

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // Fetch all questions under the exam
        const questions = await QuestionExam.findAll({
            where: { exam_exam_id: examId },
        });

        res.status(200).json({ exam, questions });
    } catch (err) {
        console.error('Error in fetching exam details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// create a new exam under a course
exports.createExam = async (req, res) => {
    try {
        const { courseID } = req.params;
        const { cls, total_marks, time, name, duration } = req.body;

        // Validate input data (check for missing fields, etc.)
        if (!cls || !total_marks || !time || !name)
            return res.status(400).json({ error: 'Please provide all required fields' });  

        // Create a new exam record in the database
        const newExam = await Exam.create({
            class: cls,
            total_marks,
            time,
            name,
            duration,
            course_course_id: courseID,
        });

        res.status(201).json({ message: 'Exam created successfully', data: newExam });
    } catch (err) {
        console.error('Error in creating exam:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// update an exam under a course
exports.updateExam = async (req, res) => {
    try {  
        const { courseID, examId } = req.params;
        const { cls, total_marks, time, name } = req.body;

        // Validate input data (check for missing fields, etc.)
        if (!cls || !total_marks || !time || !name)
            return res.status(400).json({ error: 'Please provide all required fields' });

        // Fetch the exam to be updated
        const exam = await Exam.findByPk(examId);

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // Update the exam record
        await exam.update({
            class: cls,
            total_marks,
            time,
            name,
            duration,
        });

        res.status(200).json({ message: 'Exam updated successfully', data: exam });
    } catch (err) {
        console.error('Error in updating exam:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// add questions to an exam under a course
exports.addQuestions = async (req, res) => {
  try {
    const { courseID, examID } = req.params;
    const { questions } = req.body;

    // Validate input data (check for missing fields, etc.)
    if (!examID || !questions)
        return res.status(400).json({ error: 'Please provide all required fields' });

    // Fetch the exam to which questions are to be added
    const exam = await Exam.findByPk(examID);

    if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
    }

    // Add questions to question table
    const newQuestions = await Question.bulkCreate(questions);
    // console.log(newQuestions);
    // fetch all the question ids inserted above
    const questionIds = newQuestions.map((question) => question.dataValues.question_id);
    // console.log(questionIds);
    // Create new question entries in the question_exam table
    const questionExamEntries = await QuestionExam.bulkCreate(
      questionIds.map((questionId) => ({
        question_question_id: questionId,
        exam_exam_id: examID,
      }))
    );

    res.status(200).json({ message: 'Questions added successfully', data: questionExamEntries });
    } catch (err) {
        console.error('Error in adding questions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// add a single question in an exam under a course
exports.addQuestion = async (req, res) => {
    try {
        const { courseID, examID } = req.params;
        const { question_stmt, option1, option2, option3, option4, answer, type, difficulty, marks, image_url  } = req.body;

        // Validate input data (check for missing fields, etc.)
        if (!question_stmt || !option1 || !answer || !type)
            return res.status(400).json({ error: 'Please provide all required fields' });

        // Fetch the exam to which question is to be added
        const exam = await Exam.findByPk(examID);

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // Add question to question table
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
            }
        );

        // get the question_id of the question inserted above
        // const questionId = newQuestion.question_id;

        // Create new question entry in the question_exam table
        const questionExamEntry = await QuestionExam.create({
            question_question_id: newQuestion.question_id,
            exam_exam_id: examID,
        });

        res.status(200).json({ message: 'Question added successfully', data: questionExamEntry });
    } catch (err) {
        console.error('Error in adding question:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// update questions of an exam under a course
exports.updateQuestions = async (req, res) => {
    try {
        const { courseID, examID } = req.params;
        const { questions } = req.body;

        // Validate input data (check for missing fields, etc.)
        if (!examID || !questions)
            return res.status(400).json({ error: 'Please provide all required fields' });

        // Fetch the exam from which questions are to be updated
        const exam = await Exam.findByPk(examID);

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // Update questions in question table
        const updatedQuestions = await Promise.all(
            questions.map(async (question) => {
                const { question_id, question_text, option1, option2, option3, option4, correct_option } = question;

                const updatedQuestion = await Question.update(
                    {
                        question_text,
                        option1,
                        option2,
                        option3,
                        option4,
                        correct_option,
                    },
                    {
                        where: { question_id },
                    }
                );

                return updatedQuestion;
            })
        );

        res.status(200).json({ message: 'Questions updated successfully', data: updatedQuestions });
    } catch (err) {
        console.error('Error in updating questions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// delete questions from an exam
exports.deleteQuestions = async (req, res) => {
    try {
        const { courseID, examID } = req.params;
        const { questions } = req.body;
        
        // Validate input data (check for missing fields, etc.)
        if (!examID || !questions)
            return res.status(400).json({ error: 'Please provide all required fields' });

        // Fetch the exam from which questions are to be deleted
        const exam = await Exam.findByPk(examID);

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // Delete questions from question table
        const deletedQuestions = await Promise.all(
            questions.map(async (question) => {
                const { question_id } = question;

                const deletedQuestion = await QuestionExam.destroy({
                    where: { exam_exam_id: examID, question_id },
                });

                return deletedQuestion;
            })
        );

        res.status(200).json({ message: 'Questions deleted successfully', data: deletedQuestions });
    } catch (err) {
        console.error('Error in deleting questions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// get all students under a course
exports.getStudents = async (req, res) => {
    try {
        const { courseID } = req.params;

        // Fetch all student IDs under a course
        const studentIDs = await CourseStudent.findAll({
            where: { course_course_id: courseID },
        });

        // Fetch all student details
        const students = await Promise.all(
            studentIDs.map(async (studentID) => {
                const { student_stu_id } = studentID.dataValues;

                const student = await Student.findByPk(student_stu_id);

                return student;
            })
        );

        res.status(200).json({ students });
    } catch (err) {
        console.error('Error in fetching students:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get all teachers under a course
exports.getTeachers = async (req, res) => {
    try {
        const { courseID } = req.params;

        // Fetch all teacher IDs under a course
        const teacherIDs = await CourseTeacher.findAll({
            where: { course_course_id: courseID },
        });

        // Fetch all teacher details
        const teachers = await Promise.all(
            teacherIDs.map(async (teacherID) => {
                const { teacher_tea_id } = teacherID.dataValues;

                const teacher = await Teacher.findByPk(teacher_tea_id);

                return teacher;
            })
        );

        res.status(200).json({ teachers });
    } catch (err) {
        console.error('Error in fetching teachers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}