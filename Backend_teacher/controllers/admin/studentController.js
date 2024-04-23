// controllers\admin\studentController.js

const Student = require('../../models/student');
const CourseStudent = require('../../models/course_student');
const Course = require('../../models/course');

// Get all students
exports.students = async(req, res) => {
    try {
        const tempStudents = [];
        const students = await Student.findAll();
        // fetch the course list for each student from student_course table
        for (let i = 0; i < students.length; i++) {
            const studentID = students[i].stu_id;
            const courseStudents = await CourseStudent.findAll({
                where: { student_stu_id: studentID },
            });
            const courseIDs = courseStudents.map((courseStudent) => {
                return courseStudent.course_course_id;
            });
            const courses = await Course.findAll({
                where: { course_id: courseIDs },
            });
            tempStudents.push({
                stu_id: students[i].stu_id,
                name: students[i].name,
                email: students[i].email,
                class: students[i].class,
                courses: courses,
            });
        }

        console.log(tempStudents);

        res.status(200).json({ tempStudents });
    } catch (err) {
        console.error('Error in fetching students:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a student
exports.getStudentDetails = async(req, res) => {
    try {
        const studentID = req.params.studentID;
        const student = await Student.findByPk(studentID);
        res.status(200).json({ student });
    } catch (err) {
        console.error('Error in fetching student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a student
exports.createStudent = async(req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const student = await Student.create({
            name: name,
            email: email,
            password: password,
        });
        res.status(200).json({ student });
    } catch (err) {
        console.error('Error in creating student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a student
exports.updateStudent = async(req, res) => {
    try {
        const studentID = req.params.studentID;
        const updatedName = req.body.name;
        const updatedEmail = req.body.email;
        const updatedPassword = req.body.password;
        const student = await Student.findByPk(studentID);
        student.name = updatedName;
        student.email = updatedEmail;
        student.password = updatedPassword;
        const result = await student.save();
        res.status(200).json({ result });
    } catch (err) {
        console.error('Error in updating student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a student
exports.deleteStudent = async(req, res) => {
    try {
        const studentID = req.params.studentID;
        const student = await Student.findByPk(studentID);
        await student.destroy();
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error in deleting student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};