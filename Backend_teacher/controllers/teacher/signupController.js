// controllers/signupController.js
const Teacher = require('../../models/teacher');
const Subject = require('../../models/subject');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, password, educational_qualification, date_of_birth, address, contact_number, email, expertise } = req.body;
    console.log(req.body);
    // Validate input data (check for missing fields, etc.)
    if (!name || !password || !date_of_birth || !educational_qualification || !address || !contact_number || !email || !expertise) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if teacher already exists
    const teacher = await Teacher.findOne({
      where: { email },
    });

    if (teacher) {
      return res.status(404).json({ error: 'Teacher already exists' });
    }

    // Create a new teacher record in the database
    const newTeacher = await Teacher.create({
      name,
      password,
      educational_qualification,
      rating: 0,
      date_of_birth,
      address,
      contact_number,
      email,
      expertise,
    });

    let data = {
      teacher_id: newTeacher.teacher_id,
      email: newTeacher.email,
  }
  const token = jwt.sign(data, process.env.JWT_SECRET_TEACHER);

    res.status(200).json({ token: token });
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    
    // send only the subject names
    const subjectNames = subjects.map((subject) => subject.dataValues.name);
    console.log(subjectNames);

    res.status(200).json({ subjectNames });
  } catch (err) {
    console.error('Error in getSubjects:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
