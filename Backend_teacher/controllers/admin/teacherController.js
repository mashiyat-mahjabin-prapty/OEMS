// controllers/admin/teacherController.js

const Teacher = require('../../models/teacher');

// Get all teachers
exports.teachers = async(req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.status(200).json({ teachers });
    } catch (err) {
        console.error('Error in fetching teachers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a teacher
exports.getTeacherDetails = async(req, res) => {
    try {
        const teacherID = req.params.teacherID;
        const teacher = await Teacher.findByPk(teacherID);
        res.status(200).json({ teacher });
    } catch (err) {
        console.error('Error in fetching teacher:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a teacher
exports.createTeacher = async(req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const teacher = await Teacher.create({
            name: name,
            email: email,
            password: password,
        });
        res.status(200).json({ teacher });
    } catch (err) {
        console.error('Error in creating teacher:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a teacher
exports.updateTeacher = async(req, res) => {
    try {
        const teacherID = req.params.teacherID;
        const updatedName = req.body.name;
        const updatedEmail = req.body.email;
        const updatedPassword = req.body.password;
        const teacher = await Teacher.findByPk(teacherID);
        teacher.name = updatedName;
        teacher.email = updatedEmail;
        teacher.password = updatedPassword;
        const result = await teacher.save();
        res.status(200).json({ result });
    } catch (err) {
        console.error('Error in updating teacher:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a teacher
exports.deleteTeacher = async(req, res) => {
    try {
        const teacherID = req.params.teacherID;
        const teacher = await Teacher.findByPk(teacherID);
        await teacher.destroy();
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        console.error('Error in deleting teacher:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};