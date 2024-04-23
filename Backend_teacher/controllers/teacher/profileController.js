// controller for teacher profile page

const Teacher = require('../../models/teacher');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    try{ 
        console.log('req', req.jwt.teacher_id);
        const teacher = await Teacher.findByPk(req.jwt.teacher_id);
        console.log(teacher);
        res.json(teacher).status(200);
    } catch (err) {
        console.error('Error in getProfile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.jwt.teacher_id);
        const { name, email, contact_number, password, educational_qualification, address, date_of_birth } = req.body;

        // check if email is already in use
        const emailInUse = await Teacher.findOne({ where: { email } });
        if (emailInUse && emailInUse.teacher_id !== teacher.teacher_id) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        
        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);
        teacher.name = name;
        teacher.email = email;
        teacher.contact_number = contact_number;
        teacher.password = encryptedPassword;
        teacher.educational_qualification = educational_qualification;
        teacher.address = address;
        teacher.date_of_birth = date_of_birth;
        await teacher.save();

        res.json(teacher).status(200);
    } catch (err) {
        console.error('Error in updateProfile:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}