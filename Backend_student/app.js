// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const examRouter = require('./routes/exam'); // Import the exam routes
const courseRouter = require('./routes/course');
const sequelize = require('./config/database');
const session = require('express-session');
const studentRouter = require('./routes/student');

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  credentials: true, // Allow credentials (cookies)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


require('dotenv').config();


// Session middleware
// app.use(
//   session({
//     secret: 'secret_key',
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//       secure: false,
//       httpOnly: false,
//       maxAge: 3600000,
//     },
//   })
// );

const Student = require('./models/student');

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
app.use('/api/student/signup', signupRouter);
app.use('/api/student/signin', signinRouter);
app.use('/api/student/exam', examRouter); // Use the exam routes


app.use('/api/student/courses',courseRouter);
// Other routes and middleware...
app.use('/api/student', studentRouter);

const port = process.env.PORT || 3001;
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Error syncing database:', err);
});
