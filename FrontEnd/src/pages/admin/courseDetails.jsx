import React, { useEffect } from 'react';
import InstructorList from './instructorList';
import StudentList from './studentList';
import { Button, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ExamSchedule from './ExamSchedule';
import ThemeM from './adminTheme';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState } from 'react';


function CourseDetails() {
  const { courseId } = useParams();
  const [coursedetails, setCourse] = useState({});
  const [examdetails, setExam] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log(courseId);
    const requestOptions = {
      method: 'GET',
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };
    axios.get(`http://localhost:2000/api/admin/courses/${courseId}`, requestOptions)
    .then((response) => {
      console.log(response.data);
      setCourse(response.data.course);
      setExam(response.data.exams);
      setInstructors(response.data.teachers);
      setStudents(response.data.students);
      // console.log('examdetails:', examdetails);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [courseId]);

  
  return (
<div className="course-details">
  <Box sx={{ display: 'flex'  }}>
  < ThemeM />
      <div className="course-details__content" style={{ marginTop:'50px', marginLeft:'20px'}}>  
      {coursedetails ? (
        <div>
          <h2>Course Details</h2>
          <p><strong>Course Name:</strong> {coursedetails.name}</p>
          <p><strong>Rating:</strong> {coursedetails.rating}</p>
          <p><strong>Class:</strong> {coursedetails.class}</p>
          <p><strong>Subject:</strong> {coursedetails.subject}</p>
          <p><strong>Duration:</strong> {coursedetails.duration} Weeks</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading course details...</p>
      )}
        <div>
          <Card sx={{ width: '80vw'}}>
            <CardContent>
              <InstructorList courseID={courseId} instructorEntries={instructors} />
            </CardContent>
          </Card>        
        </div>
        <div>
          <Card sx={{ width: '80vw'}}>
            <CardContent>
              <StudentList courseID={courseId} studentEntries={students} />
            </CardContent>
          </Card>
        </div>
      
        <div>
          <Card sx={{ width:'full' }}>
              <CardContent>
                <ExamSchedule courseID={courseId} examEntries={examdetails}/>
              </CardContent>
          </Card>
        </div>
        </div>
    </Box>
  </div>
  );
};

export default CourseDetails;
