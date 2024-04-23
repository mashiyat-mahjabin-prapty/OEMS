// controllers/signupController.js
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { Name, password, email } = req.body;

    // Validate input data (check for missing fields, etc.)
    if (!Name || !password || !email) {
      return res.status(404).json({ error: 'All fields are required' });
    }

    // Check if admin already exists
    const admin = await Admin.findOne({
      where: { email },
    });

    if (admin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Create a new admin record in the database
    const newAdmin = await Admin.create({
      Name,
      password,
      email,
    });

    let data = {
      admin_id: newAdmin.admin_id,
      email: newAdmin.email,
  }
  const token = jwt.sign(data, process.env.JWT_SECRET_ADMIN);

    res.status(200).json({ token: token });
  } catch (err) {
    console.error('Error in signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
