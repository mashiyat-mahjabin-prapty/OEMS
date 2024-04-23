const Student = require('../models/student');
const bcrypt = require('bcrypt');


exports.getProfile = async (req, res) => {
    try {
        const stu_id = req.user.studentId;
        const student = await Student.findOne({
            where: {
                stu_id: stu_id
            },
        });
        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json(student).status(200);



    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
}


exports.updateProfile = async (req, res) => {
    try {
        const stu_id = req.user.studentId;
        const student = await Student.findOne({
            where: {
                stu_id: stu_id
            },
        });
        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }
        console.log("hello from update profile");
        console.log(req.body);
        const { name, email,password, date_of_birth, class:classs } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        student.name = name;
        student.email = email;
        student.password = hashedPassword;
        student.date_of_birth = date_of_birth;
        student.class = classs;
        await student.save();
        res.json(student).status(200);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
}