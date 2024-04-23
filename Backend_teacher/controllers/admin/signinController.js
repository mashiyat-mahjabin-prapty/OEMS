// controllers/signinController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin');

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('email:', email);
    // Validate input data (check for missing fields)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ where: { email } });

    // Check if the teacher exists
    if (!admin) {
      return res.status(404).json({ error: 'admin not found' });
    }

    console.log(admin);

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    let data = {
      admin_id: admin.admin_id,
      email: admin.email,
  }
  const token = jwt.sign(data, process.env.JWT_SECRET_ADMIN);
  console.log('token:', token);
    // Password is valid, teacher is authenticated, you can create a session or JWT token here if needed
    res.status(200).json({ token: token });
  } catch (err) {
    console.error('Error in signin:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
