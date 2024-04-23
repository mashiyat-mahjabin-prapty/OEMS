const Course = require('../models/course');
const StudentCourse = require('../models/student_course');
const Student = require('../models/student');
const Exam = require('../models/exam');
const Question = require('../models/question');
const QuestionExam = require('../models/question_exam');
const ExamStudent = require('../models/exam_student');
const QuestionAnswer = require('../models/question_answer');

const { Op } = require('sequelize');

exports.getAllEnrolledCourses = async (req, res) => {
    try {
        //    get student id from token
        console.log("hello from get all enrolled courses");
        const studentId = req.user.studentId;

        // Fetch course details
        const courses = await StudentCourse.findAll({
            where: { student_stu_id: studentId },
        });

        if (!courses) {
            return res.status(404).json({ error: 'Courses not found' });
        }
        // now get course details from course table
        //console.log(courses);
        var courseIds = [];
        for (var i = 0; i < courses.length; i++) {
            courseIds.push(courses[i].course_course_id);
        }
        //console.log(courseIds);
        const coursesWithDetails = await Course.findAll({
            where: { course_id: courseIds },
        });
        //console.log(courses);

        // console.log(coursesWithDetails);

        res.status(200).json({ coursesWithDetails });
    } catch (err) {
        res.status(500).json({ error: 'Internal server2 error' });
    }
}


exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Fetch course details
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({ course });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get all courses for a student by students class
exports.getAllCoursesByClass = async (req, res) => {
    try {
        //    get student id from session
        console.log("debug");
        const studentId = req.user.studentId;
        console.log(studentId);
        const student = await Student.findByPk(studentId);
        const class_of_student = student.class;

        console.log(class_of_student);


        // Fetch course details
        const courses = await Course.findAll({
            where: { class: class_of_student },
        });

        if (!courses) {
            return res.status(404).json({ error: 'Courses not found' });
        }

        // send only the courses that the student is not enrolled to
        // get all the courses that the student is enrolled to
        const student_courses = await StudentCourse.findAll({
            where: { student_stu_id: studentId },
        });

        //console.log(student_courses);

        // get all the course ids that the student is enrolled to
        var courseIds = [];
        for (var i = 0; i < student_courses.length; i++) {
            courseIds.push(student_courses[i].course_course_id);
        }

        //console.log(courseIds);

        // remove all the courses that the student is enrolled to
        var coursesNotEnrolled = [];
        for (var i = 0; i < courses.length; i++) {
            if (!courseIds.includes(courses[i].course_id)) {
                coursesNotEnrolled.push(courses[i]);
            }
        }

        // console.log(coursesNotEnrolled);
        // console.log(courses);
        res.status(200).json({ coursesNotEnrolled });
    } catch (err) {
        res.status(500).json({ error: 'Internal  server error' });
    }
}

// get all courses for a student by his query
exports.getAllCoursesByQuery = async (req, res) => {
    try {
        //    get student id from session
        const studentId = req.session.studentId;
        const student = await Student.findByPk(studentId);
        const class_of_student = student.class;

        const { query } = req.params;

        // Fetch course details
        const courses = await Course.findAll({
            where: { class: class_of_student, name: { [Op.like]: `%${query}%` } },
        });

        if (!courses) {
            return res.status(404).json({ error: 'Courses not found' });
        }

        res.status(200).json({ courses });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get all enrolled courses of a student, use jwt



// get all courses for a student by  subject

// exports.getAllCoursesBySubject = async (req, res) => {
//     try {
//         //    get student id from session
//         const studentId = req.session.studentId;
//         const student = await Student.findByPk(studentId);
//         const class_of_student = student.class;
//         const { subject } = req.params;

//         // Fetch course details
//         const courses = await Course.findAll({
//             where: { class: class_of_student, subject: subject },
//         });

//         if (!courses) {
//             return res.status(404).json({ error: 'Courses not found' });
//         }

//         res.status(200).json({ courses });
//     } catch (err) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

// enroll a student to a course

// exports.enrollStudentToCourse1 = async (req, res) => {
//     try {

//         // take course id from body
//         console.log("hello from enroll student to course");
//         const  courseId  = req.body.courseId;
//         console.log(req.body);
//         console.log(courseId);
//         const studentId = req.user.studentId;
//         // check if course exists
//         const course = await Course.findByPk(courseId);

//         if (!course) {
//             return res.status(404).json({ error: 'Course not found' });
//         }

//         // check if the class of the course matches the student's class
//         const student = await Student.findByPk(studentId);
//         const class_of_student = student.class;

//         if (class_of_student !== course.class) {
//             return res.status(400).json({ error: 'Course does not match student class' });
//         }



//         // check if student is already enrolled
//         const student_course = await StudentCourse.findOne({
//             where: { student_stu_id: studentId, course_course_id: courseId },
//         });

//         console.log(student_course);

//         if (student_course) {
//             return res.status(400).json({ error: 'Student already enrolled' });
//         }

//         //console.log("debug");
//         // enroll student to course
//         const student_course_enrollment = await StudentCourse.create({
//             student_stu_id: studentId,
//             course_course_id: courseId,
//             rating: 0,
//         });

//         res.status(200).json({ student_course_enrollment });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

exports.enrollStudentToCourse = async (req, res) => {
    try {
        console.log("hello from enroll student to course");
        const courseIds = req.body.selected;
        console.log(req.body);
        console.log(courseIds);
        const studentId = req.user.studentId;

        // find all the courses with the courseIds
        const courses = [];
        for (const courseId of courseIds) {
            const course = await Course.findByPk(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            courses.push(course);

            // check if the class of the course matches the student's class
            const student = await Student.findByPk(studentId);
            const class_of_student = student.class;

            if (class_of_student !== course.class) {
                return res.status(400).json({ error: 'Course does not match student class' });
            }
            // check if student is already enrolled
            const student_course = await StudentCourse.findOne({
                where: { student_stu_id: studentId, course_course_id: course.course_id },
            });

            if (student_course) {
                return res.status(400).json({ error: 'Student already enrolled' });
            }
        }

        // enroll student to courses
        const student_course_enrollments = [];
        for (const course of courses) {
            const student_course_enrollment = await StudentCourse.create({
                student_stu_id: studentId,
                course_course_id: course.course_id,
                rating: 0,
            });
            student_course_enrollments.push(student_course_enrollment);
        }

        res.status(200).json({ student_course_enrollments });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllExams = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Fetch course details
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Fetch exams
        const exams = await Exam.findAll({
            where: { course_course_id: courseId },
        });

        if (!exams) {
            return res.status(404).json({ error: 'Exams not found' });
        }

        res.status(200).json({ exams });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getWrittenExamDetails = async (req, res) => {
    try {
        console.log(req.params);
        const examId = req.params.examId;

        console.log(examId);
        // Fetch exam details
        const exam = await Exam.findByPk(examId);
        console.log(exam);
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
        console.log(questions);

        res.status(200).json({ exam, questions });
    } catch (err) {
        console.error('Error in fetching exam details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.submitWrittenExamAnswers = async (req, res) => {
    // create a entry with exam id and student id and answer_script_url in exam_student table
    // get the student id from the token
    console.log(req);
    const stu_id = req.user.studentId;
    const examId = req.params.examId;
    console.log(examId);

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

exports.getMcqExamDetails = async (req, res) => {
    try {
        console.log(req.params);
        const examId = req.params['examId'];

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
exports.submitMcqExamAnswers = async (req, res) => {
    try {
        const examId = req.params['examId'];
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

exports.getAllExamsAppeared = async (req, res) => {
    try {
        const { courseId } = req.params;
        const stu_id = req.user.studentId;

        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const exams = await Exam.findAll({ where: { course_course_id: courseId } });

        if (!exams) {
            return res.status(404).json({ error: 'Exams not found' });
        }

        const examStudentEntries = await ExamStudent.findAll({
            where: { student_stu_id: stu_id },
        });

        const questionAnswerEntries = await QuestionAnswer.findAll({
            where: { student_id: stu_id },
        });

        const examIdsAppeared = [
            ...examStudentEntries.map((entry) => entry.exam_exam_id),
            ...questionAnswerEntries.map((entry) => entry.exam_id),
        ];

        const examsAppeared = exams.filter((exam) =>
            examIdsAppeared.includes(exam.exam_id)
        );
        
        console.log(examsAppeared);

        res.status(200).json({ examsAppeared });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getMarksOfExam = async (req, res) => {
    try {
        const { examId } = req.params;

        // Fetch exam details
        const exam = await Exam.findByPk(examId);

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // get the student id from the token
        const stu_id = req.user.studentId;

        // Fetch exams
        const examStudentEntry = await ExamStudent.findOne({
            where: { exam_exam_id: examId, student_stu_id: stu_id },
        });

        if (!examStudentEntry) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        console.log(examStudentEntry);
        res.status(200).json({ examStudentEntry });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.checkIfExamSubmitted = async (req, res) => {
    try {
        const { examId } = req.params;

        // Fetch exam details
        const exam = await Exam.findByPk(examId);

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        // get the student id from the token
        const stu_id = req.user.studentId;

        // Fetch exams
        const questionAnswerEntry = await QuestionAnswer.findOne({
            where: { exam_id: examId, student_id: stu_id },
        });

        if (!questionAnswerEntry) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        console.log(questionAnswerEntry);
        res.status(200).json({ questionAnswerEntry });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.giveRating = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating } = req.body;

        // get the student id from the token
        const stu_id = req.user.studentId;

        // Fetch course details
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Fetch student course entry
        const studentCourseEntry = await StudentCourse.findOne({
            where: { student_stu_id: stu_id, course_course_id: courseId },
        });

        if (!studentCourseEntry) {
            return res.status(404).json({ error: 'Student course entry not found' });
        }

        // check if the student has already given a rating
        if (studentCourseEntry.rating !== 0) {
            return res.status(200).json({ message: 'Student has already given a rating' });
        }
        studentCourseEntry.rating = rating;
        await studentCourseEntry.save();

        // Now update the rating of the course in the course table
        const prevRating = course.rating;
        const prevNumRatings = course.num_ratings;

        const newRating = (prevRating * prevNumRatings + rating) / (prevNumRatings + 1);
        course.rating = newRating;
        course.num_ratings = prevNumRatings + 1;
        await course.save();





        res.status(200).json({ message: 'Rating saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}