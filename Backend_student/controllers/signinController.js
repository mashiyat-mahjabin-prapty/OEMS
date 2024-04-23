const bcrypt = require('bcrypt');
const Student = require('../models/student');
const jwt = require('jsonwebtoken');

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    // Validate input data (check for missing fields)
    if (!email || !password) {
      return res.status(400).json({ error: 'Student ID and password are required' });
    }

    // Find the student by "stu_id"
    const student = await Student.findOne({ where: { email } });

    // Check if the student exists
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Password is valid, student is authenticated
    // Now, you can set the student's information in the session
    console.log('Student authenticated:', student.stu_id);
    // req.session.studentId = student.stu_id;
    // req.session.studentName = student.name;
    // req.session.email = student.email;
    // console.log(req.session.studentId);

    // res.cookie('sessionID', req.sessionID, {
    //   httpOnly: false,
    //   maxAge: 3600000, 
    //   // secure: true,
    // });

    token = jwt.sign({ studentId: student.stu_id }, process.env.JWT_SECRET, {
      expiresIn: '168h',
    });

    // Send the student's information (along with the token) to the client

    res.status(200).json({ message: 'Authentication successful', data: student, token });

    // res.status(200).json({ message: 'Authentication successful', data: student });
  } catch (err) {
    console.error('Error in signin:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
