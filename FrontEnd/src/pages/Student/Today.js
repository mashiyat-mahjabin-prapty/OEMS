import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, Typography, Box, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

// Define your custom theme
const theme = createTheme();

function ExamList() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/student/exam/getallExamsbyCoursesEnrolled', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then((response) => response.json())
    .then((data) => {
      setExams(data.exams);
      setIsLoading(false);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Typography sx={{ fontSize: '2.0rem', fontWeight: 'bold', alignSelf: 'center' }}>
          Exam for This Week
        </Typography>

        <Box
          sx={{
            maxHeight: '500px', // Adjust this value to your preference
            overflowY: 'auto',  // Add scroll when content overflows
          }}
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : exams.length > 0 ? (
            exams.map((exam) => (
              <Box
                key={exam.exam_id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p="15px"
              >
                <Card sx={{ minWidth: 500, backgroundColor: '#fbeef7', marginBottom: '10px' }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      {exam.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {exam.exam_type}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {exam.duration} minutes
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {/* Use Link component with to prop to navigate and pass the exam ID as a query parameter */}
                    <Link
                      to={(exam.exam_type === 'MCQ' || exam.exam_type === 'mcq') ? `/mcq-exam?id=${exam.exam_id}` : `/written-exam?id=${exam.exam_id}`}
                    >
                      <Button variant="contained" color="success">
                        Exam Link
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Box>
            ))
          ) : (
            <Typography sx={{ fontSize: 16, marginTop: '10px' }}>
              No exams available.
            </Typography>
          )}
        </Box>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default ExamList;