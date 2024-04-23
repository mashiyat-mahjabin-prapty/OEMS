// app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

const tsignupRouter = require('./routes/teacher/signup');
const tsigninRouter = require('./routes/teacher/signin');
const tprofile = require('./routes/teacher/profile');
const tcourseRouter = require('./routes/teacher/course'); // Import the exam routes
// const tquestionRouter = require('./routes/question');

const asignupRouter = require('./routes/admin/signup');
const asigninRouter = require('./routes/admin/signin');
const acourseRouter = require('./routes/admin/course'); // Import the course routes
const astudentRouter = require('./routes/admin/student');
const ateacherRouter = require('./routes/admin/teacher');
const aprofile = require('./routes/admin/profile');

const sequelize = require('./config/database');
require('dotenv').config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.use(express.json());

// Routes
app.use('/api/teacher/signup', tsignupRouter);
app.use('/api/teacher/signin', tsigninRouter);
app.use('/api/teacher/courses', tcourseRouter);
app.use('/api/teacher/profile', tprofile);
// app.use('/api/teacher/question', tquestionRouter);

app.use('/api/admin/signup', asignupRouter);
app.use('/api/admin/signin', asigninRouter);
app.use('/api/admin/courses', acourseRouter); // Use the course routes
app.use('/api/admin/students', astudentRouter);
app.use('/api/admin/teachers', ateacherRouter);
app.use('/api/admin/profile', aprofile);

// Other routes and middleware...

const port = process.env.PORT || 2000;
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Error syncing database:', err);
});
