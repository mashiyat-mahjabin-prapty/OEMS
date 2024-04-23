// controllers/signinController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Teacher = require('../../models/teacher');

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('email:', email);
    // console.log('password:', password);

    // Validate input data (check for missing fields)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the teacher by email
    const teacher = await Teacher.findOne({ where: { email } });
    
    // Check if the teacher exists
    if (!teacher) {
      return res.status(404).json({ error: 'teacher not found' });
    }

    console.log(teacher);
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token
      let data = {
          teacher_id: teacher.teacher_id,
          email: teacher.email,
      }
      const token = jwt.sign(data, process.env.JWT_SECRET_TEACHER);
      console.log('token:', token);
    res.json({token: token}).status(200);

  } catch (err) {
    console.error('Error in signin:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
