const jwt = require('jsonwebtoken');

// Middleware to verify JWT tokens
const jwtAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the 'Authorization' header as 'Bearer <token>'
  // console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Attach the user data to the request object
    req.user.studentId = decodedToken.studentId; // Assuming the payload of the JWT token has a field called "studentId"
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = jwtAuthMiddleware;
