// controllers/signupController.js
const Student = require('../models/student');

exports.signup = async (req, res) => {
  try {
    const { name, password, date_of_birth, class: studentClass, email } = req.body;

    // Ensure the "class" field is treated as an integer
    const classAsInteger = parseInt(studentClass);

    // Validate input data (check for missing fields, etc.)
    if (!name || !password || !date_of_birth || !classAsInteger || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    //check if email already exists
    const stu = await Student.findOne({ where: { email } });

    if (stu) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate a random integer between 1 and 1000000 for "stu_id"
    //const stu_id = Math.floor(Math.random() * 1000000) + 1;

    // Create a new student record in the database
    const newStudent = await Student.create({
      class: classAsInteger,
      name,
      password,
      date_of_birth,
      email,
    });

    res.status(201).json({ message: 'Student created successfully', data: newStudent });
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
